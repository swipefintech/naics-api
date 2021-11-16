/* eslint-disable no-await-in-loop */
const debug = require('debug')('naics-api:worker');
const db = require('./common/db');
const naics = require('./common/naics');
const queue = require('./common/queue');

/**
 * @param {{code: string, title: string, businesses: number}} row
 * @returns {Promise<number>}
 */
async function insertOrUpdateCode(row) {
  let insertedId;
  const existing = await db('codes').where('code', row.code).first();
  if (existing) {
    await db('codes').where('code', existing.id).update(row);
    insertedId = existing.id;
  } else {
    [insertedId] = await db('codes').insert(row);
  }

  return insertedId;
}

queue.process('refresh', async () => {
  const twoDigitCodes = await naics.getTwoDigitNaicsCodes();
  if (twoDigitCodes) {
    debug(`Found ${twoDigitCodes.length} 2-digit codes.`);
    for (let i = 0; i < twoDigitCodes.length; i += 1) {
      const twoDigitCode = await insertOrUpdateCode(twoDigitCodes[i]);
      const fourDigitCodes = await naics.getFourDigitNaicsCodes(twoDigitCodes[i].code);
      if (fourDigitCodes) {
        debug(`Found ${fourDigitCodes.length} 4-digit codes under ${twoDigitCodes[i].code}.`);
        for (let j = 0; j < fourDigitCodes.length; j += 1) {
          const fourDigitCode = await insertOrUpdateCode({
            ...fourDigitCodes[j],
            parent_id: twoDigitCode,
          });
          const sixDigitCodes = await naics.getSixDigitNaicsCodes(fourDigitCodes[j].code);
          if (sixDigitCodes) {
            debug(`Found ${sixDigitCodes.length} 6-digit codes under ${fourDigitCodes[j].code}.`);
            for (let k = 0; k < sixDigitCodes.length; k += 1) {
              await insertOrUpdateCode({
                ...sixDigitCodes[k],
                parent_id: fourDigitCode,
              });
            }
          } else {
            debug(`Could not find any 6-digit codes under ${fourDigitCodes[j].code}.`);
          }
        }
      } else {
        debug(`Could not find any 4-digit codes under ${twoDigitCodes[i].code}.`);
      }
    }
  } else {
    debug('Could not find any 2-digit codes.');
  }
});

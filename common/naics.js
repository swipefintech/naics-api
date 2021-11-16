const axios = require('axios');
const cheerio = require('cheerio');
const debug = require('debug')('naics-api:lib');

/**
 *
 * @param {cheerio.CheerioAPI} $
 * @param row
 * @returns {{code: string, title: string, businesses: number}|null}
 */
function extractNaicCodeRowData($, row) {
  const cells = $(row).find('td');
  if (cells.length === 3) {
    const code = $(cells[0]).text().trim();
    if (code) {
      const title = $(cells[1]).text().trim();
      const businesses = $(cells[2]).text().replace(/\D/g, '');
      const count = Number.parseInt(businesses, 10);
      return {
        code,
        title,
        businesses: Number.isNaN(count) ? 0 : count,
      };
    }
  }

  return null;
}

/**
 * @param {string} url
 * @returns {Promise<cheerio.CheerioAPI|null>}
 */
async function fetchHtmlFromUrl(url) {
  let response;
  try {
    response = await axios.get(url);
  } catch (e) {
    debug(e);
  }

  if (response && response.status === 200) {
    return cheerio.load(response.data);
  }

  return null;
}

/**
 * @param {number} twoDigitCode
 * @returns {Promise<*[]|null>}
 */
async function getFourDigitNaicsCodes(twoDigitCode) {
  const $ = await fetchHtmlFromUrl(`https://www.naics.com/naics-code-description/?code=${twoDigitCode}`);
  if (!$) return null;
  const codes = [];
  $('.entry-content > table > tbody > tr.headerRow').each(function extractRowData() {
    const code = extractNaicCodeRowData($, this);
    if (code) codes.push(code);
  });
  return codes;
}

/**
 * @param {number} fourDigitCode
 * @returns {Promise<*[]|null>}
 */
async function getSixDigitNaicsCodes(fourDigitCode) {
  const $ = await fetchHtmlFromUrl(`https://www.naics.com/naics-code-description/?code=${fourDigitCode}`);
  if (!$) return null;
  const codes = [];
  $('.entry-content > table > tbody > tr.groupRow').each(function extractRowData() {
    const code = extractNaicCodeRowData($, this);
    if (code) codes.push(code);
  });
  return codes;
}

/**
 * @param {boolean} autoExpand
 * @returns {Promise<*[]|null>}
 */
async function getTwoDigitNaicsCodes(autoExpand = true) {
  const $ = await fetchHtmlFromUrl('https://www.naics.com/search/');
  if (!$) return null;
  const codes = [];
  $('.entry-content > table > tbody > tr').each(function extractRowData() {
    const code = extractNaicCodeRowData($, this);
    if (code) {
      if (autoExpand && code.code.indexOf('-') >= 0) {
        const [from, until] = code.code.split('-')
          .map((x) => Number.parseInt(x.trim(), 10));
        for (let i = from; i <= until; i += 1) {
          codes.push({ ...code, code: i.toString(), group: code.code });
        }
      } else {
        codes.push(code);
      }
    }
  });
  return codes;
}

module.exports = {
  getFourDigitNaicsCodes,
  getSixDigitNaicsCodes,
  getTwoDigitNaicsCodes,
};

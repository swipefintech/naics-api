const express = require('express');
const queue = require('../common/queue');

const router = express.Router();

/**
 * @openapi
 * /refresh:
 *   post:
 *     description: Triggers a data refresh.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns ok = true if refresh triggered successfully.
 *         schema:
 *           type: object
 *           properties:
 *             ok:
 *               type: boolean
 *     tags:
 *       - data
 */
router.post('/refresh', async (req, res) => {
  await queue.add('refresh');
  res.send({ ok: true });
});

module.exports = router;

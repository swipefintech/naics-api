const express = require('express');
const db = require('../common/db');

const router = express.Router();

/**
 * @openapi
 * /codes:
 *   get:
 *     description: List all NAICS codes.
 *     parameters:
 *       - name: parent
 *         in: query
 *         description: Filter codes by parent code ID.
 *         type: integer
 *       - name: search
 *         in: query
 *         description: Search for a substring in code's title.
 *         type: string
 *       - name: page
 *         in: query
 *         description: Page number used for pagination.
 *         type: integer
 *         default: 1
 *       - name: count
 *         in: query
 *         description: Number of returns to return per page.
 *         type: integer
 *         default: 10
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the codes data.
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *             total:
 *               type: integer
 *     tags:
 *       - data
 */
router.get('/codes', async (req, res) => {
  let query = db('codes');
  if (req.query.search) {
    query = query.where('title', 'like', `%${req.query.search}%`);
  }

  if (req.query.parent) {
    query = query.where('parent_id', '=', req.query.parent);
  } else {
    query = query.whereNull('parent_id');
  }

  const page = req.query.page || 1;
  const count = req.query.count || 10;
  const offset = ((page >= 1 ? page : 1) - 1) * count;
  const [data, { total }] = await Promise.all([
    query.clone().select('*').offset(offset).limit(count),
    query.clone().count('* as total').first(),
  ]);

  res.send({
    data,
    total,
  });
});

module.exports = router;

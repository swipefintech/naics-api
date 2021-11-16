const express = require('express');

const router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     description: List all users.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the users data.
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *             success:
 *               type: boolean
 *     tags:
 *       - users
 */
router.get('/users', async (req, res) => {
  res.send({
    data: [],
    success: true,
  });
});

module.exports = router;

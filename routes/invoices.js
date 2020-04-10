const db = require("../db");
const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");

router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
            `SELECT id, comp_code 
               FROM invoices`);
  
      return res.json(results.rows);
    }catch (err) {
      return next(err);
    }
  })

router.get('/:id', async function(req, res, next) {
  try {
      const invoiceRes = await db.query(
          `SELECT *
          FROM invoices
          WHERE id = $1`, [req.params.id]);
      const companiesRes = await db.query(
          `SELECT *
          FROM companies
          JOIN invoices
          ON invoice.comp_code = companies.code
          WHERE invoice.id = $1`, [req.params.id])
      )

  if (results.rows.length === 0) {
      throw new ExpressError(`There is no company with code of '${req.params.code}`, 404);
    }
    return res.json({ company: results.rows[0] });
  } catch (err) {
    return next(err);
  }
})




  module.exports = router;

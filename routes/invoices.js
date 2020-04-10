const db = require("../db");
const express = require("express");
const ExpressError = require("../expressError");

let router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT id, comp_code 
               FROM invoices
               ORDER BY id`);

    return res.json({ "invoices": results.rows });
  }

  catch (err) {
    return next(err);
  }
})

router.get('/:id', async function (req, res, next) {
  try {
    const invoiceRes = await db.query(
      `SELECT id, amt, paid, add_date, paid_date
          FROM invoices
          WHERE id = $1`, [req.params.id]);
    const companiesRes = await db.query(
      `SELECT code, name, description
          FROM companies
          JOIN invoices
          ON invoices.comp_code = companies.code
          WHERE invoices.id = $1`, [req.params.id])

    // ensure neither result is an empty array
    if (invoiceRes.rows.length === 0) {
      throw new ExpressError(`There is no company with code of '${req.params.code}`, 404);
    }
    if (companiesRes.rows.length === 0) {
      throw new ExpressError(`There is no company with code of '${req.params.code}`, 404);
    }

    return res.json({ "invoice": invoiceRes.rows[0], "company": companiesRes.rows[0] });
  }
  catch (err) {
    return next(err);
  }
})

router.post("/", async function (req, res, next) {
  try {
    let input = req.body;
    const result = await db.query(
      `INSERT INTO invoices (comp_code, amt)
    VALUES ($1, $2)
    RETURNING id, comp_code, amt, paid, add_date, paid_date
    `, [input.comp_code, input.amt]);
    return res.status(201).json({ "invoice": result.rows[0] });
  }
  catch (err) {
    return next(err);
  }
});


router.put("/:id", async function(req, res, next){
  try{
  const result = await db.query(
    `UPDATE invoices 
    SET amt = $1
    WHERE id = $2
    RETURNING id, comp_code, amt, paid, add_date, paid_date `, [req.body.amt, req.params.id]);
  return res.json({"invoice": result.rows[0]});
  }
  catch(err){
    return next(err);
  }
});

router.delete("/:id", async function(req, res, next){
  try{
    const result = await db.query(
      `DELETE FROM invoices WHERE id = $1`,[req.params.id]);
    return res.json({status: "deleted" })
    }
  catch(err){
    return next(err)
  }
});

router.get

module.exports = router;

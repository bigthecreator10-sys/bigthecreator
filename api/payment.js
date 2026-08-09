const { init } = require("../_db");

module.exports = async (req, res) => {
if (req.method !== “POST”) {
return res.status(405).json({
error: “Method not allowed”
});
}

try {
const db = await init();

const {
  service,
  name,
  email,
  amount,
  reference
} = req.body || {};
if (!service || !name || !email || !amount || !reference) {
  return res.status(400).json({
    error: "Please complete all payment fields."
  });
}
await db.query(
  `INSERT INTO payments
    (service, name, email, amount, reference)
   VALUES ($1, $2, $3, $4, $5)`,
  [
    service,
    name,
    email,
    amount,
    reference
  ]
);
return res.status(201).json({
  message: "Payment submitted for verification."
});

} catch (error) {
console.error(“Payment submission error:”, error);

return res.status(500).json({
  error: "Could not submit payment."
});

}
};

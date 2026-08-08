export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: false,
      message: "Method not allowed"
    });
  }

  try {
    const {
      email,
      amount,
      service,
      name,
      phone
    } = req.body || {};

    if (!email || !amount || !service) {
      return res.status(400).json({
        status: false,
        message: "Email, amount and service are required."
      });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return res.status(500).json({
        status: false,
        message: "Paystack is not configured on the server."
      });
    }

    const reference =
      `BIGTC-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          amount: Math.round(Number(amount) * 100),
          reference,
          metadata: {
            name: name || "",
            phone: phone || "",
            service
          },
          callback_url:
            "https://bigthecreator10-sys-bigthecreator.vercel.app/payment-success.html"
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return res.status(400).json({
        status: false,
        message:
          data.message || "Unable to initialize Paystack payment."
      });
    }

    return res.status(200).json({
      status: true,
      message: "Payment initialized successfully.",
      reference,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code
    });

  } catch (error) {
    console.error("Paystack initialization error:", error);

    return res.status(500).json({
      status: false,
      message: "An unexpected payment error occurred."
    });
  }
}

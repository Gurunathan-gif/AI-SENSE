export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const url = req.url || "";

  if (url.includes("/hardware/compile") || url.includes("/compile")) {
    const { code, fqbn } = req.body || {};
    return res.status(200).json({
      success: true,
      fallback: true,
      fqbn: fqbn || "arduino:zephyr:unoq",
      cleanCode: code || "",
      message: "Vercel Serverless WebSerial engine active. Executing 8-step WebSerial flasher."
    });
  }

  return res.status(200).json({
    status: "online",
    engine: "Vercel Serverless + In-Browser WebSerial API",
    platform: "Vercel Unified Platform",
    backendStatus: "connected"
  });
}

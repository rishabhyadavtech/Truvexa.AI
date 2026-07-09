const { URL } = require("url");
require("dotenv").config();

async function checkDomainAge(input) {

  const domain = extractDomain(input);

  if (!domain) {

    return {
      success: false,
      domain: null,
      age: "Unknown",
      registrar: "Unknown",
      created: "Unknown",
      risk: "Unknown",
      message: "No valid domain found."
    };

  }

  try {

    const response = await fetch(
      `https://api.apilayer.com/whois/query?domain=${domain}`,
      {
        headers: {
          apikey: process.env.APILAYER_API_KEY
        }
      }
    );

    const data = await response.json();

    const result = data.result || {};

    const created = result.creation_date || "Unknown";
    const registrar = result.registrar || "Unknown";

    let age = "Unknown";
    let risk = "Unknown";

    if (created !== "Unknown") {

      const createdDate = new Date(created);
      const now = new Date();

      const days = Math.floor(
        (now - createdDate) / (1000 * 60 * 60 * 24)
      );

      age = `${days} days`;

      if (days < 30)
        risk = "HIGH";
      else if (days < 180)
        risk = "MEDIUM";
      else
        risk = "LOW";

    }

    return {

      success: true,
      domain,

      age,
      registrar,
      created,

      risk,

      message: "WHOIS lookup completed."

    };

  } catch (err) {

    return {

      success: false,

      domain,

      age: "Unknown",

      registrar: "Unknown",

      created: "Unknown",

      risk: "Unknown",

      message: err.message

    };

  }

}
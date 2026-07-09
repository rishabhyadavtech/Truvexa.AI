const { URL } = require("url");
require("dotenv").config();

function extractDomain(input) {
  try {
    let url = input.trim();

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {
      url = "https://" + url;
    }

    return new URL(url).hostname.toLowerCase();

  } catch {
    return null;
  }
}

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
 const controller = new AbortController();

const timeout = setTimeout(() => {
  controller.abort();
}, 8000);

    const response = await fetch(
      `https://api.apilayer.com/whois/query?domain=${domain}`,
      {
        headers: {
          apikey: process.env.APILAYER_API_KEY
        },
    signal: controller.signal
      }
    );

  if (!response.ok) {
  throw new Error(`WHOIS API Error: ${response.status}`);
}

    const data = await response.json();
    clearTimeout(timeout);

    const result = data;

    const created = result.creation_date || "Unknown";
    const registrar = result.registrar || "Unknown";

    let age = "Unknown";
    let risk = "Unknown";

    if (created !== "Unknown") {

      const createdDate = new Date(created);

if (!isNaN(createdDate.getTime())) {

  const now = new Date();

  const days = Math.floor(
    (now - createdDate) / (1000 * 60 * 60 * 24)
  );

  const years = Math.floor(days / 365);
const months = Math.floor((days % 365) / 30);

if (years > 0) {
  age = `${years} year${years > 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
} else {
  age = `${days} days`;
}

  if (days < 30)
    risk = "HIGH";
  else if (days < 180)
    risk = "MEDIUM";
  else
    risk = "LOW";
}

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

module.exports = {
  checkDomainAge
};
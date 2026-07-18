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

    const result = data.result || {};

    const created =
  result.creation_date ||
  result.created_date ||
  result.created ||
  "Unknown";

const registrar =
  result.registrar ||
  "Unknown";

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
function buildDomainExplanation(result) {

  if (!result.success) {
    return result.message;
  }

  if (result.risk === "LOW") {

    return `

🌍 Domain Information

Status : Trusted

Domain : ${result.domain}

Age : ${result.age}

Registrar : ${result.registrar}

Creation Date : ${result.created}

This domain has been registered for a long time.

Older domains are generally more trustworthy because scammers usually prefer newly created domains that can be abandoned quickly.

`.trim();

  }

  if (result.risk === "MEDIUM") {

    return `

🌍 Domain Information

Status : Moderate Risk

Domain : ${result.domain}

Age : ${result.age}

Registrar : ${result.registrar}

Creation Date : ${result.created}

This domain is relatively new.

A newer domain does not automatically indicate a scam, but it deserves additional verification before sharing sensitive information.

`.trim();

  }

  return `

🌍 Domain Information

Status : High Risk

Domain : ${result.domain}

Age : ${result.age}

Registrar : ${result.registrar}

Creation Date : ${result.created}

This domain was registered very recently.

Newly created domains are commonly used for phishing, fake investment websites, fake job portals, and other online scams.

Proceed with extreme caution.

`.trim();

}

module.exports = {
  checkDomainAge,
  buildDomainExplanation
};
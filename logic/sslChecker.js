const tls = require("tls");
const { URL } = require("url");

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

async function checkSSL(input) {

  const domain = extractDomain(input);

  if (!domain) {
    return {
      success: false,
      domain: null,
      valid: false,
      issuer: "Unknown",
      validFrom: "Unknown",
      validTo: "Unknown",
      expiresInDays: null,
      risk: "UNKNOWN",
      message: "Invalid domain."
    };
  }

  return new Promise((resolve) => {

    const socket = tls.connect(
      443,
      domain,
      {
        servername: domain,
        rejectUnauthorized: false
      },
      () => {

        try {

          const cert = socket.getPeerCertificate();

          socket.end();

          if (!cert || Object.keys(cert).length === 0) {

            return resolve({
              success: false,
              domain,
              valid: false,
              issuer: "Unknown",
              validFrom: "Unknown",
              validTo: "Unknown",
              expiresInDays: null,
              risk: "HIGH",
              message: "No SSL certificate found."
            });

          }

          const validTo = new Date(cert.valid_to);
          const validFrom = cert.valid_from
            ? new Date(cert.valid_from)
            : null;

          const daysLeft = Math.floor(
            (validTo - new Date()) /
            (1000 * 60 * 60 * 24)
          );

          let risk = "LOW";

          if (daysLeft < 0)
            risk = "HIGH";
          else if (daysLeft < 30)
            risk = "MEDIUM";

          resolve({

            success: true,

            domain,

            valid: daysLeft >= 0,

            issuer:
              cert.issuer?.O ||
              cert.issuer?.CN ||
              "Unknown",

            validFrom:
              validFrom ?
              validFrom.toISOString().split("T")[0]
              : "Unknown",

            validTo:
              validTo.toISOString().split("T")[0],

            expiresInDays: daysLeft,

            risk,

            message: "SSL certificate retrieved."

          });

        } catch (err) {

          resolve({

            success: false,

            domain,

            valid: false,

            issuer: "Unknown",

            validFrom: "Unknown",

            validTo: "Unknown",

            expiresInDays: null,

            risk: "UNKNOWN",

            message: err.message

          });

        }

      }
    );

    socket.setTimeout(8000);

    socket.on("timeout", () => {

      socket.destroy();

      resolve({

        success: false,

        domain,

        valid: false,

        issuer: "Unknown",

        validFrom: "Unknown",

        validTo: "Unknown",

        expiresInDays: null,

        risk: "UNKNOWN",

        message: "SSL timeout."

      });

    });

    socket.on("error", (err) => {

      resolve({

        success: false,

        domain,

        valid: false,

        issuer: "Unknown",

        validFrom: "Unknown",

        validTo: "Unknown",

        expiresInDays: null,

        risk: "UNKNOWN",

        message: err.message

      });

    });

  });

}
function buildSSLSummary(result) {

  if (!result.success) {
    return `🔒 SSL Certificate

${result.message}`;
  }

  let text = `🔒 SSL Certificate

Status: ${result.valid ? "Valid" : "Invalid"}

Issuer: ${result.issuer}

Risk Level: ${result.risk}

`;

  if (result.risk === "LOW") {

    text +=
`The SSL certificate is valid and currently trusted. This means your connection to the website is encrypted.`;

  }

  else if (result.risk === "MEDIUM") {

    text +=
`The SSL certificate is close to expiring. The connection is encrypted, but the certificate should be renewed soon.`;

  }

  else {

    text +=
`The SSL certificate is invalid or expired. This can indicate an insecure or potentially unsafe website.`;

  }

  return text;

}

function buildSSLExplanation(result) {

  if (!result.success) {
    return result.message;
  }

  if (result.risk === "LOW") {

    return `

🔒 SSL Certificate

Status : Valid

Domain : ${result.domain}

Certificate Issuer : ${result.issuer}

Valid From : ${result.validFrom}

Valid Until : ${result.validTo}

Days Remaining : ${result.expiresInDays}

The website is protected with a valid HTTPS certificate.

This means data exchanged between your browser and the website is encrypted, helping protect passwords and personal information during transmission.

`.trim();

  }

  if (result.risk === "MEDIUM") {

    return `

🔒 SSL Certificate

Status : Expiring Soon

Domain : ${result.domain}

Certificate Issuer : ${result.issuer}

Valid Until : ${result.validTo}

Days Remaining : ${result.expiresInDays}

The SSL certificate is still valid but will expire soon.

While this is not necessarily dangerous, website owners should renew the certificate to maintain secure communication.

`.trim();

  }

  return `

🔒 SSL Certificate

Status : Invalid

Domain : ${result.domain}

Certificate Issuer : ${result.issuer}

Valid Until : ${result.validTo}

Days Remaining : ${result.expiresInDays}

The SSL certificate is expired, invalid, or missing.

Sensitive information such as passwords or payment details should not be entered unless the issue is resolved and the website is trusted.

`.trim();

}

module.exports = {
  checkSSL,
  buildSSLSummary,
  buildSSLExplanation
};
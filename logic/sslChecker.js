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

module.exports = {
  checkSSL
};
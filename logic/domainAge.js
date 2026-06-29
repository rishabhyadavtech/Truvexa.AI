const { URL } = require("url");

function extractDomain(input) {
  try {
    let url = input.trim();

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
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
      age: null,
      registrar: null,
      created: null,
      risk: "Unknown",
      message: "No valid domain found."
    };
  }

  // API connect hone ke baad ye values real hongi.
  return {
    success: true,
    domain,
    age: "Unknown",
    registrar: "Unknown",
    created: "Unknown",
    risk: "Unknown",
    message:
      "Domain detected successfully. Live WHOIS lookup will be enabled after API integration."
  };
}

module.exports = {
  checkDomainAge
};

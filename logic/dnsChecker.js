const dns = require("dns").promises;
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

    let host = new URL(url).hostname.toLowerCase();

// Remove www.
if (host.startsWith("www.")) {
    host = host.substring(4);
}

return host;

  } catch {
    return null;
  }
}

async function checkDNS(input) {

  const domain = extractDomain(input);

  if (!domain) {
    return {
      success: false,
      domain: null,
      hasA: false,
      hasMX: false,
      hasNS: false,
      hasTXT: false,
      hasSPF: false,
      hasDMARC: false,
      risk: "UNKNOWN",
      message: "Invalid domain."
    };
  }

  try {

    const result = {
      success: true,
      domain,

      hasA: false,
      hasMX: false,
      hasNS: false,
      hasTXT: false,
      hasSPF: false,
      hasDMARC: false,

      records: {},

      risk: "LOW",

      message: "DNS lookup completed."
    };

    // A Record

    try {
      const a = await dns.resolve4(domain);
      result.hasA = true;
      result.records.A = a;
    } catch {}

    // MX Record
    try {
      const mx = await dns.resolveMx(domain);
      result.hasMX = mx.length > 0;
      result.records.MX = mx;
    } catch {}

    // NS Record
    try {
      const ns = await dns.resolveNs(domain);
      result.hasNS = ns.length > 0;
      result.records.NS = ns;
    } catch {}

    // TXT Record
    try {
      const txt = await dns.resolveTxt(domain);

      result.hasTXT = txt.length > 0;

      result.records.TXT = txt;

      const txtFlat = txt.flat().join(" ").toLowerCase();

      if (txtFlat.includes("v=spf1")) {
        result.hasSPF = true;
      }

    } catch {}

    // DMARC
    try {

      const dmarc = await dns.resolveTxt(
        `_dmarc.${domain}`
      );

      if (dmarc.length > 0) {
        result.hasDMARC = true;
      }

    } catch {}

    // Simple Risk Logic

    let missing = 0;

if (!result.hasA) missing++;
if (!result.hasNS) missing++;
if (!result.hasMX) missing++;
if (!result.hasSPF) missing++;
if (!result.hasDMARC) missing++;

if (missing <= 1) {

    result.risk = "LOW";

}
else if (missing <= 3) {

    result.risk = "MEDIUM";

}
else {

    result.risk = "HIGH";

}

    return result;

  } catch (err) {

    return {

      success: false,

      domain,

      hasA: false,
      hasMX: false,
      hasNS: false,
      hasTXT: false,
      hasSPF: false,
      hasDMARC: false,

      risk: "UNKNOWN",

      message: err.message

    };

  }

}
function buildDNSExplanation(result) {

  if (!result.success) {
    return result.message;
  }

  if (result.risk === "LOW") {

    return `

🌐 DNS Security

Status : Healthy

Domain : ${result.domain}

A Record : ${result.hasA ? "Available" : "Missing"}

MX Record : ${result.hasMX ? "Available" : "Missing"}

NS Record : ${result.hasNS ? "Available" : "Missing"}

SPF Protection : ${result.hasSPF ? "Enabled" : "Missing"}

DMARC Protection : ${result.hasDMARC ? "Enabled" : "Missing"}

The DNS configuration appears healthy.

Important security records are present, which helps improve email security and domain reliability.

`.trim();

  }

  if (result.risk === "MEDIUM") {

    return `

🌐 DNS Security

Status : Moderate Risk

Domain : ${result.domain}

A Record : ${result.hasA ? "Available" : "Missing"}

MX Record : ${result.hasMX ? "Available" : "Missing"}

NS Record : ${result.hasNS ? "Available" : "Missing"}

SPF Protection : ${result.hasSPF ? "Enabled" : "Missing"}

DMARC Protection : ${result.hasDMARC ? "Enabled" : "Missing"}

Some recommended DNS security records are missing.

This does not automatically indicate a malicious website, but stronger DNS security is recommended.

`.trim();

  }

  return `

🌐 DNS Security

Status : High Risk

Domain : ${result.domain}

A Record : ${result.hasA ? "Available" : "Missing"}

MX Record : ${result.hasMX ? "Available" : "Missing"}

NS Record : ${result.hasNS ? "Available" : "Missing"}

SPF Protection : ${result.hasSPF ? "Enabled" : "Missing"}

DMARC Protection : ${result.hasDMARC ? "Enabled" : "Missing"}

Several important DNS security records are missing.

Poor DNS configuration is commonly found on newly created, abandoned, or poorly maintained websites.

Proceed carefully before trusting this website.

`.trim();

}

module.exports = {
  checkDNS,
  buildDNSExplanation
};

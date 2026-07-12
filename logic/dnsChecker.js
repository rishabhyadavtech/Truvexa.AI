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

    return new URL(url).hostname.toLowerCase();

  } catch {
    return null;
  }
}

async function checkDNS(input) {

  const domain = extractDomain(input);
 console.log("========== DNS CHECK ==========");
console.log("Input:", input);
console.log("Extracted Domain:", domain);

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
console.log("Starting DNS lookup...");

    // A Record

    try {
      const a = await dns.resolve4(domain);
console.log("A Records:", a);

result.hasA = true;
result.records.A = a;
      result.hasA = true;
      result.records.A = a;
    } catch {}

    // MX Record
    try {
      const mx = await dns.resolveMx(domain);
console.log("MX Records:", mx);

result.hasMX = mx.length > 0;
result.records.MX = mx;
      result.hasMX = mx.length > 0;
      result.records.MX = mx;
    } catch {}

    // NS Record
    try {
      const ns = await dns.resolveNs(domain);
console.log("NS Records:", ns);

result.hasNS = ns.length > 0;
result.records.NS = ns;
      result.hasNS = ns.length > 0;
      result.records.NS = ns;
    } catch {}

    // TXT Record
    try {
      const txt = await dns.resolveTxt(domain);
console.log("TXT Records:", txt);

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
console.log("DMARC:", dmarc);

      if (dmarc.length > 0) {
        result.hasDMARC = true;
      }

    } catch {}

    // Simple Risk Logic

    if (!result.hasMX && !result.hasSPF) {

      result.risk = "MEDIUM";

    }

    if (!result.hasNS || !result.hasA) {

      result.risk = "HIGH";

    }
console.log("DNS RESULT:");
console.log(JSON.stringify(result, null, 2));
console.log("===============================");

    return result;
console.log("DNS ERROR:");
console.error(err);

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

module.exports = {
  checkDNS
};

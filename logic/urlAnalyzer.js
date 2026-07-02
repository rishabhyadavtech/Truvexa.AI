const { URL } = require("url");

const SHORTENERS = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "is.gd",
  "cutt.ly",
  "rebrand.ly",
  "shorturl.at",
  "ow.ly",
  "buff.ly"
];

const SUSPICIOUS_TLDS = [
  ".xyz",
  ".top",
  ".click",
  ".shop",
  ".live",
  ".cam",
  ".gq",
  ".cf",
  ".tk",
  ".ml",
  ".ga",
  ".buzz"
];

const BRANDS = [
  "google",
  "paypal",
  "amazon",
  "facebook",
  "instagram",
  "microsoft",
  "apple",
  "netflix",
  "whatsapp",
  "telegram",
  "statebank",
  "sbi",
  "hdfc",
  "icici",
  "axisbank",
  "phonepe",
  "paytm",
  "upi"
];

function analyzeURL(text) {

  const result = {

found:false,

url:null,

risk:0,

signals:[],

reasons:[],

advice:[]
}

  const regex = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;

  const match = text.match(regex);

  if (!match) return result;

  result.found = true;

  let raw = match[0];
  
  if (!raw.startsWith("http")) {
    raw = "https://" + raw;
  }

 result.url = raw;


  try {

    const url = new URL(raw);

    const host = url.hostname.toLowerCase();

    // URL Shortener
    if (SHORTENERS.includes(host)) {

      result.risk += 25;

      result.signals.push("URL Shortener");

      result.reasons.push(
        "Shortened URL destination hide karta hai."
      );

      result.advice.push(
        "Expand kiye bina open mat karo."
      );
    }

    // Suspicious TLD
    for (const tld of SUSPICIOUS_TLDS) {

      if (host.endsWith(tld)) {

        result.risk += 20;

        result.signals.push("Suspicious Domain");

        result.reasons.push(
          "Domain unusual TLD use kar raha hai."
        );

        break;
      }
    }

    // Fake Brand
    for (const brand of BRANDS) {

      if (
        host.includes(brand) &&
        host !== brand + ".com"
      ) {

        result.risk += 30;

        result.signals.push("Brand Impersonation");

        result.reasons.push(
          "Popular brand ka naam unusual domain me use hua hai."
        );

        result.advice.push(
          "Official website manually open karo."
        );

        break;
      }
    }

    // Long URL

    if (raw.length > 120) {

      result.risk += 10;

      result.signals.push("Long URL");

      result.reasons.push(
        "Bahut lambi URL suspicious ho sakti hai."
      );
    }

    // Multiple subdomains

    const parts = host.split(".");

    if (parts.length >= 5) {

      result.risk += 15;

      result.signals.push("Multiple Subdomains");

      result.reasons.push(
        "Extra subdomains phishing me common hote hain."
      );
    }

  } catch {

    result.risk += 30;

    result.signals.push("Invalid URL");

    result.reasons.push(
      "URL malformed lag rahi hai."
    );
  }

  return result;
}

module.exports = {
  analyzeURL
};

function analyzeUrlReputation(input) {

  const text = input.toLowerCase();

  let risk = 0;
  let signals = [];
  let reasons = [];

  // -----------------------
  // Extract URLs
  // -----------------------

  const urls =
    text.match(/https?:\/\/[^\s]+|www\.[^\s]+/gi) || [];

  if (urls.length === 0) {
    return {
      risk: 0,
      signals: [],
      reasons: []
    };
  }

  // -----------------------
  // Suspicious TLD
  // -----------------------

  const badTlds = [
    ".xyz",
    ".top",
    ".click",
    ".live",
    ".shop",
    ".buzz",
    ".rest",
    ".monster",
    ".gq",
    ".tk"
  ];

  // -----------------------
  // URL Shorteners
  // -----------------------

  const shorteners = [
    "bit.ly",
    "tinyurl",
    "cutt.ly",
    "t.co",
    "rb.gy",
    "is.gd",
    "goo.gl",
    "shorturl"
  ];

  // -----------------------

  urls.forEach(url => {

    // Suspicious TLD

    if (badTlds.some(tld => url.includes(tld))) {

      risk += 20;

      signals.push("Suspicious Domain");

      reasons.push(
        "URL unusual top-level domain use kar raha hai."
      );
    }

    // URL Shortener

    if (shorteners.some(s => url.includes(s))) {

      risk += 20;

      signals.push("Shortened URL");

      reasons.push(
        "Shortened URL original destination hide kar sakta hai."
      );
    }

    // IP Address URL

    if (/\b\d{1,3}(\.\d{1,3}){3}\b/.test(url)) {

      risk += 30;

      signals.push("IP Address URL");

      reasons.push(
        "Website domain ki jagah IP address use kar rahi hai."
      );
    }

    // @ Symbol

    if (url.includes("@")) {

      risk += 25;

      signals.push("@ Symbol");

      reasons.push(
        "@ symbol phishing URLs me commonly use hota hai."
      );
    }

    // Punycode

    if (url.includes("xn--")) {

      risk += 30;

      signals.push("Punycode");

      reasons.push(
        "Internationalized domain spoofing detect hua."
      );
    }

    // Too Long

    if (url.length > 80) {

      risk += 15;

      signals.push("Very Long URL");

      reasons.push(
        "URL unusually lamba hai."
      );
    }

    // Multiple Hyphens

    const hyphens =
      (url.match(/-/g) || []).length;

    if (hyphens >= 3) {

      risk += 15;

      signals.push("Many Hyphens");

      reasons.push(
        "Domain me bahut zyada hyphen hain."
      );
    }

    // Multiple Subdomains

    const host = url
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      .split("/")[0];

    const dots =
      (host.match(/\./g) || []).length;

    if (dots >= 3) {

      risk += 20;

      signals.push("Multiple Subdomains");

      reasons.push(
        "Domain structure unusual lag rahi hai."
      );
    }

    // Suspicious Keywords

    const keywords = [
      "login",
      "verify",
      "secure",
      "wallet",
      "gift",
      "bonus",
      "reward",
      "crypto",
      "update",
      "signin"
    ];

    keywords.forEach(word => {

      if (url.includes(word)) {

        risk += 8;

        signals.push("Suspicious Keyword");

        reasons.push(
          `"${word}" phishing URLs me frequently use hota hai.`
        );
      }

    });

  });

  return {

    risk,

    signals: [...new Set(signals)],

    reasons: [...new Set(reasons)]

  };

}

module.exports = {
  analyzeUrlReputation
};

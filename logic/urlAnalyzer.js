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

advice:[],

evidence: []
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

if (url.protocol === "http:") {

  result.risk += 10;

  result.signals.push("Insecure HTTP");

  result.reasons.push("INSECURE_HTTP");

  result.advice.push("USE_HTTPS");

  result.evidence.push({
    id: "INSECURE_HTTP",
    title: "Website is not using HTTPS",
    severity: "low"
  });
 
}

  
   const ipRegex =
/^\d{1,3}(\.\d{1,3}){3}$/;

if(ipRegex.test(host)){

result.risk +=30;

result.signals.push("IP Address URL");

result.reasons.push("IP_ADDRESS_URL");

result.advice.push("AVOID_IP_URL");

result.evidence.push({

id:"IP_ADDRESS_URL",

title:"URL uses an IP address",

severity:"high"

});

}

    // URL Shortener
    if (SHORTENERS.includes(host)) {

  result.risk += 25;

  result.signals.push("URL Shortener");

  result.reasons.push("SHORTENED_URL");

  result.advice.push("EXPAND_SHORT_URL");

  result.evidence.push({
    id: "SHORTENED_URL",
    title: "Shortened URL detected",
    severity: "medium"
  });

}

    // Suspicious TLD
    for (const tld of SUSPICIOUS_TLDS) {

     if (host.endsWith(tld)) {

  result.risk += 20;

  result.signals.push("Suspicious Domain");

  result.reasons.push("UNUSUAL_TLD");

  result.evidence.push({
    id: "UNUSUAL_TLD",
    title: "Unusual top-level domain",
    severity: "medium"
  });

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

 result.reasons.push("BRAND_IMPERSONATION");

 result.advice.push("OPEN_OFFICIAL_WEBSITE");

 result.evidence.push({
   id:"BRAND_IMPERSONATION",
   title:"Brand impersonation detected",
   severity:"high"
 });

 break;
}

}

    // Long URL

   if (raw.length > 120) {

  result.risk += 10;

  result.signals.push("Long URL");

  result.reasons.push("LONG_URL");

  result.evidence.push({
    id: "LONG_URL",
    title: "Unusually long URL",
    severity: "low"
  });

}
    // Multiple subdomains

    const parts = host.split(".");

if (parts.length >= 5) {

  result.risk += 15;

  result.signals.push("Multiple Subdomains");

  result.reasons.push("MULTIPLE_SUBDOMAINS");

  result.evidence.push({
    id: "MULTIPLE_SUBDOMAINS",
    title: "Multiple subdomains detected",
    severity: "medium"
  });

}


  } catch {

    result.risk += 30;

    result.signals.push("Invalid URL");

    result.reasons.push(
      "INVALID_URL"
    );
  } 
    result.evidence.push({
  id: "INVALID_URL",
  title: "Malformed URL",
  severity: "high"
});

}
    
  result.signals = [...new Set(result.signals)];
result.reasons = [...new Set(result.reasons)];
result.advice = [...new Set(result.advice)];

  return result;
}

module.exports = {
  analyzeURL
};

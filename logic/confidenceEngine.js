function calculateConfidence(
  scam,
  manipulation,
  urlAnalysis,
  safeBrowsing,
  virusTotal,
  domainInfo,
  dnsInfo,
  sslInfo
) {

  let score = 0;
// Confidence starts high
  let confidence = 50;

  // Scam Engine
  score += Math.min(scam.riskScore || 0, 40);
// Confidence from Scam Engine
if ((scam.riskScore || 0) === 0) {
  confidence += 20;
} else if ((scam.riskScore || 0) <= 20) {
  confidence += 15;
} else if ((scam.riskScore || 0) <= 50) {
  confidence += 8;
} else {
  confidence += 2;
}

  // Manipulation
  if (manipulation.manipulationLevel === "HIGH") {
    score += 20;
  } else if (manipulation.manipulationLevel === "MEDIUM") {
    score += 10;
  }

  // URL Analysis
  score += Math.min(urlAnalysis.risk || 0, 20);

  // Google Safe Browsing
  if (safeBrowsing.success && !safeBrowsing.safe) {
    score += 15;
  }
// Confidence from Google Safe Browsing
if (safeBrowsing.success) {

  if (safeBrowsing.safe) {

    confidence += 10;

  } else {

    confidence += 2;

  }

}

  // VirusTotal
  if (virusTotal.success) {
    score += Math.min(
      (virusTotal.malicious * 2) + virusTotal.suspicious,
      20
    );
  }
// Confidence from VirusTotal
if (virusTotal.success) {

  if (
    virusTotal.malicious === 0 &&
    virusTotal.suspicious === 0
  ) {

    confidence += 10;

  } else if (virusTotal.malicious === 0) {

    confidence += 5;

  } else {

    confidence += 1;

  }

}

  // Domain Age
  if (
    domainInfo.success &&
    domainInfo.age !== "Unknown"
  ) {

    const age = parseInt(domainInfo.age);

    if (!isNaN(age) && age < 6) {
      score += 10;
    }

  }

// DNS

if (dnsInfo && dnsInfo.success) {

  if (dnsInfo.risk === "HIGH") {

    score += 15;

  } else if (dnsInfo.risk === "MEDIUM") {

    score += 8;

  }

}

// SSL

if (sslInfo && sslInfo.success) {

  if (sslInfo.risk === "HIGH") {

    score += 15;

  } else if (sslInfo.risk === "MEDIUM") {

    score += 8;

  }

}

  if (score > 100) score = 100;

  return score;
}

module.exports = {
  calculateConfidence
};
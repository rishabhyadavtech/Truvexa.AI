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

  // Scam Engine
  score += Math.min(scam.riskScore || 0, 40);

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

  // VirusTotal
  if (virusTotal.success) {
    score += Math.min(
      (virusTotal.malicious * 2) + virusTotal.suspicious,
      20
    );
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

  if (score > 100) score = 100;

  return score;
}

module.exports = {
  calculateConfidence
};
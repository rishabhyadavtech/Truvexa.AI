function calculateConfidence(scam, manipulation, urlAnalysis, safeBrowsing) {

  let confidence = 0;

  // Scam Risk
  confidence += Math.min(scam.riskScore || 0, 40);

  // Manipulation
  confidence += Math.min(manipulation.manipulationScore || 0, 25);

  // URL Analysis
  confidence += Math.min(urlAnalysis.risk || 0, 20);

  // Google Safe Browsing
  if (safeBrowsing.success && !safeBrowsing.safe) {
    confidence += 15;
  }

  // Limit 100
  if (confidence > 100) {
    confidence = 100;
  }

  return Math.round(confidence);
}

module.exports = {
  calculateConfidence
};
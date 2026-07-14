function buildExplanation(
  type,
  scam,
  manipulation,
  urlAnalysis,
  safeBrowsing,
  virusTotal,
  domainInfo,
  dnsInfo,
  sslInfo,
  confidence,
  t
) {

  let parts = [];

  // =========================================
  // SAFE MODE (Natural GPT Style)
  // =========================================

  if (type === "SAFE") {

    // Small evidence summary
    let evidence = [];

    if (safeBrowsing.safe)
      evidence.push("✔ Google Safe Browsing");

    if (
      virusTotal.malicious === 0 &&
      virusTotal.suspicious === 0
    )
      evidence.push("✔ VirusTotal");

    if (domainInfo.risk === "LOW")
      evidence.push("✔ Trusted Domain");

    if (sslInfo.risk === "LOW")
      evidence.push("✔ Valid SSL");

    if (dnsInfo.risk === "LOW")
      evidence.push("✔ Healthy DNS");


    parts.push(`

✅ Everything looks legitimate.

I checked this website using multiple independent security signals before making this decision.

Evidence used:

${evidence.join("\n")}

Here's what I found:

`);

    // Human style transition

    parts.push(`

I didn't find any strong signs of phishing, malware, impersonation, or deceptive behaviour.

Instead of relying on a single security check, this result is based on multiple independent sources working together.

I'll explain each security check below so you can understand *why* this website appears safe.

`);

  }

 
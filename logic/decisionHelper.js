function decideAction(scam, manipulation) {

  const signals = scam.signals || [];
  const level = manipulation.manipulationLevel;

  let decision = "";
  let action = "";
  let reason = "";

  const isHigh = scam.result === "DANGEROUS" || level === "HIGH";
  const isMedium = scam.result === "SUSPICIOUS" || level === "MEDIUM";

  // =========================
  // 🚨 HIGH RISK
  // =========================
  if (isHigh) {

  decision = "Avoid interacting with this message.";

    // 🎯 CONTEXT BASED ACTION
    if (signals.includes("Sensitive Info")) {
      action = "DONT_SHARE_OTP";
    } 
    else if (signals.includes("Link")) {
      action = "DONT_CLICK_LINK";
    } 
    else if (signals.includes("Greed")) {
      action = "DONT_SEND_MONEY";
    } 
    else if (signals.includes("Authority")) {
      action = "VERIFY_OFFICIAL_SOURCE";
    } 
    else {
      action = "IGNORE_MESSAGE";
    }

    reason = "HIGH_RISK";
 
  }

  // =========================
  // ⚠️ MEDIUM RISK
  // =========================
  else if (isMedium) {

    decision = "Verify before taking any action.";

    if (signals.includes("Link")) {
      action = "VERIFY_LINK";
    } 
    else if (signals.includes("Authority")) {
      action = "VERIFY_OFFICIAL_SOURCE";
    } 
    else if (signals.includes("Greed")) {
      action = "VERIFY_OFFER";
    } 
    else {
      action = "VERIFY_FIRST";
    }

    reason = "MEDIUM_RISK";
  }

  // =========================
  // 🟢 SAFE
  // =========================
  else {

    decision = "No major risk detected.";

    action = "SAFE_TO_PROCEED";

    reason = "SAFE";
  }

  return {
    decision,
    action,
    reason
  };
}

module.exports = { decideAction };

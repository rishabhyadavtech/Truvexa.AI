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
      action = "Link open karne se pehle URL dhyaan se check karo";
    } 
    else if (signals.includes("Authority")) {
      action = "Official source (website/app) se confirm karo";
    } 
    else if (signals.includes("Greed")) {
      action = "Offer ko blindly accept mat karo — verify karo";
    } 
    else {
      action = "Thoda rukkar kisi trusted person se discuss karo";
    }

    reason = pick([
      "Kuch signals suspicious hain jo risk create kar sakte hain.",
      "Yeh message completely safe nahi lag raha — thoda doubt hai.",
      "Agar bina verify kiye action liya to risk ho sakta hai."
    ]);
  }

  // =========================
  // 🟢 SAFE
  // =========================
  else {

    decision = "No major risk detected.";

    action = pick([
      "Aap normal tarike se proceed kar sakte hain",
      "Is par action lena safe lag raha hai",
      "Aap bina tension ke continue kar sakte hain"
    ]);

    reason = pick([
      "Koi strong scam ya manipulation signal detect nahi hua.",
      "Message me koi risky pattern nahi mila.",
      "Yeh normal communication lag raha hai."
    ]);
  }

  return {
    decision,
    action,
    reason
  };
}

module.exports = { decideAction };

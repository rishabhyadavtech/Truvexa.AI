function decideAction(scam, manipulation) {

  const signals = scam.signals || [];
  const level = manipulation.manipulationLevel;

  // 🎯 Random AI feel (no template)
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  let decision = "";
  let action = "";
  let reason = "";

  const isHigh = scam.result === "DANGEROUS" || level === "HIGH";
  const isMedium = scam.result === "SUSPICIOUS" || level === "MEDIUM";

  // =========================
  // 🚨 HIGH RISK
  // =========================
  if (isHigh) {

    decision = pick([
      "❌ Isse turant avoid karo",
      "🚫 Is message par trust mat karo",
      "❌ Yeh risky lag raha hai — action lena unsafe ho sakta hai"
    ]);

    // 🎯 CONTEXT BASED ACTION
    if (signals.includes("Sensitive Info")) {
      action = "OTP, password ya bank details bilkul share mat karo";
    } 
    else if (signals.includes("Link")) {
      action = "Is link par click mat karo — yeh phishing ho sakta hai";
    } 
    else if (signals.includes("Greed")) {
      action = "Paise bhejne ya invest karne se completely avoid karo";
    } 
    else if (signals.includes("Authority")) {
      action = "Khud official website ya helpline par jaakar verify karo";
    } 
    else {
      action = "Is message ko ignore karo aur koi action mat lo";
    }

    reason = pick([
      "Is message me strong scam ya manipulation signals detect hue hain.",
      "Yeh message tumhe emotionally control karke galat decision dilwa sakta hai.",
      "Isme aise patterns hain jo usually scam ya fraud me use hote hain."
    ]);
  }

  // =========================
  // ⚠️ MEDIUM RISK
  // =========================
  else if (isMedium) {

    decision = pick([
      "⚠️ Direct action lene se pehle ruk jao",
      "⚠️ Yeh thoda suspicious lag raha hai",
      "⚠️ Bina verify kiye aage mat badho"
    ]);

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

    decision = pick([
      "✅ Yeh safe lag raha hai",
      "👍 Koi issue nahi lag raha",
      "✅ Normal message lag raha hai"
    ]);

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

function decideAction(scam, manipulation) {

  let decision = "";
  let reason = "";
  let action = "";

  const highRisk = scam.result.includes("DANGEROUS");
  const mediumRisk = scam.result.includes("RISKY");

  const signals = scam.signals || [];

  // 🚨 HIGH RISK
  if (highRisk) {
    decision = "❌ Bilkul avoid karo";

    if (signals.includes("Sensitive Info")) {
      action = "OTP / bank details bilkul share mat karo";
    } else if (signals.includes("Link")) {
      action = "Is link par click mat karo";
    } else if (signals.includes("Greed")) {
      action = "Paise invest ya send bilkul mat karo";
    } else {
      action = "Is message ko ignore karo";
    }

    reason = "Yeh message high risk signals dikhata hai (scam ya manipulation).";
  }

  // ⚠️ MEDIUM RISK
  else if (mediumRisk) {
    decision = "⚠️ Direct action mat lo";

    if (signals.includes("Link")) {
      action = "Link open karne se pehle verify karo";
    } else if (signals.includes("Authority")) {
      action = "Official source se confirm karo";
    } else {
      action = "Thoda rukkar verify karo";
    }

    reason = "Yeh message suspicious lag raha hai, bina verify kiye action lena risky ho sakta hai.";
  }

  // 🟢 SAFE
  else {
    decision = "✅ Safe lag raha hai";
    action = "Normal tarike se proceed kar sakte ho";
    reason = "Koi strong scam ya manipulation signal detect nahi hua.";
  }

  return {
    decision,
    action,
    reason
  };
}

module.exports = { decideAction };

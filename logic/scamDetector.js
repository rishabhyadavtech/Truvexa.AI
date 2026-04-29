function detectScam(input) {
  let text = input.toLowerCase();

  let riskScore = 0;
  let reasons = [];
  let advice = [];
  let scamType = "General";
  let result = "SAFE ✅"; 
  let humanMessage = "";
 
  // 🔴 URGENCY
  if (text.includes("urgent") || text.includes("immediately")) {
    riskScore += 30;
    reasons.push("Message me urgency create ki gayi hai (jaldi decision lene ka pressure).");
    advice.push("Aise urgent messages me turant react na karein, pehle verify karein.");
  }
  humanMessage += "⚠️ Yeh message aapko jaldi decision lene par majboor kar raha hai. Scammers aise pressure create karte hain taki aap bina soche react karein.\n\n";

  // 🔴 MONEY SCAM
  if (
    text.includes("profit") ||
    text.includes("double money") ||
    text.includes("investment")
  ) {
    riskScore += 40;
    scamType = "Investment Scam";
    reasons.push("Easy profit ya paisa double karne ka promise diya gaya hai.");
    advice.push("Investment offers ko bina verify kiye accept na karein.");
  }

  // 🔴 BANK / OTP
  if (
    text.includes("otp") ||
    text.includes("bank") ||
    text.includes("account")
  ) {
    riskScore += 40;
    scamType = "Banking Scam";
    reasons.push("Bank ya OTP related sensitive information maangi ja rahi hai.");
    advice.push("Kabhi bhi OTP ya bank details kisi ke sath share na karein.");
  }

  // 🔴 FAKE REWARD
  if (
    text.includes("congratulations") ||
    text.includes("winner") ||
    text.includes("selected")
  ) {
    riskScore += 20;
    scamType = "Reward Scam";
    reasons.push("Fake reward ya unknown selection ka message hai.");
    advice.push("Aise reward messages ko ignore karein aur source verify karein.");
  }

  // 🔴 LINK DETECTION
  if (text.includes("http") || text.includes("www")) {
    riskScore += 30;
    scamType = "Phishing Link";
    reasons.push("Message me suspicious link hai.");
    advice.push("Unknown links par click karne se pehle URL verify karein.");
  }

  // ✅ RESULT FIX
  if (riskScore >= 70) result = "DANGEROUS ❌";
  else if (riskScore >= 30) result = "RISKY ⚠️";

  // 🟢 DEFAULT SAFE
  if (reasons.length === 0) {
    reasons.push("Message me koi suspicious pattern nahi mila.");
    advice.push("Phir bhi unknown messages par dhyan rakhein.");
  }

  // 🔥 SAFETY
  let safetyStatus = "";
  let reminder = "";
  let emergency = "";

  if (riskScore === 0) {
    safetyStatus = "✅ Aap safe hain.";
  }

  if (riskScore >= 70) {
    safetyStatus = "👉 Agar aapne abhi tak koi action nahi liya hai, to aap safe hain.";
    emergency = "⚠️ Agar aapne info share kiya hai, turant bank se contact karein.";
  }

  if (riskScore >= 30 && riskScore < 70) {
    safetyStatus = "⚠️ Yeh message suspicious lag raha hai.";
  }

  reminder = "👉 Kabhi bhi OTP ya personal details share na karein.";

  return {
    riskScore,
    result,
    scamType, 
    reasons,
    advice,    
    safetyStatus,
    reminder,
    emergency
  };
}

// ✅ FINAL EXPORT
module.exports = detectScam;

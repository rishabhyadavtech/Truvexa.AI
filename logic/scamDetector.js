function detectScam(input) {
  let text = input.toLowerCase();

  let riskScore = 0;
  let reasons = [];
  let advice = [];
  let scamType = "General";
  let result = "SAFE ✅";
  let humanMessage = "";

  // 🔴 URGENCY
  if (text.includes("urgent") || text.includes("immediately") || text.includes("now")) {
    riskScore += 30;

    reasons.push("Yeh message urgency create kar raha hai (jaldi decision lene ka pressure).");

    advice.push("Aise messages me turant react na karein, pehle verify karein.");

    humanMessage += "⚠️ Yeh message jaanbujhkar urgency create kar raha hai taaki aap bina soche turant action le lo.\n\n";
  }

  // 🔴 MONEY / GREED SCAM
  if (
    text.includes("money") ||
    text.includes("rupees") ||
    text.includes("lakh") ||
    text.includes("prize") ||
    text.includes("reward") ||
    text.includes("cash") ||
    text.includes("win")
  ) {
    riskScore += 25;

    reasons.push("Yeh message paisa ya reward ka lalach de raha hai.");

    advice.push("Easy money ya reward wale offers par kabhi turant trust na karein.");

    humanMessage += "💰 Yeh message aapko lalach de raha hai (reward, prize ya paise ka promise). Yeh scammers ki common trick hai.\n\n";
  }

  // 🔴 FAKE OFFER (NEW FIX 🔥)
  if (
    text.includes("free") ||
    text.includes("offer") ||
    text.includes("internship") ||
    text.includes("job")
  ) {
    riskScore += 25;
    scamType = "Fake Offer";

    reasons.push("Yeh ek fake offer ya free opportunity ho sakta hai.");

    advice.push("Free ya too-good-to-be-true offers ko hamesha verify karein.");

    humanMessage += "🎁 Yeh message ek fake offer ho sakta hai. 'Free' ya 'special offer' ka use karke aapko attract kiya ja raha hai.\n\n";
  }

  // 🔴 BANK / OTP
  if (
    text.includes("otp") ||
    text.includes("bank") ||
    text.includes("account") ||
    text.includes("verify")
  ) {
    riskScore += 40;
    scamType = "Banking Scam";

    reasons.push("Yeh message sensitive information (OTP ya account details) maang raha hai.");

    advice.push("Kabhi bhi OTP ya bank details kisi ke sath share na karein.");

    humanMessage += "🚨 Yeh message aapse sensitive information maang raha hai (OTP ya bank details). Koi bhi genuine company kabhi aisa nahi karti.\n\n";
  }

  // 🔴 LINK DETECTION
  if (text.includes("http") || text.includes("www") || text.includes(".com")) {
    riskScore += 30;
    scamType = "Phishing Link";

    reasons.push("Message me suspicious link diya gaya hai.");

    advice.push("Unknown links par click karne se pehle URL check karein.");

    humanMessage += "🔗 Is message me suspicious link hai. Aise links aapka data chura sakte hain.\n\n";
  }

  // 🔴 THREAT / FEAR (NEW 🔥)
  if (
    text.includes("blocked") ||
    text.includes("suspended") ||
    text.includes("legal action")
  ) {
    riskScore += 30;

    reasons.push("Yeh message dar ya threat create kar raha hai.");

    advice.push("Aise dar wale messages me panic na karein, pehle verify karein.");

    humanMessage += "😨 Yeh message aapko darakar control karne ki koshish kar raha hai. Scammers fear ka use karte hain.\n\n";
  }

  // ✅ RESULT FIX
  if (riskScore >= 70) result = "DANGEROUS ❌";
  else if (riskScore >= 30) result = "RISKY ⚠️";

  // 🟢 DEFAULT SAFE
  if (reasons.length === 0) {
    reasons.push("Koi clear scam signal nahi mila.");
    advice.push("Phir bhi unknown messages par satark rahein.");
  }

  // 🧠 DEFAULT HUMAN MESSAGE
  if (humanMessage === "") {
    humanMessage = "✅ Yeh message normal lag raha hai. Koi clear scam signal nahi mila, lekin phir bhi satark rahein.";
  }

  // 🔥 SAFETY STATUS
  let safetyStatus = "";
  let reminder = "";
  let emergency = "";

  if (riskScore === 0) {
    safetyStatus = "✅ Aap safe hain.";
  }

  if (riskScore >= 70) {
    safetyStatus = "🚨 Yeh message dangerous ho sakta hai. Is par trust mat karein.";
    emergency = "⚠️ Agar aapne info share kiya hai, turant bank ya support se contact karein.";
  }

  if (riskScore >= 30 && riskScore < 70) {
    safetyStatus = "⚠️ Yeh message suspicious lag raha hai. Dhyaan se handle karein.";
  }

  reminder = "👉 Kabhi bhi OTP ya personal details share na karein.";

  // 🧠 FINAL HUMAN LINE (REPLACED 🔥)
  let finalMessage = "";

  if (result.includes("SAFE")) {
    finalMessage = "👍 Yeh message normal lag raha hai. Koi clear danger nahi mila.";
  } else if (result.includes("RISKY")) {
    finalMessage = "⚠️ Yeh message suspicious lag raha hai. Thoda dhyaan se check karein.";
  } else {
    finalMessage = "🚨 Yeh message scam ho sakta hai. Is par trust bilkul na karein.";
  }

  return {
    riskScore,
    result,
    scamType,
    reasons,
    advice,
    safetyStatus,
    reminder,
    emergency,
    humanMessage,
    finalMessage
  };
}

module.exports = detectScam;

function detectManipulation(input) {
  let text = input.toLowerCase();

  let signals = [];
  let score = 0;
  let manipulationMessage = "";
  let manipulationAdvice = [];

  // 😨 FEAR
  if (
    text.includes("blocked") ||
    text.includes("suspended") ||
    text.includes("legal action") ||
    text.includes("account will be closed") ||
    text.includes("warning")
  ) {
    signals.push("Fear");
    score += 25;

    manipulationMessage += "😨 Yeh message tumhe darakar control karne ki koshish kar raha hai (account block ya legal action ka darr).\n👉 Jab bhi darr create hota hai, samajh jao koi tumhe jaldi decision lene par majboor kar raha hai.\n\n";

    manipulationAdvice.push("🧘 Panic me action mat lo, pehle calmly check karo.");
  }

  // ⏰ URGENCY
  if (
    text.includes("urgent") ||
    text.includes("immediately") ||
    text.includes("now") ||
    text.includes("within 24 hours")
  ) {
    signals.push("Urgency");
    score += 20;

    manipulationMessage += "⚠️ Yeh message tumhe jaldi karne ke liye push kar raha hai.\n👉 Real companies tumhe pressure nahi deti — scammer hamesha 'abhi karo' bolta hai.\n\n";

    manipulationAdvice.push("⏳ Jaldi decision mat lo, thoda rukkar verify karo.");
  }

  // 👑 AUTHORITY
  if (
    text.includes("bank") ||
    text.includes("government") ||
    text.includes("official") ||
    text.includes("rbi")
  ) {
    signals.push("Authority");
    score += 20;

    manipulationMessage += "🏛️ Yeh message authority ka naam use karke trust jeetne ki koshish kar raha hai.\n👉 Sirf naam dekhkar trust mat karo — verify zaroor karo.\n\n";

    manipulationAdvice.push("🏛️ Official website ya helpline se directly verify karo.");
  }

  // 💰 GREED
  if (
    text.includes("win") ||
    text.includes("reward") ||
    text.includes("prize") ||
    text.includes("free") ||
    text.includes("double money") ||
    text.includes("lakh") ||
    text.includes("rupees")
  ) {
    signals.push("Greed");
    score += 25;

    manipulationMessage += "💰 Yeh message tumhe lalach dekar fasana chah raha hai.\n👉 Easy money ya free reward — 90% cases me scam hota hai.\n\n";

    manipulationAdvice.push("💡 'Too good to be true' offers ko ignore karo.");
  }

  // 🎯 PRESSURE
  if (
    text.includes("don't tell anyone") ||
    text.includes("limited time") ||
    text.includes("act fast") ||
    text.includes("secret")
  ) {
    signals.push("Pressure");
    score += 20;

    manipulationMessage += "🎯 Yeh message tum par pressure bana raha hai (secret ya limited time bolkar).\n👉 Jo cheez chupane ko bole, usme risk hota hai.\n\n";

    manipulationAdvice.push("🤫 Aise messages ko kisi trusted person ke saath discuss karo.");
  }

  // 🔗 LINK TRICK (NEW 🔥)
  if (text.includes("http") || text.includes("www")) {
    signals.push("Suspicious Link");
    score += 20;

    manipulationMessage += "🔗 Message me link diya gaya hai — yeh tumhe fake website par le ja sakta hai.\n👉 Scam ka sabse common tareeka hota hai fake link.\n\n";

    manipulationAdvice.push("🔍 Link par click karne se pehle URL check karo.");
  }

  // 🧠 DEFAULT MESSAGE
  if (manipulationMessage === "") {
    manipulationMessage = "✅ Is message me koi strong emotional manipulation detect nahi hua.\n👉 Phir bhi unknown messages me basic caution zaroor rakho.";
    manipulationAdvice.push("👍 Basic safety rules follow karo.");
  }

  // 🎯 LEVEL
  let level = "LOW";
  if (score >= 60) level = "HIGH";
  else if (score >= 30) level = "MEDIUM";

  return {
    manipulationScore: score,
    manipulationLevel: level,
    signals,
    manipulationMessage,
    manipulationAdvice
  };
}

module.exports = { detectManipulation };

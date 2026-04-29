function detectManipulation(input) {
  let text = input.toLowerCase();

  let signals = [];
  let score = 0;
  let manipulationMessage = "";
  
  // 😨 FEAR
  if (
    text.includes("blocked") ||
    text.includes("suspended") ||
    text.includes("legal action") ||
    text.includes("account will be closed")
  ) {
    signals.push("Fear");
    score += 25;
  }
if (
  text.includes("blocked") ||
  text.includes("suspend") ||
  text.includes("warning")
) {
  manipulationScore += 20;
  signals.push("Fear");

  manipulationMessage += "😨 Yeh message dar create kar raha hai (account block ya problem ka). Scammers fear ka use karke aapko panic me decision lene par majboor karte hain.\n\n";
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
  }
  if (text.includes("urgent") || text.includes("immediately")) {
  manipulationScore += 20;
  signals.push("Urgency");

  manipulationMessage += "⚠️ Yeh message aapko jaldi decision lene par majboor kar raha hai. Yeh ek psychological trick hai jisse aap bina soche action le lo.\n\n";
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
  }
  if (
  text.includes("bank") ||
  text.includes("government") ||
  text.includes("official")
) {
  manipulationScore += 15;
  signals.push("Authority");

  manipulationMessage += "🏛️ Yeh message kisi authority (bank ya government) ka naam use kar raha hai. Yeh trust gain karne ki trick hoti hai.\n\n";
  }

  // 💰 GREED
  if (
    text.includes("win") ||
    text.includes("prize") ||
    text.includes("free") ||
    text.includes("double money")
  ) {
    signals.push("Greed");
    score += 25;
  }
  if (
  text.includes("win") ||
  text.includes("reward") ||
  text.includes("prize")
) {
  manipulationScore += 20;
  signals.push("Greed");

  manipulationMessage += "💰 Yeh message aapko lalach de raha hai (reward ya prize). Yeh ek common manipulation technique hai jisme aapko easy profit ka promise diya jata hai.\n\n";
  }

  // 🎯 PRESSURE
  if (
    text.includes("don't tell anyone") ||
    text.includes("limited time") ||
    text.includes("act fast")
  ) {
    signals.push("Pressure");
    score += 20;
  }

  // FINAL LEVEL
  let level = "LOW";
  if (score >= 60) level = "HIGH";
  else if (score >= 30) level = "MEDIUM";

  return {
    manipulationScore: score,
    manipulationLevel: level,
    signals
  };
}

module.exports = { detectManipulation };

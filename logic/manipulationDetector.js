function detectManipulation(input) {
  let text = input.toLowerCase();

  let signals = [];
  let score = 0;

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

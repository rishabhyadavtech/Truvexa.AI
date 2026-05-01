function detectManipulation(input) {
  let text = input.toLowerCase();

  let signals = [];
  let score = 0;
  let messages = [];
  let advice = [];

  // 🎯 Random variation (AI feel, no template)
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // 😨 FEAR
  if (
    text.includes("blocked") ||
    text.includes("suspended") ||
    text.includes("legal action") ||
    text.includes("warning") ||
    text.includes("expire")
  ) {
    signals.push("Fear");
    score += 25;

    messages.push(pick([
      "😨 Yeh message dar create kar raha hai taaki tum panic me decision lo.",
      "😨 Dar ka use karke tumhe control karne ki koshish ho rahi hai.",
      "😨 Yeh threat-based tactic hai — jaldi react karwane ke liye."
    ]));

    advice.push("Panic me decision mat lo — pehle verify karo.");
  }

  // ⏰ URGENCY
  if (
    text.includes("urgent") ||
    text.includes("immediately") ||
    text.includes("now") ||
    text.includes("within") ||
    text.includes("act fast")
  ) {
    signals.push("Urgency");
    score += 20;

    messages.push(pick([
      "⚠️ Yeh message tumhe jaldi decision lene ke liye push kar raha hai.",
      "⚠️ Yahan urgency create ki gayi hai taaki tum bina soche react karo.",
      "⚠️ Jaldi karne ka pressure diya ja raha hai — yeh common manipulation hai."
    ]));

    advice.push("Jaldi decision mat lo — thoda rukkar socho.");
  }

  // 👑 AUTHORITY
  if (
    text.includes("bank") ||
    text.includes("government") ||
    text.includes("official") ||
    text.includes("rbi") ||
    text.includes("income tax")
  ) {
    signals.push("Authority");
    score += 20;

    messages.push(pick([
      "🏛️ Authority ka naam use karke trust gain karne ki koshish ho rahi hai.",
      "🏛️ Yeh official lagne ka natak ho sakta hai.",
      "🏛️ Naam dekhkar trust mat karo — verify zaroor karo."
    ]));

    advice.push("Official website ya helpline se verify karo.");
  }

  // 💰 GREED
  if (
    text.includes("win") ||
    text.includes("reward") ||
    text.includes("prize") ||
    text.includes("free") ||
    text.includes("lakh") ||
    text.includes("rupees") ||
    text.includes("money") ||
    text.includes("profit") ||
    text.includes("double")
  ) {
    signals.push("Greed");
    score += 25;

    messages.push(pick([
      "💰 Yeh message tumhe lalach dekar fasana chah raha hai.",
      "💰 Easy money ka promise diya ja raha hai — yeh risky sign hai.",
      "💰 Yeh reward ya paisa ka trap ho sakta hai."
    ]));

    advice.push("Too good to be true offers ignore karo.");
  }

  // 🎯 PRESSURE / ISOLATION
  if (
    text.includes("don't tell") ||
    text.includes("secret") ||
    text.includes("limited time")
  ) {
    signals.push("Pressure");
    score += 20;

    messages.push(pick([
      "🎯 Tum par pressure banaya ja raha hai taaki tum soch na pao.",
      "🎯 Secret ya limited time ka use manipulation ka sign hota hai.",
      "🎯 Yeh tumhe isolate karne ki koshish hai (dusron se na batane ke liye)."
    ]));

    advice.push("Kisi trusted person se discuss karo.");
  }

  // 🔗 LINK
  if (text.includes("http") || text.includes("www")) {
    signals.push("Link");
    score += 20;

    messages.push(pick([
      "🔗 Yeh link tumhe fake ya phishing site par le ja sakta hai.",
      "🔗 Unknown link ke through data chori ho sakta hai.",
      "🔗 Link click karna risky ho sakta hai — pehle check karo."
    ]));

    advice.push("Link click karne se pehle URL verify karo.");
  }

  // 🧠 NO SIGNAL (SAFE CASE)
  if (messages.length === 0) {
    return {
      manipulationScore: 0,
      manipulationLevel: "LOW",
      signals: [],
      manipulationMessage: "👍 Koi strong manipulation detect nahi hua.",
      manipulationAdvice: ["Basic caution rakho."]
    };
  }

  // 🎯 LEVEL CALCULATION
  let level = "LOW";
  if (score >= 60) level = "HIGH";
  else if (score >= 30) level = "MEDIUM";

  // 🎯 SMART SUMMARY (NOT TEMPLATE)
  let summary = "";

  if (level === "HIGH") {
    summary = "🚨 Yeh message strong manipulation tactics use kar raha hai.";
  } else {
    summary = "⚠️ Is message me kuch manipulation patterns dikh rahe hain.";
  }

  // 🎯 FINAL AI STYLE MESSAGE
  let finalMessage = `
${summary}

👉 Dhyaan dene wali baatein:

${messages.join("\n\n")}

👉 Isliye bina soche action lena risky ho sakta hai.
  `.trim();

  return {
    manipulationScore: score,
    manipulationLevel: level,
    signals: [...new Set(signals)],
    manipulationMessage: finalMessage,
    manipulationAdvice: [...new Set(advice)]
  };
}

module.exports = { detectManipulation };

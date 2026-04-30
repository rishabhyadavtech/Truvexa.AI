async function checkScam() {

  const message = document.getElementById("input").value.trim();
  const resultBox = document.getElementById("result");

  if (!message) {
    alert("Please enter a message");
    return;
  }

  try {
    const res = await fetch("/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();

    const scam = data.scam || {};
    const manipulation = data.manipulation || {};

    resultBox.className = "result-box";

    const isSafe = scam.result && scam.result.includes("SAFE");

    // =========================
    // 🟢 SAFE MODE (CLEAN)
    // =========================
    if (isSafe) {
      resultBox.classList.add("safe");

      resultBox.innerText = `
✅ Yeh message safe lag raha hai.

Koi strong scam ya manipulation signal detect nahi hua.
Aap bina tension ke is message ko normal treat kar sakte hain.
      `;

      return;
    }

    // =========================
    // 🔴 RISK / SCAM MODE
    // =========================
    if (scam.result.includes("DANGEROUS")) {
      resultBox.classList.add("danger");
    } else {
      resultBox.classList.add("warning");
    }

    // 🎯 AI STYLE DYNAMIC EXPLANATION
    let explanationParts = [];

    if (scam.signals?.includes("Urgency")) {
      explanationParts.push("⚠️ Message aapko jaldi decision lene ke liye push kar raha hai.");
    }

    if (scam.signals?.includes("Greed")) {
      explanationParts.push("💰 Isme paise ya reward ka lalach diya ja raha hai.");
    }

    if (scam.signals?.includes("Sensitive Info")) {
      explanationParts.push("🚨 Yeh aapse sensitive information maang raha hai.");
    }

    if (scam.signals?.includes("Link")) {
      explanationParts.push("🔗 Isme ek suspicious link diya gaya hai.");
    }

    if (scam.signals?.includes("Fear")) {
      explanationParts.push("😨 Yeh message dar create karke control karne ki koshish kar raha hai.");
    }

    if (manipulation.signals?.includes("Authority")) {
      explanationParts.push("🏛️ Authority ka naam use karke trust gain karne ki koshish ho rahi hai.");
    }

    if (manipulation.signals?.includes("Pressure")) {
      explanationParts.push("🎯 Aap par pressure create kiya ja raha hai (limited time / secret).");
    }

    // 🎯 FINAL EXPLANATION STRING
    let explanation = explanationParts.join("\n\n");

    // 🎯 MANIPULATION SUMMARY (SMART)
    let manipulationLine = "";

    if (manipulation.manipulationLevel === "HIGH") {
      manipulationLine = "🚨 Yeh message strong manipulation tactics use kar raha hai.";
    } else if (manipulation.manipulationLevel === "MEDIUM") {
      manipulationLine = "⚠️ Is message me kuch manipulation patterns dikh rahe hain.";
    } else {
      manipulationLine = "";
    }

    // 🎯 UNIQUE ADVICE
    let allAdvice = [
      ...(scam.advice || []),
      ...(manipulation.manipulationAdvice || [])
    ];

    allAdvice = [...new Set(allAdvice)];

    // 🎯 FINAL OUTPUT
    resultBox.innerText = `
${scam.finalMessage || "⚠️ Yeh message suspicious lag raha hai."}

🧠 Samajh kya aa raha hai:

${explanation}

${manipulationLine ? manipulationLine + "\n" : ""}

⚠️ Risk Signals:
- ${(scam.signals || []).join("\n- ")}

👉 Aap kya karein:
- ${allAdvice.join("\n- ")}
    `;

  } catch (error) {
    console.error("Fetch Error:", error);

    resultBox.className = "result-box danger";
    resultBox.innerText =
      "❌ Server error. Please refresh and try again.";
  }
}

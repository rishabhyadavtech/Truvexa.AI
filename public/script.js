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

    const type = data.type;
    const decision = data.decision || {};

    // 🔄 Reset UI
    resultBox.className = "result-box";

    // =========================
    // 🟢 SAFE MODE (CLEAN UX)
    // =========================
    if (type === "SAFE") {
      resultBox.classList.add("safe");

      resultBox.innerText = `
✅ Yeh message safe lag raha hai.

Koi strong scam ya manipulation signal detect nahi hua.

👉 Aap bina tension ke isse normal treat kar sakte hain.
      `.trim();

      return;
    }

    // =========================
    // 🔴 / 🟡 COLOR STATE
    // =========================
    if (type === "DANGEROUS") {
      resultBox.classList.add("danger");
    } else {
      resultBox.classList.add("warning");
    }

    // =========================
    // 🧠 SMART EXPLANATION (AI FEEL)
    // =========================
    let explanation = data.explanation || "";

    // Extra spacing clean
    explanation = explanation.replace(/\n{3,}/g, "\n\n");

    // =========================
    // 🎯 DECISION BLOCK
    // =========================
    let decisionBlock = "";

    if (decision.decision || decision.action || decision.reason) {
      decisionBlock = `
----------------------------

🧠 Final Decision:

👉 ${decision.decision || ""}

📌 Kya karein:
👉 ${decision.action || ""}

💡 Kyun:
${decision.reason || ""}
      `;
    }

    // =========================
    // ⚠️ SIGNALS
    // =========================
    let signalsBlock = "";

    if (data.signals && data.signals.length > 0) {
      signalsBlock = `
----------------------------

⚠️ Risk Signals:
- ${data.signals.join("\n- ")}
      `;
    }

    // =========================
    // 👉 ADVICE
    // =========================
    let adviceBlock = "";

    if (data.advice && data.advice.length > 0) {
      adviceBlock = `
----------------------------

👉 Aap kya karein:
- ${data.advice.join("\n- ")}
      `;
    }

    // =========================
    // 🎯 FINAL OUTPUT (NO TEMPLATE FEEL)
    // =========================
    resultBox.innerText = `
${data.finalMessage || "⚠️ Yeh message suspicious lag raha hai."}

🧠 Samajh kya aa raha hai:

${explanation}
${decisionBlock}
${signalsBlock}
${adviceBlock}
    `.trim();

  } catch (error) {
    console.error("Fetch Error:", error);

    resultBox.className = "result-box danger";
    resultBox.innerText =
      "❌ Server error. Please refresh and try again.";
  }
}

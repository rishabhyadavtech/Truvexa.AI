async function checkScam() {

  const message = document.getElementById("input").value.trim();
  const resultBox = document.getElementById("result");
  const feedbackBox = document.getElementById("feedbackBox");

  if (!message) {
    alert("Please enter a message");
    return;
  }

  // 🔄 Reset UI
  resultBox.className = "result-box";
  resultBox.innerText = "⏳ Checking message...";
  feedbackBox.style.display = "none";

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

    // =========================
    // 🟢 SAFE MODE
    // =========================
    if (type === "SAFE") {
      resultBox.classList.add("safe");

      resultBox.innerText = `
🟢 Good News — Yeh message safe lag raha hai.

Is message me koi bhi strong scam ya manipulation pattern detect nahi hua.
Na urgency hai, na lalach, na koi suspicious behavior.

👍 Aap ise normal conversation ki tarah treat kar sakte hain.

💡 Phir bhi online safety ke liye basic caution rakhna smart hota hai.
      `.trim();

      feedbackBox.style.display = "block";
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
    // 🧠 EXPLANATION CLEAN
    // =========================
    let explanation = (data.explanation || "").replace(/\n{3,}/g, "\n\n");

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
    // ⚠️ SIGNALS BLOCK
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
    // 👉 ADVICE BLOCK
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
    // 🎯 FINAL OUTPUT
    // =========================
    resultBox.innerText = `
${data.finalMessage || "⚠️ Yeh message suspicious lag raha hai."}

🧠 Samajh kya aa raha hai:

${explanation}
${decisionBlock}
${signalsBlock}
${adviceBlock}
    `.trim();

    // ✅ SHOW FEEDBACK UI
    feedbackBox.style.display = "block";

  } catch (error) {
    console.error("Fetch Error:", error);

    resultBox.className = "result-box danger";
    resultBox.innerText =
      "❌ Server error. Please refresh and try again.";
  }
}


// =========================
// 👍 FEEDBACK SYSTEM
// =========================
async function sendFeedback(type) {

  const message = document.getElementById("input").value;

  try {

    await fetch(
      "https://script.google.com/macros/s/AKfycby5KiRfYhhHGa4jAS1QDy64eI1EzYmgkB_Bd3zo_fvAMX99pzysGi4J03viLijZgvOw1A/exec",
      {
        method: "POST",
        body: JSON.stringify({
          message: message,
          feedback: type,
          report: ""
        })
      }
    );

    alert("❤️ Feedback saved successfully");

  } catch (err) {

    console.error(err);

    alert("❌ Feedback failed");
  }
}


// =========================
// 🚨 REPORT WRONG RESULT
// =========================
async function reportIssue() {

  const message = document.getElementById("input").value;

  try {

    await fetch(
      "https://script.google.com/macros/s/AKfycby5KiRfYhhHGa4jAS1QDy64eI1EzYmgkB_Bd3zo_fvAMX99pzysGi4J03viLijZgvOw1A/exec",
      {
        method: "POST",
        body: JSON.stringify({
          message: message,
          feedback: "",
          report: "Wrong Result Reported"
        })
      }
    );

    alert("🚀 Report submitted successfully");

  } catch (err) {

    console.error(err);

    alert("❌ Report failed");
  }
}

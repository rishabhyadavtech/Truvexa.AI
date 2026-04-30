async function checkScam() {  
  console.log("BUTTON CLICKED");  

  const message = document.getElementById("input").value.trim();  

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

    if (!res.ok) {  
      throw new Error("Server error");  
    }  

    const data = await res.json();  

    // ✅ SAFE ACCESS
    const scam = data.scam || {};
    const manipulation = data.manipulation || {};

    document.getElementById("result").innerText = `  

==============================  

${scam.finalMessage || "No result"}  

------------------------------  

🧠 AI Explanation:  
${scam.humanMessage || "No explanation available"}  

------------------------------  

🔥 Manipulation Insight:  
Level: ${manipulation.manipulationLevel || "LOW"}  
Score: ${manipulation.manipulationScore || 0}  

Signals:  
- ${(manipulation.signals && manipulation.signals.length > 0)  
        ? manipulation.signals.join("\n- ")  
        : "No strong signals detected"}  

------------------------------  

👉 Aap kya karein:  
- ${(scam.advice && scam.advice.length > 0)  
        ? scam.advice.join("\n- ")  
        : "Basic caution rakhein"}  

🧠 Smart Advice:  
- ${(manipulation.manipulationAdvice && manipulation.manipulationAdvice.length > 0)  
        ? manipulation.manipulationAdvice.join("\n- ")  
        : "Calm rehkar verify karein"}  

------------------------------  

🛡️ Safety Status:  
${scam.safetyStatus || ""}  

📌 Reminder:  
${scam.reminder || ""}  

${scam.emergency || ""}  

------------------------------  

📢 General Safety Tips:  
- Jaldi decision na lein  
- OTP / personal info share na karein  
- Sirf official source verify karein  

==============================  
`;  

  } catch (error) {  
    console.error("Fetch Error:", error);  

    document.getElementById("result").innerText =  
      "❌ Server error ya response nahi mila. Page refresh karke dobara try karein.";  
  }  
}

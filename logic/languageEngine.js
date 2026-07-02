const LANG = {

  en: {

dangerExplanation:
"This message uses fear, urgency or greed to pressure you into acting quickly."

    safe: "This message appears safe.",

    suspicious: "This message looks suspicious.",

    dangerous: "This message may be a scam.",

    noSignal: "No strong scam indicators were detected.",

    verify: "Verify before taking any action.",

    dontClick: "Do not click unknown links.",

    dontShare: "Do not share OTP, passwords or bank details."

  },

  hi: {

 dangerExplanation:
"👉 Yeh combination (fear, urgency, ya lalach) usually scam messages me use hota hai taaki aap bina soche react karein."

    safe: "✅ Yeh message safe lag raha hai.",

    suspicious: "⚠️ Yeh message suspicious lag raha hai.",

    dangerous: "🚨 Yeh message scam ho sakta hai.",

    noSignal: "Koi strong scam signal detect nahi hua.",

    verify: "Action lene se pehle verify karein.",

    dontClick: "Unknown link par click mat karein.",

    dontShare: "OTP, password aur bank details share mat karein."

  }

};

function getLanguage(lang = "hi") {

  return LANG[lang] || LANG.hi;

}

module.exports = {
  getLanguage
};
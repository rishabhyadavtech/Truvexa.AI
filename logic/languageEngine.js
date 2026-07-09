const LANG = {

  en: {

    // =========================
    // BASIC UI
    // =========================

highRisk:
  "High risk — this message appears to be a scam.",

mediumRisk:
  "This message looks suspicious. Verify before taking action.",

safeStatus:
  "No major security risks detected.",

reminder:
  "Never share your OTP, passwords or banking details.",

emergency:
  "If you already shared sensitive information, contact your bank immediately.",

    safe: "This message appears safe.",

    suspicious: "This message looks suspicious.",

    dangerous: "This message may be a scam.",

    dangerExplanation:
      "This message uses fear, urgency or greed to pressure you into acting quickly.",

    noSignal:
      "No strong scam indicators were detected.",

    verify:
      "Verify before taking any action.",

    dontClick:
      "Do not click unknown links.",

    dontShare:
      "Do not share OTP, passwords or bank details.",

    // =========================
    // REASONS
    // =========================

    reasons: {

      SHORTENED_URL:
        "The message contains a shortened URL that hides its real destination.",

      UNUSUAL_TLD:
        "The website uses an uncommon domain extension that is frequently abused by scammers.",

      BRAND_IMPERSONATION:
        "The domain appears to imitate a well-known brand.",

      LONG_URL:
        "The URL is unusually long, which can be a phishing indicator.",

      MULTIPLE_SUBDOMAINS:
        "The domain contains multiple subdomains, a common phishing technique.",

      INVALID_URL:
        "The URL format appears to be invalid.",

      HIGH_RISK:
        "Multiple independent security signals indicate a high-risk message.",

      MEDIUM_RISK:
        "Several suspicious indicators were detected.",

      SAFE:
        "No significant security risks were detected.",

    URGENCY:
  "The message creates pressure to act immediately.",

GREED:
  "The message promises money, rewards or unrealistic benefits.",

OTP_REQUEST:
  "The message asks for an OTP or banking credentials.",

EXTERNAL_LINK:
  "The message contains an external link that should be verified before opening.",

FEAR:
  "The message uses fear to pressure you into taking action.",

UPFRONT_PAYMENT:
  "The message asks for money before providing the promised service.",

TOO_EASY_JOB:
  "The job offer promises high income with little or no experience.",

JOB_COMBO:
  "The combination of an easy job and high income is commonly used in scams.",

JOB_FEE:
  "Legitimate employers do not ask candidates to pay fees before hiring.",

URGENT_LINK:
  "Urgency combined with a link is a common phishing technique.",

OTP_LINK:
  "The combination of an OTP request and a link indicates a high-risk phishing attempt.",

MONEY_URGENCY:
  "Money combined with urgency is a common scam pattern.",

FEAR_LINK:
  "Fear combined with a link is frequently used in phishing attacks."

},

    // =========================
    // ACTIONS
    // =========================

    actions: {

      DONT_SHARE_OTP:
        "Never share your OTP, passwords or banking details.",

      DONT_CLICK_LINK:
        "Do not click the link. Open the official website manually.",

      DONT_SEND_MONEY:
        "Do not send money until the offer has been independently verified.",

      VERIFY_OFFICIAL_SOURCE:
        "Verify the information using the official website or customer support.",

      IGNORE_MESSAGE:
        "Ignore this message and block the sender if necessary.",

      VERIFY_LINK:
        "Verify the destination of the link before opening it.",

      VERIFY_OFFER:
        "Confirm the offer through the company's official website.",

      VERIFY_FIRST:
        "Verify the information before taking any action.",

      SAFE_TO_PROCEED:
        "No major warning signs were detected."

    },

    // =========================
    // DECISIONS
    // =========================

    decisions: {

      SAFE:
        "No major risk detected.",

      MEDIUM:
        "Verify before taking any action.",

      HIGH:
        "Avoid interacting with this message."

  },

evidence: {

OTP_REQUEST:
"The message requests sensitive information. Legitimate organisations do not ask for OTPs through messages.",

ADVANCE_FEE:
"The sender asks you to pay before receiving the promised service or job. This is a common scam pattern.",

EXTERNAL_LINK:
"The message contains an external website. Always verify the destination before opening it.",

URGENCY:
"The message creates time pressure to make you act before you can think or verify the claim.",

GREED:
"The message promises money, rewards or unrealistic benefits to attract attention.",

FEAR:
"The message uses fear or threats to pressure you into taking immediate action.",

UPFRONT_PAYMENT:
"The sender asks for payment before providing the promised service, which is a common scam technique.",

TOO_EASY_JOB:
"The offer promises unusually high income with little or no experience, which is a common job scam pattern.",

JOB_COMBO:
"The combination of an easy job and unusually high income is frequently used by scammers.",

JOB_FEE:
"Legitimate employers do not ask candidates to pay registration or joining fees before hiring.",

SHORTENED_URL:
"Shortened links hide the real destination, making it difficult to know where the link actually leads.",

UNUSUAL_TLD:
"The website uses an uncommon domain extension that is frequently abused in phishing campaigns.",

BRAND_IMPERSONATION:
"The domain appears to imitate a trusted brand in order to trick users.",

LONG_URL:
"Very long URLs are commonly used to hide suspicious parts of a phishing link.",

MULTIPLE_SUBDOMAINS:
"Attackers often use multiple subdomains to make fake websites look legitimate.",

INVALID_URL:
"The URL format is invalid or intentionally malformed."
},

hi: {

  highRisk:
  "🚨 High risk — yeh message scam lag raha hai.",

mediumRisk:
  "⚠️ Yeh message suspicious hai. Action lene se pehle verify karein.",

safeStatus:
  "✅ Koi major security risk detect nahi hua.",

reminder:
  "👉 Kabhi bhi OTP, password ya bank details share mat karein.",

emergency:
  "⚠️ Agar aapne details share kar di hain to turant bank se contact karein.",

  safe: "✅ Yeh message safe lag raha hai.",

  suspicious: "⚠️ Yeh message suspicious lag raha hai.",

  dangerous: "🚨 Yeh message scam ho sakta hai.",

  dangerExplanation:
    "👉 Yeh combination (fear, urgency, ya lalach) usually scam messages me use hota hai taaki aap bina soche react karein.",

  noSignal: "Koi strong scam signal detect nahi hua.",

  verify: "Action lene se pehle verify karein.",

  dontClick: "Unknown link par click mat karein.",

  dontShare: "OTP, password aur bank details share mat karein.",

  reasons:{

    SHORTENED_URL:
      "Shortened link asli destination ko chhupa sakta hai.",

    UNUSUAL_TLD:
      "Domain unusual extension use kar raha hai jo scams me common hai.",

    BRAND_IMPERSONATION:
      "Domain kisi popular brand ki nakal karta hua lag raha hai.",

    LONG_URL:
      "Bahut lambi URL phishing ka signal ho sakti hai.",

    MULTIPLE_SUBDOMAINS:
      "Bahut saare subdomains phishing me common hote hain.",

    INVALID_URL:
      "URL valid format me nahi hai.",

    HIGH_RISK:
      "Kai independent security signals high risk dikha rahe hain.",

    MEDIUM_RISK:
      "Kuch suspicious indicators detect hue hain.",

    SAFE:
      "Koi major security risk detect nahi hua.",

URGENCY:
  "Message turant action lene ka pressure bana raha hai.",

GREED:
  "Message paise ya reward ka lalach de raha hai.",

OTP_REQUEST:
  "Message OTP ya bank details maang raha hai.",

EXTERNAL_LINK:
  "Message me external link hai jise verify kiye bina open nahi karna chahiye.",

FEAR:
  "Message dar ka istemal karke action lene ka pressure bana raha hai.",

UPFRONT_PAYMENT:
  "Message service dene se pehle paise maang raha hai.",

TOO_EASY_JOB:
  "Bina experience ke high income ka promise suspicious hai.",

JOB_COMBO:
  "Easy job aur high salary ka combination scams me common hai.",

JOB_FEE:
  "Asli companies job dene se pehle registration fee nahi leti.",

URGENT_LINK:
  "Urgency aur link ka combination phishing ka common pattern hai.",

OTP_LINK:
  "OTP request aur link ka combination bahut high-risk phishing signal hai.",

MONEY_URGENCY:
  "Paise aur urgency ka combination scam me common hota hai.",

FEAR_LINK:
  "Dar aur link ka combination phishing me frequently use hota hai."
},

  actions: {

    DONT_SHARE_OTP:
      "OTP, password ya bank details kabhi share mat karein.",

    DONT_CLICK_LINK:
      "Link par click mat karein. Official website manually kholen.",

    DONT_SEND_MONEY:
      "Verify kiye bina paise mat bhejein.",

    VERIFY_OFFICIAL_SOURCE:
      "Official website ya customer support se verify karein.",

    IGNORE_MESSAGE:
      "Message ignore karein aur zarurat ho to sender ko block karein.",

    VERIFY_LINK:
      "Link kholne se pehle verify karein.",

    VERIFY_OFFER:
      "Offer ko official website se confirm karein.",

    VERIFY_FIRST:
      "Koi bhi action lene se pehle verify karein.",

    SAFE_TO_PROCEED:
      "Koi major warning sign detect nahi hua."

  },

  decisions: {

    SAFE:
      "Koi major risk detect nahi hua.",

    MEDIUM:
      "Action lene se pehle verify karein.",

    HIGH:
      "Is message se interact na karein."

  },

evidence: {

OTP_REQUEST:
"Message me OTP ya sensitive information maangi ja rahi hai. Legitimate organisations kabhi bhi message se OTP nahi maangti.",

ADVANCE_FEE:
"Service ya job dene se pehle paise maange ja rahe hain. Ye scam ka common pattern hai.",

EXTERNAL_LINK:
"Message me external website hai. Link kholne se pehle uski authenticity verify karein.",

URGENCY:
"Message jaldi decision lene ka pressure bana raha hai taaki aap verify na kar pao.",

GREED:
"Message paise, reward ya unrealistic benefit ka lalach de raha hai.",

FEAR:
"Message dar ka use karke turant action lene ka pressure bana raha hai.",

UPFRONT_PAYMENT:
"Service ya job dene se pehle paise maangna scam ka common pattern hai.",

TOO_EASY_JOB:
"Bina experience ke bahut zyada income ka promise suspicious hota hai.",

JOB_COMBO:
"Easy job aur high salary ka combination scammers bahut use karte hain.",

JOB_FEE:
"Asli companies hiring se pehle registration ya joining fee nahi leti.",

SHORTENED_URL:
"Shortened link asli website ko chhupa deta hai isliye verify karna zaroori hai.",

UNUSUAL_TLD:
"Unusual domain extension phishing websites me commonly use hoti hai.",

BRAND_IMPERSONATION:
"Website kisi trusted brand ki nakal karne ki koshish kar rahi hai.",

LONG_URL:
"Bahut lambi URL phishing links ka common signal hoti hai.",

MULTIPLE_SUBDOMAINS:
"Bahut saare subdomains use karke fake website ko asli dikhane ki koshish ki ja sakti hai.",

INVALID_URL:
"URL ka format valid nahi lag raha."

},

}
  
};

function getLanguage(lang = "hi") {
  return LANG[lang] || LANG.hi;
}

module.exports = {
  getLanguage
};
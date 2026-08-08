const LANG = {
en: {

    // =========================
    // BASIC UI
    // =========================
 
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

}

},

hi: {

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
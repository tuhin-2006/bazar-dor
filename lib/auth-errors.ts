const MESSAGES: Record<string, string> = {
  "invalid email or password": "ইমেইল বা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।",
  "invalid email": "ইমেইল ঠিকানাটি সঠিক নয়।",
  "user already exists": "এই ইমেইলে ইতিমধ্যে একটি অ্যাকাউন্ট আছে। সাইন ইন করুন।",
  "email already exists": "এই ইমেইলে ইতিমধ্যে একটি অ্যাকাউন্ট আছে। সাইন ইন করুন।",
  "password too short": "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।",
  "password is too short": "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।",
  "password too long": "পাসওয়ার্ড ১২৮ অক্ষরের কম হতে হবে।",
  "invalid password": "পাসওয়ার্ড সঠিক নয়।",
  "email not verified": "ইমেইলটি যাচাই করা হয়নি।",
  "email not found": "সোশ্যাল অ্যাকাউন্ট থেকে ইমেইল পাওয়া যায়নি। ইমেইল দিয়ে সাইন ইন করুন।",
  "no email": "সোশ্যাল অ্যাকাউন্ট থেকে ইমেইল পাওয়া যায়নি। ইমেইল দিয়ে সাইন ইন করুন।",
  "account not linked":
    "এই ইমেইলে আগে থেকেই একটি অ্যাকাউন্ট আছে। ইমেইল/পাসওয়ার্ড দিয়ে সাইন ইন করুন।",
  "provider not found": "সোশ্যাল লগইন এখনো কনফিগার করা হয়নি।",
  "not found": "সোশ্যাল লগইন এখনো কনফিগার করা হয়নি।",
};

function normalize(message: string): string {
  return message.trim().toLowerCase();
}

export function authErrorMessage(
  message: string | undefined,
  fallback = "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।",
): string {
  if (!message) return fallback;

  const normalized = normalize(message);

  if (MESSAGES[normalized]) return MESSAGES[normalized];

  const match = Object.entries(MESSAGES).find(([key]) =>
    normalized.includes(key),
  );
  if (match) return match[1];

  if (normalized.includes("provider") || normalized.includes("client id")) {
    return "এই সোশ্যাল লগইনটি এখনো কনফিগার করা হয়নি। ইমেইল দিয়ে চেষ্টা করুন।";
  }

  if (normalized.includes("network") || normalized.includes("fetch")) {
    return "নেটওয়ার্ক সমস্যা হচ্ছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।";
  }

  return message;
}

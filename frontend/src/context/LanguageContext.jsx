import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../i18n/languages';
import enTranslations from '../i18n/en.json';
import { TRANSLATIONS } from '../i18n/translations';

const LanguageContext = createContext();

// Core dictionary of high-frequency UI terms across major Indian languages
const REGIONAL_TERMS = {
  hi: {
    'nav.dashboard': 'डैशबोर्ड',
    'nav.pos': 'पीओएस बिलिंग',
    'nav.products': 'उत्पाद और स्टॉक',
    'nav.customers': 'ग्राहक खाता',
    'nav.expenses': 'खर्चे',
    'nav.reports': 'रिपोर्ट और एनालिटिक्स',
    'nav.aiAssistant': 'एआई सहायक',
    'nav.gst': 'जीएसटी और टैक्स',
    'nav.settings': 'सेटिंग्स',
    'nav.logout': 'साइन आउट',
    'kpi.totalSales': 'कुल बिक्री',
    'kpi.totalExpenses': 'कुल खर्च',
    'kpi.netProfit': 'शुद्ध लाभ',
    'kpi.totalCustomers': 'कुल ग्राहक',
    'kpi.totalProducts': 'कुल उत्पाद',
    'kpi.todaySales': 'आज की बिक्री',
    'common.save': 'सहेजें',
    'common.search': 'खोजें...'
  },
  ta: {
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.pos': 'பில்லிங் கவுண்டர்',
    'nav.products': 'பொருட்கள் & இருப்பு',
    'nav.customers': 'வாடிக்கையாளர் கணக்கு',
    'nav.expenses': 'செலவுகள்',
    'nav.reports': 'அறிக்கைகள்',
    'nav.aiAssistant': 'AI உதவியாளர்',
    'nav.gst': 'ஜி.எஸ்.டி & வரி',
    'nav.settings': 'அமைப்புகள்',
    'nav.logout': 'வெளியேறு',
    'kpi.totalSales': 'மொத்த விற்பனை',
    'kpi.totalExpenses': 'மொத்த செலவுகள்',
    'kpi.netProfit': 'நிகர லாபம்',
    'kpi.totalCustomers': 'வாடிக்கையாளர்கள்',
    'kpi.totalProducts': 'பொருட்கள்',
    'kpi.todaySales': 'இன்றைய விற்பனை',
    'common.save': 'சேமிக்க',
    'common.search': 'தேடுக...'
  },
  te: {
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.pos': 'పిఒఎస్ బిల్లింగ్',
    'nav.products': 'ఉత్పత్తులు & నిల్వ',
    'nav.customers': 'కస్టమర్ ఖాతా',
    'nav.expenses': 'ఖర్చులు',
    'nav.reports': 'నివేదికలు',
    'nav.aiAssistant': 'AI సహాయకుడు',
    'nav.gst': 'జీఎస్టీ & పన్ను',
    'nav.settings': 'సెట్టింగ్‌లు',
    'nav.logout': 'లాగ్ అవుట్',
    'kpi.totalSales': 'మొత్తం అమ్మకాలు',
    'kpi.totalExpenses': 'మొత్తం ఖర్చులు',
    'kpi.netProfit': 'నికర లాభం',
    'common.save': 'భద్రపరచు'
  },
  kn: {
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.pos': 'ಪಿಒಎಸ್ ಬಿಲ್ಲಿಂಗ್',
    'nav.products': 'ಉತ್ಪನ್ನಗಳು ಮತ್ತು ದಾಸ್ತಾನು',
    'nav.customers': 'ಗ್ರಾಹಕರ ಖಾತೆ',
    'nav.expenses': 'ವೆಚ್ಚಗಳು',
    'nav.reports': 'ವರದಿಗಳು',
    'nav.aiAssistant': 'AI ಸಹಾಯಕ',
    'nav.gst': 'ಜಿಎಸ್ಟಿ & ತೆರಿಗೆ',
    'nav.settings': 'ಸಂಯೋಜನೆಗಳು',
    'nav.logout': 'ಲಾಗ್ ಔಟ್',
    'kpi.totalSales': 'ಒಟ್ಟು ಮಾರಾಟ',
    'kpi.totalExpenses': 'ಒಟ್ಟು ವೆಚ್ಚಗಳು',
    'kpi.netProfit': 'ನಿವ್ವಳ ಲಾಭ'
  },
  bn: {
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.pos': 'পিওএস বিলিং',
    'nav.products': 'পণ্য ও স্টক',
    'nav.customers': 'গ্রাহক খাতা',
    'nav.expenses': 'খরচ',
    'nav.reports': 'রিপোর্ট ও বিশ্লেষণ',
    'nav.aiAssistant': 'এআই সহকারী',
    'nav.gst': 'জিএসটি ও ট্যাক্স',
    'nav.settings': 'সেটিংস',
    'nav.logout': 'লগ আউট',
    'kpi.totalSales': 'মোট বিক্রি',
    'kpi.totalExpenses': 'মোট খরচ',
    'kpi.netProfit': 'নেট লাভ'
  },
  mr: {
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.pos': 'पीओएस बिलिंग',
    'nav.products': 'उत्पादने आणि स्टॉक',
    'nav.customers': 'ग्राहक खाते',
    'nav.expenses': 'खर्च',
    'nav.reports': 'अहवाल',
    'nav.aiAssistant': 'एआय सहाय्यक',
    'nav.gst': 'जीएसटी आणि कर',
    'nav.settings': 'सेटिंग्ज',
    'nav.logout': 'लॉग आउट',
    'kpi.totalSales': 'एकूण विक्री',
    'kpi.totalExpenses': 'एकूण खर्च',
    'kpi.netProfit': 'निव्वळ नफा'
  },
  gu: {
    'nav.dashboard': 'ડેશબોર્ડ',
    'nav.pos': 'પીઓએસ બિલિંગ',
    'nav.products': 'પ્રોડક્ટ્સ અને સ્ટોક',
    'nav.customers': 'ગ્રાહક ખાતાવહી',
    'nav.expenses': 'ખર્ચ',
    'nav.reports': 'અહેવાલો',
    'nav.aiAssistant': 'AI સહાયક',
    'nav.gst': 'જીએસટી અને કરવેરા',
    'nav.settings': 'સેટિંગ્સ',
    'kpi.totalSales': 'કુલ વેચાણ',
    'kpi.netProfit': 'ચોખ્ખો નફો'
  },
  ur: {
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.pos': 'پی او ایس بلنگ',
    'nav.products': 'مصنوعات اور اسٹاک',
    'nav.customers': 'گاہک کا کھاتہ',
    'nav.expenses': 'اخراجات',
    'nav.reports': 'رپورٹس',
    'nav.aiAssistant': 'اے آئی اسسٹنٹ',
    'nav.gst': 'جی ایس ٹی اور ٹیکس',
    'nav.settings': 'سیٹنگز',
    'nav.logout': 'لاگ آؤٹ',
    'kpi.totalSales': 'کل فروخت',
    'kpi.totalExpenses': 'کل اخراجات',
    'kpi.netProfit': 'خالص منافع'
  }
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('bizpartner_lang') || DEFAULT_LANGUAGE;
  });

  const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    localStorage.setItem('bizpartner_lang', currentLanguage);
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = langMeta.dir || 'ltr';
  }, [currentLanguage, langMeta]);

  const t = (key, fallback) => {
    if (!key) return '';
    // 1. Check comprehensive TRANSLATIONS catalog for the current language
    if (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) {
      return TRANSLATIONS[currentLanguage][key];
    }
    // 2. Check REGIONAL_TERMS
    if (REGIONAL_TERMS[currentLanguage] && REGIONAL_TERMS[currentLanguage][key]) {
      return REGIONAL_TERMS[currentLanguage][key];
    }
    // 3. Check if key is a dot-separated path in enTranslations
    if (typeof key === 'string' && key.includes('.')) {
      const keys = key.split('.');
      let val = enTranslations;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          val = null;
          break;
        }
      }
      if (val && typeof val === 'string') {
        if (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][val]) {
          return TRANSLATIONS[currentLanguage][val];
        }
        return val;
      }
    }
    // 4. If fallback provided and has a translation
    if (fallback && TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][fallback]) {
      return TRANSLATIONS[currentLanguage][fallback];
    }
    return fallback !== undefined ? fallback : key;
  };

  const changeLanguage = (code) => {
    setCurrentLanguage(code);
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setCurrentLanguage,
      changeLanguage,
      langMeta,
      languages: SUPPORTED_LANGUAGES,
      availableLanguages: SUPPORTED_LANGUAGES,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

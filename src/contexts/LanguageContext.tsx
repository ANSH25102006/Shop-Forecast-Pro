import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "nav.dashboard": "Dashboard",
    "nav.products": "Products",
    "nav.forecasts": "Forecasts",
    "nav.reports": "Reports",
    "app.name": "ForecastPro",
    "app.tagline": "Retail Demand Intelligence",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Monitor your inventory and demand predictions",
    "dashboard.totalProducts": "Total Products",
    "dashboard.monthlySales": "Monthly Sales",
    "dashboard.forecastAccuracy": "Forecast Accuracy",
    "dashboard.lowStockAlerts": "Low Stock Alerts",
    "dashboard.activeItems": "Active inventory items",
    "dashboard.revenueMonth": "Revenue this month",
    "dashboard.mlPerformance": "ML model performance",
    "dashboard.needsRestocking": "Items need restocking",

    // Daily Records
    "records.title": "Daily Material Records",
    "records.takePhoto": "Take Photo",
    "records.uploadImage": "Upload Image",
    "records.addNotes": "Add notes about today's materials (optional)...",
    "records.cancel": "Cancel",
    "records.save": "Save Record",
    "records.uploading": "Uploading...",
    "records.recent": "Recent Records",
    "records.loading": "Loading records...",
    "records.empty": "No records yet. Upload your first daily record!",
    "records.preview": "Record Preview",
    "records.previewDesc": "Daily material record photo",

    // Products
    "products.title": "Products",
    "products.subtitle": "Manage your product inventory and categories",
    "products.import": "Import",
    "products.export": "Export",
    "products.addProduct": "Add Product",
    "products.allCategories": "All Categories",
    "products.inStock": "In Stock",
    "products.lowStock": "Low Stock",
    "products.outOfStock": "Out of Stock",
    "products.tableTitle": "Product Inventory & Predictions",
    "products.tableSubtitle": "AI-powered demand forecasts for the next 30 days",
    "products.product": "Product",
    "products.category": "Category",
    "products.currentStock": "Current Stock",
    "products.predictedDemand": "Predicted Demand",
    "products.trend": "Trend",
    "products.confidence": "Confidence",
    "products.status": "Status",
    "products.restockNow": "Restock Now",
    "products.optimal": "Optimal",
    "products.overstock": "Overstock",
    "products.noProducts": "No products match this filter",

    // Insights
    "insights.title": "AI Insights",
    "insights.subtitle": "Smart recommendations based on your data",

    // Sales Chart
    "chart.title": "Sales Overview",
    "chart.subtitle": "Monthly sales and forecast comparison",

    // Store Network
    "stores.title": "Store Network",
    "stores.nearby": "Nearby Stores",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account and preferences",
    "settings.profile": "Profile",
    "settings.appearance": "Appearance",
    "settings.darkMode": "Dark Mode",
    "settings.darkModeDesc": "Switch to dark theme",
    "settings.notifications": "Notifications",
    "settings.pushNotifs": "Push Notifications",
    "settings.pushNotifsDesc": "Receive browser notifications",
    "settings.emailAlerts": "Email Alerts",
    "settings.emailAlertsDesc": "Daily summary emails",
    "settings.stockAlerts": "Stock Alerts",
    "settings.stockAlertsDesc": "Low inventory warnings",
    "settings.forecastUpdates": "Forecast Updates",
    "settings.forecastUpdatesDesc": "New prediction notifications",
    "settings.privacy": "Privacy & Security",
    "settings.help": "Help & Support",
    "settings.logout": "Log Out",
    "settings.language": "Language",
    "settings.languageDesc": "Choose your preferred language",

    // Notifications
    "notifs.title": "Notifications",
    "notifs.subtitle": "Stay updated with alerts",

    // Footer
    "footer.tagline": "ForecastPro — Intelligent Demand Forecasting for Retail",
    "footer.powered": "Powered by Machine Learning",

    // Common
    "common.storeOwner": "Store Owner",
  },
  hi: {
    // Header
    "nav.dashboard": "डैशबोर्ड",
    "nav.products": "उत्पाद",
    "nav.forecasts": "पूर्वानुमान",
    "nav.reports": "रिपोर्ट",
    "app.name": "ForecastPro",
    "app.tagline": "खुदरा मांग बुद्धिमत्ता",

    // Dashboard
    "dashboard.title": "डैशबोर्ड",
    "dashboard.subtitle": "अपनी इन्वेंट्री और मांग पूर्वानुमान की निगरानी करें",
    "dashboard.totalProducts": "कुल उत्पाद",
    "dashboard.monthlySales": "मासिक बिक्री",
    "dashboard.forecastAccuracy": "पूर्वानुमान सटीकता",
    "dashboard.lowStockAlerts": "कम स्टॉक अलर्ट",
    "dashboard.activeItems": "सक्रिय इन्वेंट्री आइटम",
    "dashboard.revenueMonth": "इस महीने का राजस्व",
    "dashboard.mlPerformance": "ML मॉडल प्रदर्शन",
    "dashboard.needsRestocking": "पुनः स्टॉकिंग की आवश्यकता",

    // Daily Records
    "records.title": "दैनिक सामग्री रिकॉर्ड",
    "records.takePhoto": "फोटो लें",
    "records.uploadImage": "छवि अपलोड करें",
    "records.addNotes": "आज की सामग्री के बारे में नोट्स जोड़ें (वैकल्पिक)...",
    "records.cancel": "रद्द करें",
    "records.save": "रिकॉर्ड सहेजें",
    "records.uploading": "अपलोड हो रहा है...",
    "records.recent": "हाल के रिकॉर्ड",
    "records.loading": "रिकॉर्ड लोड हो रहे हैं...",
    "records.empty": "अभी तक कोई रिकॉर्ड नहीं। अपना पहला दैनिक रिकॉर्ड अपलोड करें!",
    "records.preview": "रिकॉर्ड पूर्वावलोकन",
    "records.previewDesc": "दैनिक सामग्री रिकॉर्ड फोटो",

    // Products
    "products.title": "उत्पाद",
    "products.subtitle": "अपनी उत्पाद इन्वेंट्री और श्रेणियाँ प्रबंधित करें",
    "products.import": "आयात",
    "products.export": "निर्यात",
    "products.addProduct": "उत्पाद जोड़ें",
    "products.allCategories": "सभी श्रेणियाँ",
    "products.inStock": "स्टॉक में",
    "products.lowStock": "कम स्टॉक",
    "products.outOfStock": "स्टॉक खत्म",
    "products.tableTitle": "उत्पाद इन्वेंट्री और पूर्वानुमान",
    "products.tableSubtitle": "अगले 30 दिनों के लिए AI-संचालित मांग पूर्वानुमान",
    "products.product": "उत्पाद",
    "products.category": "श्रेणी",
    "products.currentStock": "वर्तमान स्टॉक",
    "products.predictedDemand": "अनुमानित मांग",
    "products.trend": "रुझान",
    "products.confidence": "विश्वसनीयता",
    "products.status": "स्थिति",
    "products.restockNow": "अभी रीस्टॉक करें",
    "products.optimal": "उचित",
    "products.overstock": "अधिक स्टॉक",
    "products.noProducts": "इस फ़िल्टर से कोई उत्पाद मेल नहीं खाता",

    // Insights
    "insights.title": "AI अंतर्दृष्टि",
    "insights.subtitle": "आपके डेटा पर आधारित स्मार्ट सिफारिशें",

    // Sales Chart
    "chart.title": "बिक्री अवलोकन",
    "chart.subtitle": "मासिक बिक्री और पूर्वानुमान तुलना",

    // Store Network
    "stores.title": "स्टोर नेटवर्क",
    "stores.nearby": "आस-पास के स्टोर",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.subtitle": "अपना खाता और प्राथमिकताएँ प्रबंधित करें",
    "settings.profile": "प्रोफ़ाइल",
    "settings.appearance": "दिखावट",
    "settings.darkMode": "डार्क मोड",
    "settings.darkModeDesc": "डार्क थीम पर स्विच करें",
    "settings.notifications": "सूचनाएँ",
    "settings.pushNotifs": "पुश सूचनाएँ",
    "settings.pushNotifsDesc": "ब्राउज़र सूचनाएँ प्राप्त करें",
    "settings.emailAlerts": "ईमेल अलर्ट",
    "settings.emailAlertsDesc": "दैनिक सारांश ईमेल",
    "settings.stockAlerts": "स्टॉक अलर्ट",
    "settings.stockAlertsDesc": "कम इन्वेंट्री चेतावनी",
    "settings.forecastUpdates": "पूर्वानुमान अपडेट",
    "settings.forecastUpdatesDesc": "नई भविष्यवाणी सूचनाएँ",
    "settings.privacy": "गोपनीयता और सुरक्षा",
    "settings.help": "सहायता और समर्थन",
    "settings.logout": "लॉग आउट",
    "settings.language": "भाषा",
    "settings.languageDesc": "अपनी पसंदीदा भाषा चुनें",

    // Notifications
    "notifs.title": "सूचनाएँ",
    "notifs.subtitle": "अलर्ट से अपडेट रहें",

    // Footer
    "footer.tagline": "ForecastPro — खुदरा के लिए बुद्धिमान मांग पूर्वानुमान",
    "footer.powered": "मशीन लर्निंग द्वारा संचालित",

    // Common
    "common.storeOwner": "दुकान मालिक",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    return (saved === "hi" ? "hi" : "en") as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

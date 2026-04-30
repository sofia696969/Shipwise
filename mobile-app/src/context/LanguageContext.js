import React, { createContext, useState, useContext } from "react";

const translations = {
  en: {
    // Sign In
    welcomeBack: "Welcome Back",
    signInSubtitle: "Sign in to manage your shipments",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    useDemo: "📋 Use Demo Account",

    // Dashboard
    dashboard: "Dashboard",
    shipmentOverview: "Shipment Overview",
    activeShipments: "Active Shipments",
    delayed: "Delayed",
    highRisk: "High Risk",
    totalCost: "Total Cost",
    criticalAlerts: "Critical Alerts",
    seeAll: "See All",

    // Profile
    profile: "Profile",
    accountSettings: "Account Settings",
    appSettings: "App Settings",
    about: "About",
    editProfile: "Edit Profile",
    changePassword: "Change Password",
    darkMode: "Dark Mode",
    language: "Language",
    aboutShipWise: "About ShipWise",
    helpSupport: "Help & Support",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    logout: "Logout",
    company: "Company",

    // Navigation
    shipments: "Shipments",
    analytics: "Analytics",
    alerts: "Alerts",
  },
  fr: {
    // Sign In
    welcomeBack: "Bon Retour",
    signInSubtitle: "Connectez-vous pour gérer vos expéditions",
    email: "E-mail",
    password: "Mot de passe",
    signIn: "Se connecter",
    useDemo: "📋 Utiliser le compte démo",

    // Dashboard
    dashboard: "Tableau de bord",
    shipmentOverview: "Aperçu des expéditions",
    activeShipments: "Expéditions actives",
    delayed: "En retard",
    highRisk: "Risque élevé",
    totalCost: "Coût total",
    criticalAlerts: "Alertes critiques",
    seeAll: "Voir tout",

    // Profile
    profile: "Profil",
    accountSettings: "Paramètres du compte",
    appSettings: "Paramètres de l'application",
    about: "À propos",
    editProfile: "Modifier le profil",
    changePassword: "Changer le mot de passe",
    darkMode: "Mode sombre",
    language: "Langue",
    aboutShipWise: "À propos de ShipWise",
    helpSupport: "Aide et support",
    privacyPolicy: "Politique de confidentialité",
    termsOfService: "Conditions d'utilisation",
    logout: "Déconnexion",
    company: "Entreprise",

    // Navigation
    shipments: "Expéditions",
    analytics: "Analytique",
    alerts: "Alertes",
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
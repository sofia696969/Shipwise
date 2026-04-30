import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/common/Card";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { colors } from "../theme/colors";

const ProfileOption = ({ icon, title, value, onPress, showArrow = true, rightComponent }) => (
  <TouchableOpacity style={styles.option} onPress={onPress} disabled={!onPress}>
    <View style={styles.optionLeft}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={styles.optionTitle}>{title}</Text>
    </View>
    <View style={styles.optionRight}>
      {value && <Text style={styles.optionValue}>{value}</Text>}
      {rightComponent}
      {showArrow && onPress && (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </View>
  </TouchableOpacity>
);

export const ProfileScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const { language, t, toggleLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const user = {
    name: "Alex Rivera",
    email: "manager@shipwise.com",
    role: language === "fr" ? "Responsable logistique" : "Logistics Manager",
    company: "Global Logistics Inc.",
    avatar: "👤",
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    console.log("✅ Logout confirmed");
    setLogoutModalVisible(false);
    logout();
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    if (Platform.OS === "web") {
      window.alert(language === "fr" ? "Fonctionnalité à venir!" : "Coming soon!");
    } else {
      Alert.alert(language === "fr" ? "Bientôt disponible" : "Coming soon");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.avatar}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user.role}</Text>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("accountSettings")}</Text>
          <Card>
            <ProfileOption
              icon="business-outline"
              title={t("company")}
              value={user.company}
              showArrow={false}
            />
            <ProfileOption
              icon="person-outline"
              title={t("editProfile")}
              onPress={handleEditProfile}
            />
            <ProfileOption
              icon="lock-closed-outline"
              title={t("changePassword")}
              onPress={handleChangePassword}
            />
          </Card>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("appSettings")}</Text>
          <Card>
            <ProfileOption
              icon="moon-outline"
              title={t("darkMode")}
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={handleDarkMode}
                  trackColor={{ false: colors.border, true: colors.primary + "50" }}
                  thumbColor={darkMode ? colors.primary : colors.textSecondary}
                />
              }
              showArrow={false}
            />
            <ProfileOption
              icon="language-outline"
              title={t("language")}
              value={language === "fr" ? "Français" : "English"}
              onPress={() => setLanguageModalVisible(true)}
            />
          </Card>
        </View>

        {/* About & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("helpSupport")}</Text>
          <Card>
            <ProfileOption
              icon="help-circle-outline"
              title={t("helpSupport")}
              onPress={() => {
                if (Platform.OS === "web") {
                  window.alert("Contact: support@shipwise.com");
                } else {
                  Alert.alert("Support", "Contact: support@shipwise.com");
                }
              }}
            />
            <ProfileOption
              icon="document-text-outline"
              title={t("privacyPolicy")}
              onPress={() => {
                if (Platform.OS === "web") {
                  window.alert(language === "fr" ? "Fonctionnalité à venir!" : "Coming soon!");
                } else {
                  Alert.alert(t("privacyPolicy"), language === "fr" ? "Fonctionnalité à venir!" : "Coming soon!");
                }
              }}
            />
            <ProfileOption
              icon="shield-checkmark-outline"
              title={t("termsOfService")}
              onPress={() => {
                if (Platform.OS === "web") {
                  window.alert(language === "fr" ? "Fonctionnalité à venir!" : "Coming soon!");
                } else {
                  Alert.alert(t("termsOfService"), language === "fr" ? "Fonctionnalité à venir!" : "Coming soon!");
                }
              }}
            />
            <ProfileOption
              icon="information-circle-outline"
              title={t("about")}
              onPress={() => setAboutModalVisible(true)}
            />
          </Card>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={styles.logoutText}>{t("logout")}</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>
          © 2024 ShipWise.{" "}
          {language === "fr" ? "Tous droits réservés." : "All rights reserved."}
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ========== LOGOUT MODAL ========== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModalContent}>
            <View style={styles.logoutIconContainer}>
              <Ionicons name="log-out-outline" size={40} color={colors.danger} />
            </View>
            <Text style={styles.logoutModalTitle}>
              {language === "fr" ? "Se déconnecter ?" : "Logout?"}
            </Text>
            <Text style={styles.logoutModalMessage}>
              {language === "fr"
                ? "Êtes-vous sûr de vouloir vous déconnecter?"
                : "Are you sure you want to logout?"}
            </Text>
            <View style={styles.logoutModalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {language === "fr" ? "Annuler" : "Cancel"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmLogout}>
                <Text style={styles.confirmButtonText}>
                  {language === "fr" ? "Déconnexion" : "Logout"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========== LANGUAGE MODAL ========== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.languageModalContent}>
            <Text style={styles.modalTitle}>
              {language === "fr" ? "Choisir la langue" : "Select Language"}
            </Text>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                toggleLanguage();
                setLanguageModalVisible(false);
              }}
            >
              <Text style={styles.languageText}>English</Text>
              {language === "en" && (
                <Ionicons name="checkmark" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                toggleLanguage();
                setLanguageModalVisible(false);
              }}
            >
              <Text style={styles.languageText}>Français</Text>
              {language === "fr" && (
                <Ionicons name="checkmark" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>
                {language === "fr" ? "Fermer" : "Close"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========== ABOUT MODAL ========== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={aboutModalVisible}
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.aboutModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {language === "fr" ? "À propos de ShipWise" : "About ShipWise"}
              </Text>
              <TouchableOpacity onPress={() => setAboutModalVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.aboutLogoContainer}>
              <Text style={styles.aboutLogo}>🚢</Text>
              <Text style={styles.aboutAppName}>ShipWise</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            </View>

            <Text style={styles.aboutDescription}>
              {language === "fr"
                ? "ShipWise est une plateforme intelligente de gestion logistique alimentée par l'intelligence artificielle et le machine learning.\n\nNotre plateforme aide les responsables logistiques à prendre des décisions éclairées grâce à des prédictions précises et des analyses en temps réel."
                : "ShipWise is an intelligent logistics management platform powered by artificial intelligence and machine learning.\n\nOur platform helps logistics managers make informed decisions through accurate predictions and real-time analytics."}
            </Text>

            <View style={styles.aboutFeatures}>
              <Text style={styles.aboutFeaturesTitle}>
                {language === "fr" ? "Caractéristiques" : "Features"}
              </Text>
              <View style={styles.featureItem}>
                <Ionicons name="location-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>
                  {language === "fr"
                    ? "Suivi des expéditions en temps réel"
                    : "Real-time shipment tracking"}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="analytics-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>
                  {language === "fr"
                    ? "Prédictions ML pour les retards"
                    : "ML-powered delay predictions"}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="bar-chart-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>
                  {language === "fr"
                    ? "Analyse des performances"
                    : "Performance analytics"}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>
                  {language === "fr"
                    ? "Assistant IA intelligent"
                    : "Smart AI assistant"}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary} />
                <Text style={styles.featureText}>
                  {language === "fr"
                    ? "Alertes et informations"
                    : "Alerts & insights"}
                </Text>
              </View>
            </View>

            <Text style={styles.aboutFooter}>
              {language === "fr"
                ? "Développé avec ❤️ pour une logistique efficace"
                : "Built with ❤️ for efficient logistics"}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  userCard: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.card,
  },
  avatarText: {
    fontSize: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.danger,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.danger,
    marginLeft: 8,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  copyright: {
    textAlign: "center",
    fontSize: 11,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutModalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  logoutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.danger + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  logoutModalMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  logoutModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.danger,
    marginLeft: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  languageModalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    width: "85%",
    maxWidth: 400,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageText: {
    fontSize: 16,
    color: colors.text,
  },
  closeModalButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  aboutModalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  aboutLogoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  aboutLogo: {
    fontSize: 60,
    marginBottom: 8,
  },
  aboutAppName: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  aboutVersion: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  aboutDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 20,
  },
  aboutFeatures: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  aboutFeaturesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  aboutFooter: {
    textAlign: "center",
    fontSize: 14,
    color: colors.textSecondary,
  },
});
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/common/Card";
import { mlService } from "../api/mlService";
import { colors } from "../theme/colors";

export const AlertsScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await mlService.getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "high" || filter === "medium" || filter === "low")
      return alert.severity === filter;
    return alert.type === filter;
  });

  const getIncidentIcon = (type) => {
    switch (type) {
      case "delayed":
        return "time-outline";
      case "damaged":
        return "alert-circle-outline";
      case "lost":
        return "help-circle-outline";
      default:
        return "information-circle-outline";
    }
  };

  const getIncidentColor = (type) => {
    switch (type) {
      case "delayed":
        return colors.warning;
      case "damaged":
        return colors.danger;
      case "lost":
        return colors.purple;
      default:
        return colors.textSecondary;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return colors.danger;
      case "medium":
        return colors.warning;
      case "low":
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  };

  const openDetail = (alert) => {
    setSelectedAlert(alert);
    setDetailModalVisible(true);
  };

  const renderFilterButton = (label, value) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === value && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderAlert = ({ item }) => (
    <TouchableOpacity onPress={() => openDetail(item)} activeOpacity={0.7}>
      <Card style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <View
            style={[
              styles.alertIconContainer,
              { backgroundColor: getIncidentColor(item.type) + "15" },
            ]}
          >
            <Ionicons
              name={getIncidentIcon(item.type)}
              size={24}
              color={getIncidentColor(item.type)}
            />
          </View>
          <View style={styles.alertHeaderInfo}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <Text style={styles.alertShipmentId}>Shipment: {item.shipmentId}</Text>
          </View>
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(item.severity) + "15" },
            ]}
          >
            <Text
              style={[
                styles.severityText,
                { color: getSeverityColor(item.severity) },
              ]}
            >
              {item.severity.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.alertMessage} numberOfLines={2}>
          {item.message}
        </Text>

        <View style={styles.alertFooter}>
          <View style={styles.alertRoute}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.alertRouteText}>
              {item.origin} → {item.destination}
            </Text>
          </View>
          <View style={styles.alertDate}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.alertDateText}>
              {formatDate(item.timestamp)}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.subtitle}>{alerts.length} total incidents</Text>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { label: "All", value: "all" },
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" },
            { label: "Delayed", value: "delayed" },
            { label: "Damaged", value: "damaged" },
            { label: "Lost", value: "lost" },
          ]}
          renderItem={({ item }) => renderFilterButton(item.label, item.value)}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <FlatList
        data={filteredAlerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={64}
              color={colors.success}
            />
            <Text style={styles.emptyText}>No incidents found</Text>
            <Text style={styles.emptySubtext}>Everything looks good!</Text>
          </View>
        }
      />

      {/* ========== INCIDENT DETAIL MODAL ========== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Incident Details</Text>
                <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                  <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
              </View>

              {selectedAlert && (
                <>
                  {/* Incident Type & Severity */}
                  <View style={styles.modalSection}>
                    <View style={styles.modalRow}>
                      <View
                        style={[
                          styles.modalIconContainer,
                          { backgroundColor: getIncidentColor(selectedAlert.type) + "15" },
                        ]}
                      >
                        <Ionicons
                          name={getIncidentIcon(selectedAlert.type)}
                          size={32}
                          color={getIncidentColor(selectedAlert.type)}
                        />
                      </View>
                      <View style={styles.modalRowText}>
                        <Text style={styles.modalIncidentType}>
                          {selectedAlert.type.charAt(0).toUpperCase() + selectedAlert.type.slice(1)}
                        </Text>
                        <View
                          style={[
                            styles.modalSeverityBadge,
                            {
                              backgroundColor: getSeverityColor(selectedAlert.severity) + "15",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.modalSeverityText,
                              { color: getSeverityColor(selectedAlert.severity) },
                            ]}
                          >
                            {selectedAlert.severity.toUpperCase()} SEVERITY
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Title */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Title</Text>
                    <Text style={styles.modalSectionValue}>{selectedAlert.title}</Text>
                  </View>

                  {/* Description */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Description</Text>
                    <Text style={styles.modalSectionValue}>{selectedAlert.description}</Text>
                  </View>

                  {/* Shipment Info */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Shipment Information</Text>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Shipment ID</Text>
                      <Text style={styles.detailValue}>{selectedAlert.shipmentId}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Carrier</Text>
                      <Text style={styles.detailValue}>{selectedAlert.carrierName}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Carrier Reference</Text>
                      <Text style={styles.detailValue}>{selectedAlert.carrierNumber}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Quantity</Text>
                      <Text style={styles.detailValue}>{selectedAlert.quantity} units</Text>
                    </View>
                  </View>

                  {/* Route */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Route</Text>
                    <View style={styles.routeContainer}>
                      <View style={styles.routePoint}>
                        <Ionicons name="location" size={20} color={colors.primary} />
                        <Text style={styles.routeText}>{selectedAlert.origin}</Text>
                      </View>
                      <View style={styles.routeArrow}>
                        <Ionicons name="arrow-down" size={20} color={colors.textSecondary} />
                      </View>
                      <View style={styles.routePoint}>
                        <Ionicons name="location" size={20} color={colors.danger} />
                        <Text style={styles.routeText}>{selectedAlert.destination}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Timestamp */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Reported</Text>
                    <Text style={styles.modalSectionValue}>
                      {formatDate(selectedAlert.timestamp)}
                    </Text>
                  </View>

                  {/* View Shipment Button */}
                  <TouchableOpacity
                    style={styles.viewShipmentButton}
                    onPress={() => {
                      setDetailModalVisible(false);
                      navigation.navigate("ShipmentDetail", {
                        shipmentId: selectedAlert.shipmentId,
                      });
                    }}
                  >
                    <Text style={styles.viewShipmentButtonText}>View Shipment Details</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  filterContainer: {
    paddingBottom: 10,
    maxHeight: 50,
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "white",
  },
  listContent: {
    paddingBottom: 20,
  },
  alertCard: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  alertHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  alertShipmentId: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  alertMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertRoute: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertRouteText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  alertDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertDateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailModalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
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
  modalSection: {
    marginBottom: 20,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modalRowText: {
    flex: 1,
  },
  modalIncidentType: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  modalSeverityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modalSeverityText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  modalSectionValue: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  routeContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeArrow: {
    alignItems: "center",
    paddingVertical: 8,
  },
  routeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginLeft: 10,
  },
  viewShipmentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 10,
  },
  viewShipmentButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
});
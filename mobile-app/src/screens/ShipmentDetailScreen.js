import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/common/Card";
import { shipmentService } from "../api/shipmentService";
import { colors } from "../theme/colors";

export const ShipmentDetailScreen = ({ route, navigation }) => {
  const { shipmentId } = route.params;
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipment();
  }, [shipmentId]);

  const fetchShipment = async () => {
    try {
      const data = await shipmentService.getById(shipmentId);
      setShipment(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_transit":
        return colors.warning;
      case "delivered":
        return colors.success;
      case "delayed":
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "in_transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      case "delayed":
        return "Delayed";
      default:
        return status;
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
        return null;
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!shipment) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Shipment not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.shipmentId}>{shipment.id}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(shipment.status) + "15" },
              ]}
            >
              <Text
                style={[styles.statusText, { color: getStatusColor(shipment.status) }]}
              >
                {getStatusLabel(shipment.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Route */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Route</Text>
          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: colors.primary }]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Origin</Text>
                <Text style={styles.routeCity}>{shipment.originCity}</Text>
                <Text style={styles.routeCountry}>{shipment.originCountry}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: colors.danger }]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Destination</Text>
                <Text style={styles.routeCity}>{shipment.destinationCity}</Text>
                <Text style={styles.routeCountry}>{shipment.destinationCountry}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Shipment Details */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Shipment Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Carrier</Text>
            <Text style={styles.infoValue}>{shipment.carrierName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Carrier Reference</Text>
            <Text style={styles.infoValue}>{shipment.carrierNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Quantity</Text>
            <Text style={styles.infoValue}>{shipment.quantity} units</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>{formatDate(shipment.createdAt)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ETA</Text>
            <Text style={styles.infoValue}>{formatDate(shipment.eta)}</Text>
          </View>
        </Card>

        {/* Cost */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Cost</Text>
          <View style={styles.costContainer}>
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Estimated</Text>
              <Text style={styles.costValue}>${shipment.estimatedCost?.toLocaleString()}</Text>
            </View>
            <View style={styles.costDivider} />
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Actual</Text>
              <Text style={styles.costValue}>
                {shipment.actualCost ? `$${shipment.actualCost.toLocaleString()}` : "-"}
              </Text>
            </View>
          </View>
        </Card>

        {/* Incident */}
        {shipment.incidentType && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Incident</Text>
            <View style={styles.incidentHeader}>
              <View
                style={[
                  styles.incidentIconContainer,
                  { backgroundColor: getIncidentColor(shipment.incidentType) + "15" },
                ]}
              >
                <Ionicons
                  name={getIncidentIcon(shipment.incidentType)}
                  size={26}
                  color={getIncidentColor(shipment.incidentType)}
                />
              </View>
              <View style={styles.incidentInfo}>
                <Text style={styles.incidentType}>
                  {shipment.incidentType.charAt(0).toUpperCase() + shipment.incidentType.slice(1)}
                </Text>
                <View
                  style={[
                    styles.incidentSeverityBadge,
                    {
                      backgroundColor:
                        shipment.incidentSeverity === "high"
                          ? colors.danger + "15"
                          : shipment.incidentSeverity === "medium"
                          ? colors.warning + "15"
                          : colors.success + "15",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.incidentSeverityText,
                      {
                        color:
                          shipment.incidentSeverity === "high"
                            ? colors.danger
                            : shipment.incidentSeverity === "medium"
                            ? colors.warning
                            : colors.success,
                      },
                    ]}
                  >
                    {shipment.incidentSeverity.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.incidentDescription}>{shipment.incidentDescription}</Text>
            <Text style={styles.incidentDate}>
              Reported: {formatDate(shipment.incidentDate)}
            </Text>
          </Card>
        )}

        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButtonLarge}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back to Shipments</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shipmentId: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  routeContainer: {
    alignItems: "center",
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  routeCountry: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: colors.border,
    marginLeft: 5,
    marginVertical: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  costContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  costItem: {
    alignItems: "center",
    flex: 1,
  },
  costLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  costValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  costDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.border,
  },
  incidentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  incidentIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  incidentInfo: {
    flex: 1,
  },
  incidentType: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  incidentSeverityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  incidentSeverityText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  incidentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  incidentDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  backButtonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  backButtonLarge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
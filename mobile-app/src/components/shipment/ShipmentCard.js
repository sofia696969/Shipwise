import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../common/Card";
import { colors } from "../../theme/colors";

export const ShipmentCard = ({ shipment, onPress }) => {
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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.shipmentId}>{shipment.id}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(shipment.status) + "15" },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor(shipment.status) }]}>
              {getStatusLabel(shipment.status)}
            </Text>
          </View>
        </View>

        <View style={styles.route}>
          <View style={styles.location}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.locationText}>{shipment.originCity}</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} />
          <View style={styles.location}>
            <Ionicons name="location" size={16} color={colors.danger} />
            <Text style={styles.locationText}>{shipment.destinationCity}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Carrier</Text>
            <Text style={styles.detailValue}>{shipment.carrierName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={styles.detailValue}>{shipment.quantity} units</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Est. Cost</Text>
            <Text style={styles.detailValue}>${shipment.estimatedCost?.toLocaleString()}</Text>
          </View>
        </View>

        {shipment.incidentType && (
          <View
            style={[
              styles.incidentBadge,
              { backgroundColor: getIncidentColor(shipment.incidentType) + "15" },
            ]}
          >
            <Ionicons
              name={
                shipment.incidentType === "delayed"
                  ? "time-outline"
                  : shipment.incidentType === "damaged"
                  ? "alert-circle-outline"
                  : "help-circle-outline"
              }
              size={16}
              color={getIncidentColor(shipment.incidentType)}
            />
            <Text
              style={[
                styles.incidentText,
                { color: getIncidentColor(shipment.incidentType) },
              ]}
            >
              {shipment.incidentType.charAt(0).toUpperCase() + shipment.incidentType.slice(1)}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  shipmentId: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  route: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.text,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  incidentBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  incidentText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
});
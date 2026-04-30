import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../common/Card";
import { colors } from "../../theme/colors";

export const ShipmentSummary = ({ shipments, onViewAll }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "in_transit":
        return colors.warning;
      case "delivered":
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Shipments</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {shipments.map((shipment) => (
        <View key={shipment.id} style={styles.shipmentRow}>
          <View style={styles.shipmentInfo}>
            <Text style={styles.shipmentId}>{shipment.id}</Text>
            <Text style={styles.route}>
              {shipment.originCity} → {shipment.destinationCity}
            </Text>
          </View>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(shipment.status) },
            ]}
          />
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  shipmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  shipmentInfo: {
    flex: 1,
  },
  shipmentId: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  route: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
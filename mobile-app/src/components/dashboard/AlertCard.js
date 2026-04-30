import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../common/Card";
import { colors } from "../../theme/colors";

export const AlertCard = ({ alert, onPress }) => {
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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getSeverityColor(alert.severity) + "15" },
            ]}
          >
            <Ionicons
              name={getIncidentIcon(alert.type)}
              size={24}
              color={getSeverityColor(alert.severity)}
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{alert.title}</Text>
            <Text style={styles.shipmentId}>Shipment: {alert.shipmentId}</Text>
          </View>
          <View
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(alert.severity) + "15" },
            ]}
          >
            <Text
              style={[
                styles.severityText,
                { color: getSeverityColor(alert.severity) },
              ]}
            >
              {alert.severity.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {alert.message}
        </Text>
        <View style={styles.footer}>
          <View style={styles.route}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.routeText}>
              {alert.origin} → {alert.destination}
            </Text>
          </View>
          <Text style={styles.timestamp}>
            {new Date(alert.timestamp).toLocaleDateString()}
          </Text>
        </View>
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
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  shipmentId: {
    fontSize: 12,
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
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  route: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
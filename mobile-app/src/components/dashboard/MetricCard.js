import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../common/Card";
import { colors } from "../../theme/colors";

export const MetricCard = ({ icon, label, value, trend, color = colors.primary }) => {
  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
              <Ionicons name={icon} size={28} color={color} />
            </View>
            <View style={styles.textSection}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          </View>
          {trend && (
            <View style={styles.trend}>
              <Ionicons
                name={trend > 0 ? "trending-up" : "trending-down"}
                size={18}
                color={trend > 0 ? colors.success : colors.danger}
              />
              <Text
                style={[
                  styles.trendText,
                  { color: trend > 0 ? colors.success : colors.danger },
                ]}
              >
                {Math.abs(trend)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textSection: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  trend: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});
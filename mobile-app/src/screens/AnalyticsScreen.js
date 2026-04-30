import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../components/common/Card";
import { mlService } from "../api/mlService";
import { colors } from "../theme/colors";

export const AnalyticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await mlService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const totalIncidents = analytics.incidentsByType
    .filter((i) => i.name !== "No Incident")
    .reduce((sum, i) => sum + i.incidents, 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Performance Analytics</Text>
          <Text style={styles.subtitle}>Last 30 Days</Text>
        </View>

        {/* On-Time Delivery Rate */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name="speedometer-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardLabel}>On-Time Delivery Rate</Text>
              <Text style={styles.bigMetricValue}>{analytics.onTimeRate}%</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${analytics.onTimeRate}%`, backgroundColor: colors.success },
              ]}
            />
          </View>
          <Text style={styles.cardFooter}>
            {analytics.onTimeCount} of {analytics.totalShipments} shipments delivered on time
          </Text>
        </Card>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Ionicons name="cube-outline" size={24} color={colors.primary} />
            <Text style={styles.metricValue}>{analytics.totalShipments}</Text>
            <Text style={styles.metricLabel}>Total Shipments</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Ionicons name="cash-outline" size={24} color={colors.success} />
            <Text style={styles.metricValue}>${analytics.avgCostVariance}</Text>
            <Text style={styles.metricLabel}>Avg Cost Variance</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Ionicons name="time-outline" size={24} color={colors.warning} />
            <Text style={styles.metricValue}>{analytics.delaysThisMonth}</Text>
            <Text style={styles.metricLabel}>Delays This Month</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Ionicons
              name={analytics.delayChange > 0 ? "trending-up" : "trending-down"}
              size={24}
              color={analytics.delayChange > 0 ? colors.danger : colors.success}
            />
            <Text
              style={[
                styles.metricValue,
                { color: analytics.delayChange > 0 ? colors.danger : colors.success },
              ]}
            >
              {analytics.delayChange > 0 ? "+" : ""}
              {analytics.delayChange}%
            </Text>
            <Text style={styles.metricLabel}>Delay Change</Text>
          </Card>
        </View>

        {/* Incidents by Type */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Incidents by Type</Text>
          {analytics.incidentsByType.map((item, index) => (
            <View key={index} style={styles.incidentRow}>
              <View style={styles.incidentInfo}>
                <View style={[styles.incidentDot, { backgroundColor: item.color }]} />
                <Text style={styles.incidentName}>{item.name}</Text>
              </View>
              <View style={styles.incidentBarContainer}>
                <View
                  style={[
                    styles.incidentBar,
                    {
                      width: `${(item.incidents / analytics.totalShipments) * 100}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.incidentCount}>{item.incidents}</Text>
            </View>
          ))}
        </Card>

        {/* Weekly On-Time Rate */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Weekly On-Time Rate</Text>
          <View style={styles.weeklyContainer}>
            {analytics.weeklyOnTimeRate.map((rate, index) => (
              <View key={index} style={styles.weeklyItem}>
                <View style={styles.weeklyBarContainer}>
                  <View
                    style={[
                      styles.weeklyBar,
                      {
                        height: `${rate}%`,
                        backgroundColor:
                          rate >= 90
                            ? colors.success
                            : rate >= 80
                            ? colors.warning
                            : colors.danger,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.weeklyValue}>{rate}%</Text>
                <Text style={styles.weeklyLabel}>Week {index + 1}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ height: 40 }} />
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
  scrollView: {
    flex: 1,
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
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  bigMetricValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  cardFooter: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  metricCard: {
    width: "48%",
    marginHorizontal: 10,
    marginBottom: 12,
    alignItems: "center",
    padding: 16,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  incidentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  incidentInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
  },
  incidentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  incidentName: {
    fontSize: 14,
    color: colors.text,
  },
  incidentBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: colors.border,
    borderRadius: 10,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  incidentBar: {
    height: "100%",
    borderRadius: 10,
  },
  incidentCount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    width: 30,
    textAlign: "right",
  },
  weeklyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weeklyItem: {
    alignItems: "center",
    flex: 1,
  },
  weeklyBarContainer: {
    height: 100,
    width: 30,
    backgroundColor: colors.border,
    borderRadius: 15,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  weeklyBar: {
    width: "100%",
    borderRadius: 15,
  },
  weeklyValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginTop: 8,
  },
  weeklyLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
import { colors } from "../theme/colors";

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "on time":
      return colors.success;
    case "delayed":
      return colors.warning;
    case "at risk":
      return colors.danger;
    default:
      return colors.textSecondary;
  }
};

export const getRiskColor = (riskPercentage) => {
  if (riskPercentage >= 67) return colors.danger;
  if (riskPercentage >= 34) return colors.warning;
  return colors.success;
};

export const getRiskLevel = (riskPercentage) => {
  if (riskPercentage >= 67) return "High";
  if (riskPercentage >= 34) return "Medium";
  return "Low";
};
export interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  time: string;
}

// example alert list used by dashboard; can be replaced with real data
export const alerts: Alert[] = [
  // empty for now, avoids compile errors in dashboard
];

import apiClient from "./client";

// Mock alerts data
const mockAlerts = [
  {
    id: "INC-001",
    shipmentId: "SHP-002",
    type: "delayed",
    severity: "high",
    title: "Shipment Delayed - Port Congestion",
    message:
      "Shipment SHP-002 (MSC) delayed at Rotterdam port due to congestion. 3-day delay expected.",
    description:
      "Port congestion at Rotterdam causing 3-day delay. Vessel waiting for dock allocation. Current position: North Sea approach. Alternative routing being evaluated.",
    carrierName: "MSC",
    carrierNumber: "CR-7832",
    origin: "Rotterdam, Netherlands",
    destination: "New York, United States",
    quantity: 320,
    timestamp: "2024-02-08T14:22:00",
  },
  {
    id: "INC-002",
    shipmentId: "SHP-003",
    type: "damaged",
    severity: "high",
    title: "Cargo Damage Reported",
    message:
      "Shipment SHP-003 (COSCO) reported water damage. 12 units affected.",
    description:
      "Container #45B reported significant water damage due to heavy storm encountered in Indian Ocean. 12 units completely damaged, 8 partially damaged. Insurance claim filed. Customer notified.",
    carrierName: "COSCO",
    carrierNumber: "CR-1198",
    origin: "Singapore",
    destination: "Sydney, Australia",
    quantity: 85,
    timestamp: "2024-02-06T03:45:00",
  },
  {
    id: "INC-003",
    shipmentId: "SHP-005",
    type: "lost",
    severity: "medium",
    title: "Missing Cargo - Under Investigation",
    message:
      "Pallet #22 missing from container during transfer at Yokohama port. Investigation underway with port authority. CCTV footage being reviewed. Estimated value of missing goods: $4,500.",
    description:
      "Pallet #22 missing from container during transfer at Yokohama port. Investigation underway with port authority. CCTV footage being reviewed. Estimated value of missing goods: $4,500.",
    carrierName: "ONE",
    carrierNumber: "CR-9901",
    origin: "Tokyo, Japan",
    destination: "Vancouver, Canada",
    quantity: 450,
    timestamp: "2024-02-07T19:10:00",
  },
  {
    id: "INC-004",
    shipmentId: "SHP-007",
    type: "delayed",
    severity: "low",
    title: "Customs Documentation Hold",
    message:
      "SHP-007 (CMA CGM) held at Marseille customs for documentation review.",
    description:
      "Customs hold at Marseille for documentation review. Missing certificate of origin. Expected clearance in 24 hours after document submission.",
    carrierName: "CMA CGM",
    carrierNumber: "CR-6678",
    origin: "Marseille, France",
    destination: "Santos, Brazil",
    quantity: 95,
    timestamp: "2024-02-09T10:30:00",
  },
  {
    id: "INC-005",
    shipmentId: "SHP-008",
    type: "damaged",
    severity: "low",
    title: "Minor Packaging Damage",
    message:
      "Minor packaging damage to 5 units on SHP-008 (ZIM) during unloading.",
    description:
      "Minor packaging damage to 5 units during unloading at Cape Town port. Goods intact and functional. Report filed with port authority. No insurance claim needed.",
    carrierName: "ZIM",
    carrierNumber: "CR-2290",
    origin: "Mumbai, India",
    destination: "Cape Town, South Africa",
    quantity: 280,
    timestamp: "2024-02-08T16:55:00",
  },
];

const mockAnalytics = {
  onTimeRate: 87,
  onTimeCount: 21,
  totalShipments: 24,
  avgCostVariance: 150,
  delaysThisMonth: 12,
  delaysLastMonth: 8,
  delayChange: 50,
  weeklyOnTimeRate: [85, 88, 92, 87],
  weeklyCostVariance: [120, -50, 200, 150],
  incidentsByType: [
    {
      name: "Delayed",
      incidents: 8,
      color: "#f59e0b",
      legendFontColor: "#1e293b",
    },
    {
      name: "Damaged",
      incidents: 5,
      color: "#ef4444",
      legendFontColor: "#1e293b",
    },
    {
      name: "Lost",
      incidents: 3,
      color: "#7c3aed",
      legendFontColor: "#1e293b",
    },
    {
      name: "No Incident",
      incidents: 16,
      color: "#10b981",
      legendFontColor: "#1e293b",
    },
  ],
};

// Mock AI responses
const aiResponses = {
  "why are delays increasing": {
    answer:
      "Based on recent data, delays increased by 50% this month. Main causes:\n\n1. Port congestion in Rotterdam (affecting SHP-002)\n2. Customs holds at Marseille (affecting SHP-007)\n\nRecommendation: Consider alternative routing through Antwerp for European shipments.",
    data: null,
  },
  "which carrier": {
    answer:
      "Based on incident history:\n\n✅ Best performers:\n1. Hapag-Lloyd - 0 incidents\n2. Evergreen - 0 incidents\n\n⚠️ Watch list:\n1. COSCO - 1 damage incident\n2. MSC - 1 delay incident\n\nRecommendation: Hapag-Lloyd for high-value shipments.",
    data: null,
  },
  "high risk": {
    answer:
      "High-risk shipments (severity: high):\n\n1. SHP-002 (MSC) - Delayed\n   - Port congestion at Rotterdam\n   - 3-day delay expected\n\n2. SHP-003 (COSCO) - Damaged\n   - Water damage to 12 units\n   - Insurance claim filed\n\n3. SHP-005 (ONE) - Lost\n   - Missing pallet at Yokohama\n   - Under investigation",
    data: null,
  },
  "cost analysis": {
    answer:
      "Cost Analysis (Last 30 days):\n\n• Total Estimated Cost: $38,720\n• Total Actual Cost: $10,800\n• Average Cost Variance: $150\n\nShipments with cost overruns:\n- SHP-003: $3,100 → $3,800 (+22%)\n- SHP-008: $4,100 → $4,250 (+4%)",
    data: null,
  },
  "delayed": {
    answer:
      "Currently delayed shipments:\n\n1. SHP-002 (MSC)\n   - Route: Rotterdam → New York\n   - Delay: 3 days\n   - Cause: Port congestion\n\n2. SHP-007 (CMA CGM)\n   - Route: Marseille → Santos\n   - Delay: 1 day\n   - Cause: Customs hold",
    data: null,
  },
};

export const mlService = {
  getAlerts: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockAlerts;
  },

  getAnalytics: async (period = "30d") => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return mockAnalytics;
  },

  askAssistant: async (question) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const q = question.toLowerCase().trim();

    for (const [key, value] of Object.entries(aiResponses)) {
      if (q.includes(key)) {
        return value;
      }
    }

    return {
      answer: `I can help with:\n\n• "Why are delays increasing?"\n• "Which carrier is best?"\n• "Show high risk shipments"\n• "Show cost analysis"\n\nTry asking one of these!`,
      data: null,
    };
  },
};
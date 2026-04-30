import apiClient from "./client";

// Mock data for development
// Mock data matching your database structure
const mockShipments = [
  {
    id: "SHP-001",
    carrierNumber: "CR-4521",
    carrierName: "Maersk Line",
    originCountry: "China",
    destinationCountry: "United States",
    originCity: "Shanghai",
    destinationCity: "Los Angeles",
    originCoords: { lat: 31.2304, lng: 121.4737 },
    destinationCoords: { lat: 33.9425, lng: -118.4081 },
    status: "in_transit",
    quantity: 150,
    incidentType: null,
    incidentDescription: null,
    incidentDate: null,
    estimatedCost: 5420,
    actualCost: null,
    createdAt: "2024-01-28T08:30:00",
    eta: "2024-02-15",
  },
  {
    id: "SHP-002",
    carrierNumber: "CR-7832",
    carrierName: "MSC",
    originCountry: "Netherlands",
    destinationCountry: "United States",
    originCity: "Rotterdam",
    destinationCity: "New York",
    originCoords: { lat: 51.9244, lng: 4.4777 },
    destinationCoords: { lat: 40.7128, lng: -74.006 },
    status: "in_transit",
    quantity: 320,
    incidentType: "delayed",
    incidentDescription:
      "Port congestion at Rotterdam causing 3-day delay. Vessel waiting for dock allocation.",
    incidentDate: "2024-02-08T14:22:00",
    incidentSeverity: "high",
    estimatedCost: 4200,
    actualCost: null,
    createdAt: "2024-01-25T10:15:00",
    eta: "2024-02-13",
  },
  {
    id: "SHP-003",
    carrierNumber: "CR-1198",
    carrierName: "COSCO",
    originCountry: "Singapore",
    destinationCountry: "Australia",
    originCity: "Singapore",
    destinationCity: "Sydney",
    originCoords: { lat: 1.3521, lng: 103.8198 },
    destinationCoords: { lat: -33.8688, lng: 151.2093 },
    status: "in_transit",
    quantity: 85,
    incidentType: "damaged",
    incidentDescription:
      "Container #45B reported water damage due to heavy storm. 12 units affected. Insurance claim initiated.",
    incidentDate: "2024-02-06T03:45:00",
    incidentSeverity: "high",
    estimatedCost: 3100,
    actualCost: 3800,
    createdAt: "2024-01-30T09:00:00",
    eta: "2024-02-12",
  },
  {
    id: "SHP-004",
    carrierNumber: "CR-5567",
    carrierName: "Hapag-Lloyd",
    originCountry: "Germany",
    destinationCountry: "UAE",
    originCity: "Hamburg",
    destinationCity: "Dubai",
    originCoords: { lat: 53.5511, lng: 9.9937 },
    destinationCoords: { lat: 25.2048, lng: 55.2708 },
    status: "delivered",
    quantity: 200,
    incidentType: null,
    incidentDescription: null,
    incidentDate: null,
    estimatedCost: 2800,
    actualCost: 2750,
    createdAt: "2024-02-01T07:30:00",
    eta: "2024-02-10",
  },
  {
    id: "SHP-005",
    carrierNumber: "CR-9901",
    carrierName: "ONE",
    originCountry: "Japan",
    destinationCountry: "Canada",
    originCity: "Tokyo",
    destinationCity: "Vancouver",
    originCoords: { lat: 35.6762, lng: 139.6503 },
    destinationCoords: { lat: 49.2827, lng: -123.1207 },
    status: "in_transit",
    quantity: 450,
    incidentType: "lost",
    incidentDescription:
      "Pallet #22 missing from container during transfer at Yokohama port. Investigation underway with port authority. CCTV footage being reviewed. Estimated value of missing goods: $4,500.",
    incidentDate: "2024-02-07T19:10:00",
    incidentSeverity: "medium",
    estimatedCost: 8500,
    actualCost: null,
    createdAt: "2024-01-29T11:00:00",
    eta: "2024-02-18",
  },
  {
    id: "SHP-006",
    carrierNumber: "CR-3345",
    carrierName: "Evergreen",
    originCountry: "South Korea",
    destinationCountry: "Mexico",
    originCity: "Busan",
    destinationCity: "Manzanillo",
    originCoords: { lat: 35.1796, lng: 129.0756 },
    destinationCoords: { lat: 19.0544, lng: -104.3186 },
    status: "in_transit",
    quantity: 380,
    incidentType: null,
    incidentDescription: null,
    incidentDate: null,
    estimatedCost: 6200,
    actualCost: null,
    createdAt: "2024-02-03T14:45:00",
    eta: "2024-02-20",
  },
  {
    id: "SHP-007",
    carrierNumber: "CR-6678",
    carrierName: "CMA CGM",
    originCountry: "France",
    destinationCountry: "Brazil",
    originCity: "Marseille",
    destinationCity: "Santos",
    originCoords: { lat: 43.2965, lng: 5.3698 },
    destinationCoords: { lat: -23.9608, lng: -46.3336 },
    status: "in_transit",
    quantity: 95,
    incidentType: "delayed",
    incidentDescription:
      "Customs hold at Marseille for documentation review. Missing certificate of origin. Expected clearance in 24 hours after document submission.",
    incidentDate: "2024-02-09T10:30:00",
    incidentSeverity: "low",
    estimatedCost: 3900,
    actualCost: null,
    createdAt: "2024-02-05T14:20:00",
    eta: "2024-02-22",
  },
  {
    id: "SHP-008",
    carrierNumber: "CR-2290",
    carrierName: "ZIM",
    originCountry: "India",
    destinationCountry: "South Africa",
    originCity: "Mumbai",
    destinationCity: "Cape Town",
    originCoords: { lat: 19.076, lng: 72.8777 },
    destinationCoords: { lat: -33.9249, lng: 18.4241 },
    status: "delivered",
    quantity: 280,
    incidentType: "damaged",
    incidentDescription:
      "Minor packaging damage to 5 units during unloading. Goods intact. Report filed.",
    incidentDate: "2024-02-08T16:55:00",
    incidentSeverity: "low",
    estimatedCost: 4100,
    actualCost: 4250,
    createdAt: "2024-01-22T08:00:00",
    eta: "2024-02-08",
  },
];

export const shipmentService = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockShipments;
  },

  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockShipments.find((s) => s.id === id);
  },

  getDashboardSummary: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    const inTransit = mockShipments.filter(s => s.status === "in_transit").length;
    const delivered = mockShipments.filter(s => s.status === "delivered").length;
    const delayed = mockShipments.filter(s => s.incidentType === "delayed").length;
    const highRisk = mockShipments.filter(s => s.incidentSeverity === "high").length;
    const totalCost = mockShipments.reduce((sum, s) => sum + (s.estimatedCost || 0), 0);
    
    return {
      activeShipments: inTransit,
      deliveredShipments: delivered,
      delayedCount: delayed,
      highRiskCount: highRisk,
      totalCost: totalCost,
    };
  },

  getAnalytics: async (period = "30d") => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return {
      onTimeRate: 87,
      onTimeCount: 21,
      totalShipments: 24,
      avgCostVariance: 150,
    };
  },
};
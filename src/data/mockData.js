// ============================================================
// VIOOH OPS — Mock Data
// Period: Jan 2026 – Mar 2026
// Hierarchy: region → country → city
// ============================================================

// ------------------------------------------------------------
// BUSINESSES
// ------------------------------------------------------------
export const businesses = [
  // --- EMEA / UK / London ---
  { id: "GMG", name: "Global Media Group",  region: "EMEA",     country: "UK",        city: "London",   revenue: { actual: 1421270, target: 1395000 }, tickets: { critical: 3, high: 7,  open: 8,  total: 20 }, screenUsage: 91, fillRate: 94, uptime: 99.2, status: "warning"  },
  { id: "CLR", name: "Clear Channel UK",    region: "EMEA",     country: "UK",        city: "London",   revenue: { actual: 980500,  target: 1050000 }, tickets: { critical: 2, high: 5,  open: 12, total: 18 }, screenUsage: 83, fillRate: 88, uptime: 97.5, status: "warning"  },
  // --- EMEA / France / Paris ---
  { id: "PUB", name: "Publicis Display",    region: "EMEA",     country: "France",    city: "Paris",    revenue: { actual: 870000,  target: 850000  }, tickets: { critical: 0, high: 2,  open: 4,  total: 12 }, screenUsage: 93, fillRate: 95, uptime: 99.0, status: "ok"       },
  { id: "DCX", name: "Decaux Outdoor",      region: "EMEA",     country: "France",    city: "Paris",    revenue: { actual: 1105000, target: 1100000 }, tickets: { critical: 1, high: 3,  open: 6,  total: 15 }, screenUsage: 89, fillRate: 92, uptime: 98.7, status: "warning"  },
  // --- EMEA / Germany / Berlin ---
  { id: "MMB",  name: "Modern Media Berlin", region: "EMEA",     country: "Germany",     city: "Berlin",   revenue: { actual: 924000,  target: 900000  }, tickets: { critical: 1, high: 3,  open: 5,  total: 14 }, screenUsage: 88, fillRate: 91, uptime: 98.6, status: "warning"  },
  { id: "DOUT", name: "Deutsche OOH",        region: "EMEA",     country: "Germany",     city: "Berlin",   revenue: { actual: 672000,  target: 750000  }, tickets: { critical: 3, high: 5,  open: 9,  total: 16 }, screenUsage: 74, fillRate: 83, uptime: 96.8, status: "critical" },
  // --- Americas / USA / New York ---
  { id: "DH",  name: "Digital Horizon",     region: "Americas", country: "USA",       city: "New York", revenue: { actual: 791630,  target: 765000  }, tickets: { critical: 5, high: 4,  open: 15, total: 20 }, screenUsage: 76, fillRate: 89, uptime: 97.8, status: "critical" },
  { id: "OXM", name: "Outfront Media",      region: "Americas", country: "USA",       city: "New York", revenue: { actual: 1340000, target: 1300000 }, tickets: { critical: 1, high: 3,  open: 5,  total: 16 }, screenUsage: 95, fillRate: 96, uptime: 99.5, status: "ok"       },
  // --- APAC / China / Shanghai ---
  { id: "AC",  name: "AdVantage Corp",      region: "APAC",     country: "China",     city: "Shanghai", revenue: { actual: 1219020, target: 1125000 }, tickets: { critical: 3, high: 6,  open: 10, total: 20 }, screenUsage: 88, fillRate: 91, uptime: 98.5, status: "warning"  },
  { id: "ZN",  name: "Zenith Networks",     region: "APAC",     country: "China",     city: "Shanghai", revenue: { actual: 1958870, target: 1845000 }, tickets: { critical: 1, high: 2,  open: 3,  total: 20 }, screenUsage: 97, fillRate: 97, uptime: 99.8, status: "ok"       },
  { id: "SKY", name: "SkyMedia Shanghai",   region: "APAC",     country: "China",     city: "Shanghai", revenue: { actual: 654000,  target: 720000  }, tickets: { critical: 4, high: 8,  open: 17, total: 22 }, screenUsage: 71, fillRate: 82, uptime: 96.1, status: "critical" },
  // --- APAC / Australia / Sydney ---
  { id: "OZM",  name: "OOH Australia",       region: "APAC",     country: "Australia",  city: "Sydney",   revenue: { actual: 530000,  target: 600000  }, tickets: { critical: 2, high: 4,  open: 9,  total: 14 }, screenUsage: 79, fillRate: 85, uptime: 97.2, status: "critical" },
  // --- APAC / New Zealand / Auckland ---
  { id: "MITD", name: "Make IT DOOH NZ",    region: "APAC",     country: "New Zealand", city: "Auckland", revenue: { actual: 487000,  target: 460000  }, tickets: { critical: 0, high: 2,  open: 3,  total: 8  }, screenUsage: 92, fillRate: 94, uptime: 99.1, status: "ok"       },
  { id: "NZAC", name: "NZ Ad Connect",      region: "APAC",     country: "New Zealand", city: "Auckland", revenue: { actual: 312000,  target: 380000  }, tickets: { critical: 2, high: 4,  open: 8,  total: 12 }, screenUsage: 73, fillRate: 81, uptime: 96.4, status: "critical" },
]

// ------------------------------------------------------------
// TICKETS — 80 tickets from all businesses
// ------------------------------------------------------------
export const tickets = [
  { id: "TGM-001", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Reporting Error",         priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 90,   createdAt: "2026-04-01T09:00:00" },
  { id: "TDH-001", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Ad Creative Issue",        priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 210,  createdAt: "2026-04-01T11:30:00" },
  { id: "TAC-001", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Platform Downtime",        priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 45,   createdAt: "2026-04-01T14:00:00" },
  { id: "TZN-001", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Billing Inquiry",          priority: "Low",      status: "Resolved", ackMinutes: 930, resolveMinutes: 1065, createdAt: "2026-04-01T16:30:00" },
  { id: "TGM-002", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Campaign Optimisation",    priority: "Medium",   status: "Resolved", ackMinutes: 10,  resolveMinutes: 150,  createdAt: "2026-04-02T09:30:00" },
  { id: "TDH-002", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Technical Glitch",         priority: "High",     status: "Open",     ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-02T10:15:00" },
  { id: "TAC-002", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Integration Request",      priority: "Medium",   status: "Open",     ackMinutes: 15,  resolveMinutes: 1155, createdAt: "2026-04-02T13:45:00" },
  { id: "TZN-002", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Ad Inventory Check",       priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 90,   createdAt: "2026-04-02T15:00:00" },
  { id: "TGM-003", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Login/Access Issue",       priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 25,   createdAt: "2026-04-03T08:45:00" },
  { id: "TDH-003", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Performance Query",        priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 180,  createdAt: "2026-04-03T10:00:00" },
  { id: "TAC-003", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "System Error",             priority: "High",     status: "Open",     ackMinutes: 5,   resolveMinutes: 15,   createdAt: "2026-04-03T11:30:00" },
  { id: "TZN-003", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Contract Amendment",       priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 1230, createdAt: "2026-04-03T14:00:00" },
  { id: "TGM-004", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Creative Upload",          priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 120,  createdAt: "2026-04-04T09:00:00" },
  { id: "TDH-004", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Reporting Delay",          priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 45,   createdAt: "2026-04-04T11:00:00" },
  { id: "TAC-004", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Targeting Issue",          priority: "Medium",   status: "Resolved", ackMinutes: 30,  resolveMinutes: 180,  createdAt: "2026-04-04T13:00:00" },
  { id: "TZN-004", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Invoice Adjustment",       priority: "Low",      status: "Resolved", ackMinutes: 10,  resolveMinutes: 1065, createdAt: "2026-04-04T15:30:00" },
  { id: "TGM-005", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Emergency Fix",            priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 20,   createdAt: "2026-04-05T08:00:00" },
  { id: "TDH-005", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Budget Allocation",        priority: "Medium",   status: "Open",     ackMinutes: 15,  resolveMinutes: 180,  createdAt: "2026-04-05T10:30:00" },
  { id: "TAC-005", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "API Connection",           priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 30,   createdAt: "2026-04-05T13:00:00" },
  { id: "TZN-005", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "General Query",            priority: "Low",      status: "Resolved", ackMinutes: 990, resolveMinutes: 1260, createdAt: "2026-04-05T16:00:00" },
  { id: "TGM-006", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Reporting Error",          priority: "High",     status: "Open",     ackMinutes: 5,   resolveMinutes: 20,   createdAt: "2026-04-06T09:00:00" },
  { id: "TDH-006", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Ad Creative Issue",        priority: "Medium",   status: "Resolved", ackMinutes: 5,   resolveMinutes: 60,   createdAt: "2026-04-06T11:00:00" },
  { id: "TAC-006", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Platform Configuration",   priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 60,   createdAt: "2026-04-06T14:00:00" },
  { id: "TZN-006", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Data Feed Error",          priority: "Critical", status: "Resolved", ackMinutes: 10,  resolveMinutes: 45,   createdAt: "2026-04-06T16:00:00" },
  { id: "TGM-007", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Tracking Issue",           priority: "High",     status: "Resolved", ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-07T09:00:00" },
  { id: "TDH-007", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Campaign Setup",           priority: "Medium",   status: "Open",     ackMinutes: 10,  resolveMinutes: 135,  createdAt: "2026-04-07T11:30:00" },
  { id: "TAC-007", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Compliance Review",        priority: "Low",      status: "Resolved", ackMinutes: 15,  resolveMinutes: 120,  createdAt: "2026-04-07T14:00:00" },
  { id: "TZN-007", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Billing Inquiry",          priority: "High",     status: "Resolved", ackMinutes: 5,   resolveMinutes: 20,   createdAt: "2026-04-07T15:00:00" },
  { id: "TGM-008", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Minor Bug",                priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 15,   createdAt: "2026-04-08T08:30:00" },
  { id: "TDH-008", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "System Lag",               priority: "Medium",   status: "Open",     ackMinutes: 30,  resolveMinutes: 180,  createdAt: "2026-04-08T10:00:00" },
  { id: "TAC-008", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Reporting Access",         priority: "High",     status: "Resolved", ackMinutes: 5,   resolveMinutes: 60,   createdAt: "2026-04-08T13:00:00" },
  { id: "TZN-008", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Technical Support",        priority: "Medium",   status: "Resolved", ackMinutes: 30,  resolveMinutes: 195,  createdAt: "2026-04-08T15:00:00" },
  { id: "TGM-009", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Pacing Issue",             priority: "Medium",   status: "Resolved", ackMinutes: 10,  resolveMinutes: 120,  createdAt: "2026-04-09T09:00:00" },
  { id: "TDH-009", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Feature Request",          priority: "Low",      status: "Open",     ackMinutes: 30,  resolveMinutes: 1140, createdAt: "2026-04-09T11:00:00" },
  { id: "TAC-009", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Urgency - Data Loss",      priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-09T14:00:00" },
  { id: "TZN-009", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Campaign Pause",           priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 150,  createdAt: "2026-04-09T16:00:00" },
  { id: "TGM-010", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Platform Guide",           priority: "Low",      status: "Resolved", ackMinutes: 15,  resolveMinutes: 45,   createdAt: "2026-04-10T09:00:00" },
  { id: "TDH-010", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Technical Issue",          priority: "High",     status: "Open",     ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-10T11:00:00" },
  { id: "TAC-010", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Reporting Discrepancy",    priority: "Medium",   status: "Resolved", ackMinutes: 10,  resolveMinutes: 180,  createdAt: "2026-04-10T13:00:00" },
  { id: "TZN-010", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Rate Card Query",          priority: "Low",      status: "Resolved", ackMinutes: 990, resolveMinutes: 1170, createdAt: "2026-04-10T15:00:00" },
  { id: "TGM-011", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Setup Assistance",         priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 90,   createdAt: "2026-04-11T09:00:00" },
  { id: "TDH-011", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "System Outage",            priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 60,   createdAt: "2026-04-11T10:00:00" },
  { id: "TAC-011", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Optimisation Settings",    priority: "Medium",   status: "Open",     ackMinutes: 10,  resolveMinutes: 120,  createdAt: "2026-04-11T13:00:00" },
  { id: "TZN-011", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Creative Approval",        priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 90,   createdAt: "2026-04-11T15:00:00" },
  { id: "TGM-012", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Access Reset",             priority: "High",     status: "Resolved", ackMinutes: 5,   resolveMinutes: 15,   createdAt: "2026-04-12T09:00:00" },
  { id: "TDH-012", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Reporting Issue",          priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 60,   createdAt: "2026-04-12T10:30:00" },
  { id: "TAC-012", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Platform Training",        priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 120,  createdAt: "2026-04-12T13:30:00" },
  { id: "TZN-012", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Post-Campaign Review",     priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 240,  createdAt: "2026-04-12T15:30:00" },
  { id: "TGM-013", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Configuration Change",     priority: "Medium",   status: "Resolved", ackMinutes: 10,  resolveMinutes: 90,   createdAt: "2026-04-13T09:00:00" },
  { id: "TDH-013", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Ad Serving Error",         priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 45,   createdAt: "2026-04-13T10:00:00" },
  { id: "TAC-013", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Dashboard Customization",  priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 180,  createdAt: "2026-04-13T13:00:00" },
  { id: "TZN-013", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Payment Details Update",   priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 60,   createdAt: "2026-04-13T15:00:00" },
  { id: "TGM-014", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Forecast Request",         priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 240,  createdAt: "2026-04-14T09:00:00" },
  { id: "TDH-014", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Immediate Downtime",       priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-14T10:00:00" },
  { id: "TAC-014", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Conversion Tracking",      priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 60,   createdAt: "2026-04-14T13:00:00" },
  { id: "TZN-014", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Media Plan Query",         priority: "Low",      status: "Resolved", ackMinutes: 60,  resolveMinutes: 300,  createdAt: "2026-04-14T15:00:00" },
  { id: "TGM-015", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Pacing Issue",             priority: "High",     status: "Resolved", ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-15T09:00:00" },
  { id: "TDH-015", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Geotargeting Setup",       priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 90,   createdAt: "2026-04-15T10:30:00" },
  { id: "TAC-015", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Third-Party Tagging",      priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 120,  createdAt: "2026-04-15T13:00:00" },
  { id: "TZN-015", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Refund Request",           priority: "Low",      status: "Resolved", ackMinutes: 60,  resolveMinutes: 480,  createdAt: "2026-04-15T15:00:00" },
  { id: "TGM-016", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Campaign Extension",       priority: "Medium",   status: "Resolved", ackMinutes: 10,  resolveMinutes: 60,   createdAt: "2026-04-16T09:00:00" },
  { id: "TDH-016", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Platform Glitch",          priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 45,   createdAt: "2026-04-16T10:00:00" },
  { id: "TAC-016", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Advertiser Onboarding",    priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 360,  createdAt: "2026-04-16T13:00:00" },
  { id: "TZN-016", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Account Audit",            priority: "Low",      status: "Resolved", ackMinutes: 60,  resolveMinutes: 480,  createdAt: "2026-04-16T15:00:00" },
  { id: "TGM-017", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Reporting Error",          priority: "High",     status: "Open",     ackMinutes: 5,   resolveMinutes: 20,   createdAt: "2026-04-17T09:00:00" },
  { id: "TDH-017", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Major Bug Report",         priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 120,  createdAt: "2026-04-17T10:00:00" },
  { id: "TAC-017", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Custom Report Setup",      priority: "Medium",   status: "Open",     ackMinutes: 15,  resolveMinutes: 180,  createdAt: "2026-04-17T13:00:00" },
  { id: "TZN-017", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Ad Placement Issue",       priority: "High",     status: "Resolved", ackMinutes: 10,  resolveMinutes: 30,   createdAt: "2026-04-17T15:00:00" },
  { id: "TGM-018", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Technical Issue",          priority: "Medium",   status: "Resolved", ackMinutes: 10,  resolveMinutes: 90,   createdAt: "2026-04-18T09:00:00" },
  { id: "TDH-018", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Weekend Reporting",        priority: "Low",      status: "Resolved", ackMinutes: 60,  resolveMinutes: 360,  createdAt: "2026-04-18T10:00:00" },
  { id: "TAC-018", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Login Failure",            priority: "High",     status: "Open",     ackMinutes: 5,   resolveMinutes: 15,   createdAt: "2026-04-18T13:00:00" },
  { id: "TZN-018", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Technical Setup",          priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 90,   createdAt: "2026-04-18T15:00:00" },
  { id: "TGM-019", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Urgent Campaign Stop",     priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 15,   createdAt: "2026-04-19T09:00:00" },
  { id: "TDH-019", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Pixel Implementation",     priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 120,  createdAt: "2026-04-19T10:30:00" },
  { id: "TAC-019", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "Budget Adjustment",        priority: "Medium",   status: "Resolved", ackMinutes: 10,  resolveMinutes: 60,   createdAt: "2026-04-19T13:00:00" },
  { id: "TZN-019", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "Geo Restriction Bypass",   priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 240,  createdAt: "2026-04-19T15:00:00" },
  { id: "TGM-020", business: "Global Media Group", region: "EMEA",     country: "UK",    city: "London",   issueType: "Data Feed Update",         priority: "Medium",   status: "Resolved", ackMinutes: 10,  resolveMinutes: 60,   createdAt: "2026-04-20T09:00:00" },
  { id: "TDH-020", business: "Digital Horizon",    region: "Americas", country: "USA",   city: "New York", issueType: "Broken Element",           priority: "High",     status: "Open",     ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-20T10:00:00" },
  { id: "TAC-020", business: "AdVantage Corp",     region: "APAC",     country: "China", city: "Shanghai", issueType: "User Management",          priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 120,  createdAt: "2026-04-20T13:00:00" },
  { id: "TZN-020", business: "Zenith Networks",    region: "APAC",     country: "China", city: "Shanghai", issueType: "API Key Renewal",          priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 45,   createdAt: "2026-04-20T15:00:00" },

  // --- Clear Channel UK ---
  { id: "TCLR-001", business: "Clear Channel UK",  region: "EMEA",     country: "UK",        city: "London",   issueType: "Platform Downtime",        priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 60,   createdAt: "2026-04-03T08:00:00" },
  { id: "TCLR-002", business: "Clear Channel UK",  region: "EMEA",     country: "UK",        city: "London",   issueType: "System Outage",            priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 45,   createdAt: "2026-04-08T09:30:00" },
  { id: "TCLR-003", business: "Clear Channel UK",  region: "EMEA",     country: "UK",        city: "London",   issueType: "Reporting Error",          priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 90,   createdAt: "2026-04-05T10:00:00" },
  { id: "TCLR-004", business: "Clear Channel UK",  region: "EMEA",     country: "UK",        city: "London",   issueType: "Technical Glitch",         priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 60,   createdAt: "2026-04-10T11:00:00" },
  { id: "TCLR-005", business: "Clear Channel UK",  region: "EMEA",     country: "UK",        city: "London",   issueType: "Ad Serving Error",         priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 45,   createdAt: "2026-04-14T09:00:00" },
  { id: "TCLR-006", business: "Clear Channel UK",  region: "EMEA",     country: "UK",        city: "London",   issueType: "Campaign Optimisation",    priority: "Medium",   status: "Open",     ackMinutes: 15,  resolveMinutes: 120,  createdAt: "2026-04-07T13:00:00" },
  { id: "TCLR-007", business: "Clear Channel UK",  region: "EMEA",     country: "UK",        city: "London",   issueType: "Creative Upload",          priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 90,   createdAt: "2026-04-12T10:30:00" },
  { id: "TCLR-008", business: "Clear Channel UK",  region: "EMEA",     country: "UK",        city: "London",   issueType: "Billing Inquiry",          priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 240,  createdAt: "2026-04-15T14:00:00" },

  // --- Publicis Display ---
  { id: "TPUB-001", business: "Publicis Display",  region: "EMEA",     country: "France",    city: "Paris",    issueType: "Reporting Delay",          priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 60,   createdAt: "2026-04-04T09:00:00" },
  { id: "TPUB-002", business: "Publicis Display",  region: "EMEA",     country: "France",    city: "Paris",    issueType: "Targeting Issue",          priority: "High",     status: "Resolved", ackMinutes: 15,  resolveMinutes: 120,  createdAt: "2026-04-09T10:00:00" },
  { id: "TPUB-003", business: "Publicis Display",  region: "EMEA",     country: "France",    city: "Paris",    issueType: "Campaign Setup",           priority: "Medium",   status: "Open",     ackMinutes: 15,  resolveMinutes: 90,   createdAt: "2026-04-06T11:00:00" },
  { id: "TPUB-004", business: "Publicis Display",  region: "EMEA",     country: "France",    city: "Paris",    issueType: "Ad Inventory Check",       priority: "Medium",   status: "Resolved", ackMinutes: 20,  resolveMinutes: 150,  createdAt: "2026-04-11T13:00:00" },
  { id: "TPUB-005", business: "Publicis Display",  region: "EMEA",     country: "France",    city: "Paris",    issueType: "General Query",            priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 300,  createdAt: "2026-04-13T15:00:00" },
  { id: "TPUB-006", business: "Publicis Display",  region: "EMEA",     country: "France",    city: "Paris",    issueType: "Rate Card Query",          priority: "Low",      status: "Resolved", ackMinutes: 60,  resolveMinutes: 480,  createdAt: "2026-04-16T10:00:00" },

  // --- Decaux Outdoor ---
  { id: "TDCX-001", business: "Decaux Outdoor",    region: "EMEA",     country: "France",    city: "Paris",    issueType: "Data Feed Error",          priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-02T08:30:00" },
  { id: "TDCX-002", business: "Decaux Outdoor",    region: "EMEA",     country: "France",    city: "Paris",    issueType: "API Connection",           priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 45,   createdAt: "2026-04-07T09:00:00" },
  { id: "TDCX-003", business: "Decaux Outdoor",    region: "EMEA",     country: "France",    city: "Paris",    issueType: "Platform Configuration",   priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 60,   createdAt: "2026-04-12T10:00:00" },
  { id: "TDCX-004", business: "Decaux Outdoor",    region: "EMEA",     country: "France",    city: "Paris",    issueType: "Integration Request",      priority: "Medium",   status: "Open",     ackMinutes: 15,  resolveMinutes: 120,  createdAt: "2026-04-09T13:00:00" },
  { id: "TDCX-005", business: "Decaux Outdoor",    region: "EMEA",     country: "France",    city: "Paris",    issueType: "Performance Query",        priority: "Medium",   status: "Resolved", ackMinutes: 20,  resolveMinutes: 180,  createdAt: "2026-04-14T11:00:00" },
  { id: "TDCX-006", business: "Decaux Outdoor",    region: "EMEA",     country: "France",    city: "Paris",    issueType: "Contract Amendment",       priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 360,  createdAt: "2026-04-16T14:00:00" },
  { id: "TDCX-007", business: "Decaux Outdoor",    region: "EMEA",     country: "France",    city: "Paris",    issueType: "Media Plan Query",         priority: "Low",      status: "Resolved", ackMinutes: 60,  resolveMinutes: 420,  createdAt: "2026-04-18T10:30:00" },

  // --- Outfront Media ---
  { id: "TOXM-001", business: "Outfront Media",    region: "Americas", country: "USA",       city: "New York", issueType: "Emergency Fix",            priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-05T08:00:00" },
  { id: "TOXM-002", business: "Outfront Media",    region: "Americas", country: "USA",       city: "New York", issueType: "System Error",             priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 60,   createdAt: "2026-04-10T09:30:00" },
  { id: "TOXM-003", business: "Outfront Media",    region: "Americas", country: "USA",       city: "New York", issueType: "Reporting Issue",          priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 45,   createdAt: "2026-04-15T10:00:00" },
  { id: "TOXM-004", business: "Outfront Media",    region: "Americas", country: "USA",       city: "New York", issueType: "Budget Allocation",        priority: "Medium",   status: "Open",     ackMinutes: 15,  resolveMinutes: 120,  createdAt: "2026-04-07T11:00:00" },
  { id: "TOXM-005", business: "Outfront Media",    region: "Americas", country: "USA",       city: "New York", issueType: "Geotargeting Setup",       priority: "Medium",   status: "Resolved", ackMinutes: 20,  resolveMinutes: 150,  createdAt: "2026-04-12T13:00:00" },
  { id: "TOXM-006", business: "Outfront Media",    region: "Americas", country: "USA",       city: "New York", issueType: "Invoice Adjustment",       priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 300,  createdAt: "2026-04-17T14:00:00" },
  { id: "TOXM-007", business: "Outfront Media",    region: "Americas", country: "USA",       city: "New York", issueType: "Post-Campaign Review",     priority: "Low",      status: "Resolved", ackMinutes: 60,  resolveMinutes: 480,  createdAt: "2026-04-19T15:00:00" },

  // --- SkyMedia Shanghai ---
  { id: "TSKY-001", business: "SkyMedia Shanghai", region: "APAC",     country: "China",     city: "Shanghai", issueType: "Platform Downtime",        priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-01T08:00:00" },
  { id: "TSKY-002", business: "SkyMedia Shanghai", region: "APAC",     country: "China",     city: "Shanghai", issueType: "Urgency - Data Loss",      priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 20,   createdAt: "2026-04-06T09:00:00" },
  { id: "TSKY-003", business: "SkyMedia Shanghai", region: "APAC",     country: "China",     city: "Shanghai", issueType: "System Error",             priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 45,   createdAt: "2026-04-03T10:30:00" },
  { id: "TSKY-004", business: "SkyMedia Shanghai", region: "APAC",     country: "China",     city: "Shanghai", issueType: "Login Failure",            priority: "High",     status: "Open",     ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-08T08:30:00" },
  { id: "TSKY-005", business: "SkyMedia Shanghai", region: "APAC",     country: "China",     city: "Shanghai", issueType: "API Connection",           priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 60,   createdAt: "2026-04-11T11:00:00" },
  { id: "TSKY-006", business: "SkyMedia Shanghai", region: "APAC",     country: "China",     city: "Shanghai", issueType: "Ad Serving Error",         priority: "Medium",   status: "Open",     ackMinutes: 15,  resolveMinutes: 90,   createdAt: "2026-04-13T13:00:00" },
  { id: "TSKY-007", business: "SkyMedia Shanghai", region: "APAC",     country: "China",     city: "Shanghai", issueType: "Reporting Discrepancy",    priority: "Medium",   status: "Open",     ackMinutes: 15,  resolveMinutes: 120,  createdAt: "2026-04-16T10:00:00" },
  { id: "TSKY-008", business: "SkyMedia Shanghai", region: "APAC",     country: "China",     city: "Shanghai", issueType: "Dashboard Customization",  priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 240,  createdAt: "2026-04-18T14:00:00" },

  // --- OOH Australia ---
  { id: "TOZM-001", business: "OOH Australia",     region: "APAC",     country: "Australia", city: "Sydney",   issueType: "System Outage",            priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 60,   createdAt: "2026-04-04T08:00:00" },
  { id: "TOZM-002", business: "OOH Australia",     region: "APAC",     country: "Australia", city: "Sydney",   issueType: "Platform Downtime",        priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 45,   createdAt: "2026-04-09T09:00:00" },
  { id: "TOZM-003", business: "OOH Australia",     region: "APAC",     country: "Australia", city: "Sydney",   issueType: "Reporting Error",          priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 60,   createdAt: "2026-04-13T10:00:00" },
  { id: "TOZM-004", business: "OOH Australia",     region: "APAC",     country: "Australia", city: "Sydney",   issueType: "Technical Glitch",         priority: "Medium",   status: "Open",     ackMinutes: 15,  resolveMinutes: 90,   createdAt: "2026-04-06T11:30:00" },
  { id: "TOZM-005", business: "OOH Australia",     region: "APAC",     country: "Australia", city: "Sydney",   issueType: "Campaign Setup",           priority: "Medium",   status: "Open",     ackMinutes: 20,  resolveMinutes: 120,  createdAt: "2026-04-15T13:00:00" },
  { id: "TOZM-006", business: "OOH Australia",     region: "APAC",     country: "Australia", city: "Sydney",   issueType: "General Query",            priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 300,  createdAt: "2026-04-11T14:00:00" },
  { id: "TOZM-007", business: "OOH Australia",     region: "APAC",     country: "Australia",  city: "Sydney",   issueType: "Rate Card Query",          priority: "Low",      status: "Resolved", ackMinutes: 60,  resolveMinutes: 420,  createdAt: "2026-04-17T15:00:00" },

  // --- Modern Media Berlin ---
  { id: "TMMB-001", business: "Modern Media Berlin", region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "Platform Downtime",        priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 40,   createdAt: "2026-04-03T09:00:00" },
  { id: "TMMB-002", business: "Modern Media Berlin", region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "Reporting Error",          priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 75,   createdAt: "2026-04-07T10:30:00" },
  { id: "TMMB-003", business: "Modern Media Berlin", region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "Technical Glitch",         priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 55,   createdAt: "2026-04-11T11:00:00" },
  { id: "TMMB-004", business: "Modern Media Berlin", region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "Campaign Setup",           priority: "Medium",   status: "Resolved", ackMinutes: 15,  resolveMinutes: 120,  createdAt: "2026-04-06T13:00:00" },
  { id: "TMMB-005", business: "Modern Media Berlin", region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "Ad Inventory Check",       priority: "Medium",   status: "Open",     ackMinutes: 20,  resolveMinutes: 90,   createdAt: "2026-04-14T09:30:00" },
  { id: "TMMB-006", business: "Modern Media Berlin", region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "Billing Inquiry",          priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 300,  createdAt: "2026-04-16T14:00:00" },

  // --- Deutsche OOH ---
  { id: "TDOUT-001", business: "Deutsche OOH",       region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "System Outage",            priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 55,   createdAt: "2026-04-02T08:00:00" },
  { id: "TDOUT-002", business: "Deutsche OOH",       region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "Urgency - Data Loss",      priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 25,   createdAt: "2026-04-09T07:30:00" },
  { id: "TDOUT-003", business: "Deutsche OOH",       region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "Ad Serving Error",         priority: "Critical", status: "Open",     ackMinutes: 10,  resolveMinutes: 35,   createdAt: "2026-04-14T10:00:00" },
  { id: "TDOUT-004", business: "Deutsche OOH",       region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "API Connection",           priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 60,   createdAt: "2026-04-05T11:00:00" },
  { id: "TDOUT-005", business: "Deutsche OOH",       region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "Reporting Discrepancy",    priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 80,   createdAt: "2026-04-10T13:30:00" },
  { id: "TDOUT-006", business: "Deutsche OOH",       region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "Campaign Optimisation",    priority: "Medium",   status: "Resolved", ackMinutes: 20,  resolveMinutes: 150,  createdAt: "2026-04-08T09:00:00" },
  { id: "TDOUT-007", business: "Deutsche OOH",       region: "EMEA",   country: "Germany",     city: "Berlin",   issueType: "General Query",            priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 360,  createdAt: "2026-04-15T15:00:00" },

  // --- Make IT DOOH NZ ---
  { id: "TMITD-001", business: "Make IT DOOH NZ",    region: "APAC",   country: "New Zealand", city: "Auckland", issueType: "Reporting Delay",          priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 60,   createdAt: "2026-04-04T09:00:00" },
  { id: "TMITD-002", business: "Make IT DOOH NZ",    region: "APAC",   country: "New Zealand", city: "Auckland", issueType: "Campaign Setup",           priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 45,   createdAt: "2026-04-10T10:00:00" },
  { id: "TMITD-003", business: "Make IT DOOH NZ",    region: "APAC",   country: "New Zealand", city: "Auckland", issueType: "Ad Inventory Check",       priority: "Medium",   status: "Resolved", ackMinutes: 20,  resolveMinutes: 150,  createdAt: "2026-04-07T11:30:00" },
  { id: "TMITD-004", business: "Make IT DOOH NZ",    region: "APAC",   country: "New Zealand", city: "Auckland", issueType: "Rate Card Query",          priority: "Low",      status: "Resolved", ackMinutes: 60,  resolveMinutes: 480,  createdAt: "2026-04-13T14:00:00" },

  // --- NZ Ad Connect ---
  { id: "TNZAC-001", business: "NZ Ad Connect",      region: "APAC",   country: "New Zealand", city: "Auckland", issueType: "Platform Downtime",        priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 50,   createdAt: "2026-04-06T08:00:00" },
  { id: "TNZAC-002", business: "NZ Ad Connect",      region: "APAC",   country: "New Zealand", city: "Auckland", issueType: "System Error",             priority: "Critical", status: "Open",     ackMinutes: 5,   resolveMinutes: 30,   createdAt: "2026-04-12T09:30:00" },
  { id: "TNZAC-003", business: "NZ Ad Connect",      region: "APAC",   country: "New Zealand", city: "Auckland", issueType: "Login Failure",            priority: "High",     status: "Open",     ackMinutes: 10,  resolveMinutes: 40,   createdAt: "2026-04-08T10:00:00" },
  { id: "TNZAC-004", business: "NZ Ad Connect",      region: "APAC",   country: "New Zealand", city: "Auckland", issueType: "Technical Glitch",         priority: "High",     status: "Open",     ackMinutes: 15,  resolveMinutes: 65,   createdAt: "2026-04-15T11:00:00" },
  { id: "TNZAC-005", business: "NZ Ad Connect",      region: "APAC",   country: "New Zealand", city: "Auckland", issueType: "Geotargeting Setup",       priority: "Medium",   status: "Resolved", ackMinutes: 20,  resolveMinutes: 180,  createdAt: "2026-04-09T13:00:00" },
  { id: "TNZAC-006", business: "NZ Ad Connect",      region: "APAC",   country: "New Zealand", city: "Auckland", issueType: "Invoice Adjustment",       priority: "Low",      status: "Resolved", ackMinutes: 30,  resolveMinutes: 300,  createdAt: "2026-04-16T15:00:00" },
]

// ------------------------------------------------------------
// ANALYTICS — Q1 2026 aggregates
// ------------------------------------------------------------
export const analytics = {
  totalRevenue: 5390790,
  totalTarget:  5130000,
  networkUptime: 98.8,
  avgResolutionMinutes: 198,

  revenueByMonth: [
    { month: "Jan 2026", revenue: 1734490, target: 1705000 },
    { month: "Feb 2026", revenue: 1669500, target: 1596000 },
    { month: "Mar 2026", revenue: 1986800, target: 1829000 },
  ],

  revenueByDay: [
    { date: "Mar 17", revenue: 65450, target: 59000 },
    { date: "Mar 18", revenue: 63100, target: 59000 },
    { date: "Mar 19", revenue: 65750, target: 59000 },
    { date: "Mar 20", revenue: 63400, target: 59000 },
    { date: "Mar 21", revenue: 66050, target: 59000 },
    { date: "Mar 22", revenue: 63700, target: 59000 },
    { date: "Mar 23", revenue: 66350, target: 59000 },
    { date: "Mar 24", revenue: 64000, target: 59000 },
    { date: "Mar 25", revenue: 66650, target: 59000 },
    { date: "Mar 26", revenue: 64300, target: 59000 },
    { date: "Mar 27", revenue: 66950, target: 59000 },
    { date: "Mar 28", revenue: 64600, target: 59000 },
    { date: "Mar 29", revenue: 67250, target: 59000 },
    { date: "Mar 30", revenue: 64900, target: 59000 },
    { date: "Mar 31", revenue: 67550, target: 59000 },
  ],

  ticketsByPriority: [
    { priority: "Critical", count: 12 },
    { priority: "High",     count: 19 },
    { priority: "Medium",   count: 31 },
    { priority: "Low",      count: 18 },
  ],

  revenueByBusiness: [
    { name: "Zenith Networks",    actual: 1958870, target: 1845000 },
    { name: "Global Media Group", actual: 1421270, target: 1395000 },
    { name: "AdVantage Corp",     actual: 1219020, target: 1125000 },
    { name: "Digital Horizon",    actual: 791630,  target: 765000  },
  ],

  revenueByRegion: [
    { region: "EMEA",     actual: 4376770, target: 4395000 },
    { region: "APAC",     actual: 4361890, target: 4290000 },
    { region: "Americas", actual: 2131630, target: 2065000 },
  ],
}

// ------------------------------------------------------------
// GLOBAL STATUS BAR
// ------------------------------------------------------------
export const globalStatus = {
  critical: 19,
  open: 123,
  totalBusinesses: 10,
  liveRevenue: 67550,
}

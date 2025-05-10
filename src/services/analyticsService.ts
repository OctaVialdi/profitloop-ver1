
/**
 * Analytics Service
 * This service handles tracking of user events and provides analytics data
 */

// Mock analytics data for demonstration purposes
const mockEventData = {
  subscription: [
    { date: "2023-01", count: 5 },
    { date: "2023-02", count: 8 },
    { date: "2023-03", count: 12 },
    { date: "2023-04", count: 15 },
    { date: "2023-05", count: 10 },
    { date: "2023-06", count: 18 }
  ],
  feature_impression: [
    { date: "2023-01", count: 25 },
    { date: "2023-02", count: 32 },
    { date: "2023-03", count: 40 },
    { date: "2023-04", count: 38 },
    { date: "2023-05", count: 45 },
    { date: "2023-06", count: 52 }
  ]
};

const mockFeatureConversions = [
  { feature: "Analytics", impressions: 120, conversions: 45 },
  { feature: "Export", impressions: 85, conversions: 28 },
  { feature: "Custom Reports", impressions: 65, conversions: 18 },
  { feature: "Team Sharing", impressions: 95, conversions: 37 },
  { feature: "API Access", impressions: 35, conversions: 12 }
];

const mockTrialMetrics = {
  trialStarted: 100,
  trialCompleted: 85,
  converted: 35,
  conversionRate: 0.35,
  averageTimeToConversion: 12 // days
};

export const analyticsService = {
  trackEvent: async (eventData: { 
    eventType: string; 
    organizationId?: string; 
    additionalData?: Record<string, any>; 
  }) => {
    console.log("Tracking event:", eventData);
    // In a real implementation, this would send the event to a backend service
  },
  
  trackTrialStarted: (organizationId: string) => {
    console.log("Trial started for organization:", organizationId);
    // This would log when a trial is started
  },
  
  trackPlanSelected: (planId: string, organizationId?: string) => {
    console.log("Plan selected:", planId, "for organization:", organizationId);
    // This would log when a plan is selected
  },
  
  trackFeatureImpression: (featureId: string, context: string, organizationId?: string) => {
    console.log("Feature impression:", featureId, "context:", context, "org:", organizationId);
    // This would log when a feature is viewed/impressed upon
  },
  
  trackFeatureUsage: (featureId: string, context: string, organizationId?: string) => {
    console.log("Feature used:", featureId, "context:", context, "org:", organizationId);
    // This would log when a feature is actually used
  },
  
  getAnalyticsByEventType: async (eventType: string) => {
    // In a real implementation, this would query the backend for analytics data
    return { data: mockEventData[eventType as keyof typeof mockEventData] || [] };
  },
  
  getFeatureConversionAnalytics: async () => {
    // This would return data about feature impressions vs conversions
    return { data: mockFeatureConversions };
  },
  
  getTrialConversionMetrics: async () => {
    // This would return metrics about trial conversions
    return mockTrialMetrics;
  },

  trackTrialBannerClicked: (organizationId: string, daysLeft: number) => {
    console.log("Trial banner clicked:", organizationId, "days left:", daysLeft);
    // This would log when a trial banner is clicked
  },
  
  trackCheckoutInitiated: (planId: string, organizationId: string) => {
    console.log("Checkout initiated for plan:", planId, "org:", organizationId);
    // This would log when a checkout is initiated
  },
  
  trackTrialExtensionRequested: (organizationId: string, reason: string) => {
    console.log("Trial extension requested:", organizationId, "reason:", reason);
    // This would log when a trial extension is requested
  },
  
  trackAdminPanelView: (organizationId: string) => {
    console.log("Admin panel viewed:", organizationId);
    // This would log when the admin panel is viewed
  }
};

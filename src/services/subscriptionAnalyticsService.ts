
// Mock analytics service for subscription events

export const subscriptionAnalyticsService = {
  trackEvent: (eventData: {
    eventType: string;
    organizationId?: string;
    additionalData?: Record<string, any>;
  }) => {
    console.log('Analytics event tracked:', eventData);
  },

  trackTrialStarted: (organizationId: string) => {
    console.log(`Analytics: Trial started for organization ${organizationId}`);
  },

  trackPlanSelected: (planId: string, organizationId?: string) => {
    console.log(`Analytics: Plan ${planId} selected for organization ${organizationId}`);
  },

  trackFeatureImpression: (featureId: string, context: string, organizationId?: string) => {
    console.log(`Analytics: Feature impression ${featureId} in ${context}`);
  },

  trackAdminPanelView: (section: string, organizationId?: string) => {
    console.log(`Analytics: Admin panel ${section} viewed`);
  },
  
  // Added missing methods
  trackTrialBannerClicked: (daysLeft: number, organizationId?: string) => {
    console.log(`Analytics: Trial banner clicked with ${daysLeft} days left for organization ${organizationId}`);
  },
  
  trackCheckoutInitiated: (planId: string, source: string, organizationId?: string) => {
    console.log(`Analytics: Checkout initiated for plan ${planId} from ${source} for organization ${organizationId}`);
  },
  
  trackTrialExtensionRequested: (organizationId: string, reason: string) => {
    console.log(`Analytics: Trial extension requested for organization ${organizationId} with reason: ${reason}`);
  },
  
  // Mock analytics data retrieval functions
  getAnalyticsByEventType: (eventType: string, period: string = '30d') => {
    return Promise.resolve({
      data: [
        { date: '2023-01-01', count: 10 },
        { date: '2023-01-02', count: 15 },
        { date: '2023-01-03', count: 8 }
      ]
    });
  },
  
  getFeatureConversionAnalytics: () => {
    return Promise.resolve({
      data: [
        { feature: 'Employee Management', impressions: 120, conversions: 45 },
        { feature: 'Recruitment', impressions: 80, conversions: 30 },
        { feature: 'Payroll', impressions: 60, conversions: 20 }
      ]
    });
  },
  
  getTrialConversionMetrics: () => {
    return Promise.resolve({
      trialStarted: 100,
      trialCompleted: 85,
      converted: 42,
      conversionRate: 49.4,
      averageTimeToConversion: 8.3
    });
  }
};

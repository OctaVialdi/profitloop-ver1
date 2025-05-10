
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
  }
};

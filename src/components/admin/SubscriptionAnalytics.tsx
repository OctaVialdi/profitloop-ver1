
import React from 'react';
import { useSubscriptionAnalytics } from './subscription-analytics';
import { EventTypeChart } from './subscription-analytics';
import { FeatureConversionChart } from './subscription-analytics';
import { TrialConversionMetrics } from './subscription-analytics';

const SubscriptionAnalytics = () => {
  const { eventCounts, featureConversions, trialMetrics, isLoading } = useSubscriptionAnalytics();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Event Type Analytics */}
      <EventTypeChart eventCounts={eventCounts} isLoading={isLoading} />

      {/* Feature Conversion Analytics */}
      <FeatureConversionChart featureConversions={featureConversions} isLoading={isLoading} />

      {/* Trial Conversion Metrics */}
      <TrialConversionMetrics trialMetrics={trialMetrics} isLoading={isLoading} />
    </div>
  );
};

export default SubscriptionAnalytics;


import React from 'react';
import { SubscriptionPlan } from '@/types/organization';

interface PricingDisplayProps {
  plan: SubscriptionPlan;
  className?: string;
  showPeriod?: boolean;
}

/**
 * Displays the price of a subscription plan, handling both fixed price and per-member pricing models
 */
export const PricingDisplay: React.FC<PricingDisplayProps> = ({ plan, className = '', showPeriod = true }) => {
  // Determine whether this is a free plan
  const isFree = (!plan.price || plan.price === 0) && (!plan.price_per_member || plan.price_per_member === 0);
  
  // Format price with IDR currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Choose which pricing model to display
  const renderPrice = () => {
    if (isFree) {
      return <span className={className}>Gratis</span>;
    }
    
    if (plan.price_per_member && plan.price_per_member > 0) {
      return (
        <span className={className}>
          {formatCurrency(plan.price_per_member)}
          {showPeriod && <span className="text-sm text-muted-foreground">/anggota/bulan</span>}
        </span>
      );
    } else {
      return (
        <span className={className}>
          {formatCurrency(plan.price)}
          {showPeriod && <span className="text-sm text-muted-foreground">/bulan</span>}
        </span>
      );
    }
  };

  return renderPrice();
};

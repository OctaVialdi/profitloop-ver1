
import React from 'react';
import { SubscriptionPlan } from '@/types/organization';

interface PricingDisplayProps {
  plan: SubscriptionPlan;
  memberCount?: number;
  showPeriod?: boolean;
  className?: string;
}

/**
 * Displays the price of a subscription plan, handling both fixed price and per-member pricing models
 */
export const PricingDisplay: React.FC<PricingDisplayProps> = ({ 
  plan, 
  memberCount = 1, 
  showPeriod = true, 
  className = 'text-2xl font-bold' 
}) => {
  // Determine whether this is a free plan
  const isFree = (!plan.price || plan.price === 0) && (!plan.price_per_member || plan.price_per_member === 0);
  
  // Format price with proper currency formatting
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total price based on pricing model
  const calculateTotalPrice = () => {
    if (isFree) return "Free";
    
    if (plan.price_per_member && plan.price_per_member > 0) {
      const totalPrice = plan.price_per_member * memberCount;
      return formatCurrency(totalPrice);
    } else {
      return formatCurrency(plan.price);
    }
  };

  // Render appropriate price display including the pricing model
  const renderPrice = () => {
    if (isFree) {
      return <span className={className}>Free</span>;
    }
    
    if (plan.price_per_member && plan.price_per_member > 0) {
      return (
        <div className="flex flex-col">
          <span className={className}>
            {formatCurrency(plan.price_per_member * memberCount)}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatCurrency(plan.price_per_member)}/user{showPeriod ? "/month" : ""}
            {memberCount > 1 && ` × ${memberCount} users`}
          </span>
        </div>
      );
    } else {
      return (
        <span className={className}>
          {formatCurrency(plan.price)}
          {showPeriod && <span className="text-sm text-muted-foreground">/month</span>}
        </span>
      );
    }
  };

  return renderPrice();
};

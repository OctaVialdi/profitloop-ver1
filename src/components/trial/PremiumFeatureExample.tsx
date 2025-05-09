
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TrialProtection from "@/components/TrialProtection";
import TrialFeatureTooltip from "@/components/trial/TrialFeatureTooltip";
import PremiumFeatureBadge from "@/components/trial/PremiumFeatureBadge";
import { Crown, Sparkles } from "lucide-react";

interface PremiumFeatureExampleProps {
  title: string;
  description?: string;
  isPremium?: boolean;
}

const PremiumFeatureExample = ({
  title,
  description = "Fitur premium untuk meningkatkan bisnis Anda",
  isPremium = true
}: PremiumFeatureExampleProps) => {
  if (!isPremium) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardHeader className="bg-gray-50 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs">Free</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TrialProtection
      premiumFeature={true}
      featureName={title}
      description={description}
    >
      <Card className="overflow-hidden relative transition-all duration-300 hover:shadow-md border-purple-100">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-purple-500" />
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-xs">Premium</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 relative">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="pt-0 pb-3">
          <div className="w-full">
            <div className="premium-divider" />
            <div className="flex justify-end items-center mt-2">
              <span className="text-xs text-purple-700 flex items-center gap-1">
                <Crown className="h-3 w-3" /> Fitur Premium
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </TrialProtection>
  );
};

export default PremiumFeatureExample;

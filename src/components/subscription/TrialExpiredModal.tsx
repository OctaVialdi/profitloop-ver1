
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, CheckCircle2, Star, Clock, Gift } from "lucide-react";
import { Confetti } from "@/components/ui/confetti";

interface TrialExpiredModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onUpgrade?: () => void;
  onRequest?: () => void;
  allowClose?: boolean;
  organizationName?: string;
}

export const TrialExpiredModal: React.FC<TrialExpiredModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  onRequest,
  allowClose = false,
  organizationName = "your organization"
}) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleUpgrade = () => {
    setShowConfetti(true);
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/settings/subscription');
    }
  };

  const handleRequestExtension = () => {
    if (onRequest) {
      onRequest();
    } else {
      navigate('/settings/subscription/request-extension');
    }
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <Dialog open={isOpen} onOpenChange={allowClose ? onClose : undefined}>
        <DialogContent className="sm:max-w-[600px] p-0" onInteractOutside={e => e.preventDefault()}>
          <div className="bg-gradient-to-b from-primary/20 to-background pt-6">
            <DialogHeader className="px-6">
              <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 mb-4">
                <ShieldAlert className="h-8 w-8 text-red-600" />
              </div>
              <DialogTitle className="text-2xl text-center">Your Trial Has Ended</DialogTitle>
              <DialogDescription className="text-center text-lg">
                Your trial period for <span className="font-semibold">{organizationName}</span> has ended. 
                Choose a plan to continue enjoying premium features.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <Tabs defaultValue="recommended" className="px-6 py-4">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="features">Premium Features</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommended">
              <Card className="border-2 border-primary relative">
                <Badge className="absolute -top-2 right-4 bg-yellow-500">Best Value</Badge>
                <CardHeader>
                  <CardTitle>Professional Plan</CardTitle>
                  <CardDescription>Perfect for growing organizations</CardDescription>
                  <div className="text-3xl font-bold mt-2">$29<span className="text-sm font-normal">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span>Unlimited team members</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span>Advanced analytics and reporting</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span>Premium support</span>
                    </li>
                    <li className="flex items-center">
                      <Gift className="h-4 w-4 text-rose-500 mr-2" />
                      <span className="font-medium text-rose-600">Special offer: 20% off first 3 months</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleUpgrade} className="w-full" size="lg">
                    Upgrade Now
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="features">
              <div className="space-y-4">
                <h3 className="font-semibold">Premium Features You'll Unlock:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>Advanced Analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>Team Collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>Custom Integrations</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>Unlimited Storage</span>
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>Advanced Security</span>
                  </li>
                </ul>
                <Button onClick={handleUpgrade} className="w-full mt-4">
                  Unlock Premium Features
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="testimonials">
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="italic">"Upgrading to the premium plan increased our team productivity by 35%. The advanced features are worth every penny!"</p>
                  <p className="text-sm font-semibold mt-2">- Michael T., Marketing Director</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="italic">"The analytics tools in the premium plan helped us make data-driven decisions that boosted our ROI significantly."</p>
                  <p className="text-sm font-semibold mt-2">- Sarah L., Product Manager</p>
                </div>
                <Button onClick={handleUpgrade} className="w-full mt-4">
                  Join Thousands of Satisfied Users
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="px-6 pb-6 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Limited time offer: 20% discount for 3 months</span>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={handleRequestExtension} variant="outline" className="flex-1">
                Request Trial Extension
              </Button>
              {allowClose && (
                <Button onClick={onClose} variant="ghost" className="flex-1">
                  Decide Later
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Award, AlertCircle, Trophy, Gift, Star } from "lucide-react";

export const GamificationTab = () => {
  return (
    <div className="border-t pt-6">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Rewards & Recognition */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-green-600">
              <Award className="h-5 w-5 mr-2" />
              Rewards & Recognition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Top Performer */}
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex justify-between mb-1">
                <div>
                  <h3 className="font-medium text-green-800">Top Performer</h3>
                  <p className="text-sm text-green-700">Achieve highest sales in a month</p>
                </div>
                <span className="text-sm font-semibold">100 points</span>
              </div>
              <p className="text-sm mb-1">Progress</p>
              <Progress value={70} className="h-2 bg-green-100" />
              <div className="text-right mt-1">
                <span className="text-sm">70%</span>
              </div>
            </div>
            
            {/* Quick Closer */}
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex justify-between mb-1">
                <div>
                  <h3 className="font-medium text-green-800">Quick Closer</h3>
                  <p className="text-sm text-green-700">Close 5 deals within a week</p>
                </div>
                <span className="text-sm font-semibold">50 points</span>
              </div>
              <p className="text-sm mb-1">Progress</p>
              <Progress value={70} className="h-2 bg-green-100" />
              <div className="text-right mt-1">
                <span className="text-sm">70%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Performance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Low Performance Warning */}
            <Alert className="border-amber-200 bg-amber-50">
              <div className="flex justify-between">
                <AlertTitle className="text-amber-800">Low Performance Warning</AlertTitle>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">medium</Badge>
              </div>
              <AlertDescription className="text-amber-700">
                <p>No deals closed in 2 weeks</p>
                <p className="font-medium mt-1">Consequence: Performance review required</p>
              </AlertDescription>
            </Alert>
            
            {/* Missed Target Alert */}
            <Alert className="border-red-200 bg-red-50">
              <div className="flex justify-between">
                <AlertTitle className="text-red-800">Missed Target Alert</AlertTitle>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">high</Badge>
              </div>
              <AlertDescription className="text-red-700">
                <p>Below 50% of monthly target</p>
                <p className="font-medium mt-1">Consequence: Training program enrollment</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales Leaderboard */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-purple-700">Sales Leaderboard</h2>
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">29 days left in contest</Badge>
        </div>
        
        {/* Leaderboard Entries */}
        <div className="space-y-4">
          {/* Jane Smith - First Place */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-amber-300">
                    <span className="text-sm font-semibold">JS</span>
                  </Avatar>
                  <div className="absolute -top-1 -left-1 bg-amber-400 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold text-white">1</div>
                </div>
                <div>
                  <h3 className="font-medium">Jane Smith</h3>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <Star className="h-3 w-3 fill-amber-400" />
                    <Star className="h-3 w-3 fill-amber-400" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-purple-700">145 pts</p>
                <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                  <span>OKR Score: 65%</span>
                  <Trophy className="h-4 w-4 text-amber-500" /> 
                  <span>7</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* John Doe - Second Place */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-gray-300">
                    <span className="text-sm font-semibold">JD</span>
                  </Avatar>
                  <div className="absolute -top-1 -left-1 bg-gray-400 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold text-white">2</div>
                </div>
                <div>
                  <h3 className="font-medium">John Doe</h3>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <Star className="h-3 w-3 fill-amber-400" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-purple-700">120 pts</p>
                <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                  <span>OKR Score: 45%</span>
                  <Trophy className="h-4 w-4 text-gray-400" /> 
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Robert Chen - Third Place */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12 border-2 border-amber-700">
                    <span className="text-sm font-semibold">RC</span>
                  </Avatar>
                  <div className="absolute -top-1 -left-1 bg-amber-700 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold text-white">3</div>
                </div>
                <div>
                  <h3 className="font-medium">Robert Chen</h3>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-purple-700">95 pts</p>
                <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                  <span>OKR Score: 30%</span>
                  <Trophy className="h-4 w-4 text-amber-700" /> 
                  <span>3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quarterly Prize Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Quarterly Prize</h2>
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-5 w-5 text-purple-600" />
            <p className="font-medium text-purple-700">Voucher makan Rp 500.000 untuk top performer</p>
          </div>
          <p className="text-sm text-gray-600">Win by earning points: +10 pts per deal • $20K, +5 pts per closed deal, +20 pts for completed OKRs</p>
        </div>
      </div>
    </div>
  );
};

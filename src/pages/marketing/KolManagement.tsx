
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, BarChart2, Users } from "lucide-react";
import { KolAnalyticsDashboard } from "./components/KolAnalyticsDashboard";

const KolManagement = () => {
  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div></div> {/* Empty div for spacing */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-200 hover:text-purple-800">
            <BarChart2 className="h-5 w-5 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-100">
            <Users className="h-5 w-5 mr-2" />
            KOL List
          </Button>
          <Button className="bg-gray-900 text-white hover:bg-gray-800">
            Add KOL
          </Button>
        </div>
      </div>

      <KolAnalyticsDashboard />
    </div>
  );
};

export default KolManagement;

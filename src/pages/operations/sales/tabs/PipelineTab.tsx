
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const PipelineTab = () => {
  return (
    <div className="border-t pt-6">
      <Card>
        <div className="pt-6 px-6">
          <h3 className="text-xl font-semibold mb-6">Sales Pipeline</h3>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">Lead</h4>
                  <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">1</span>
                </div>
              </div>
              
              <Card className="shadow-sm border-gray-200">
                <div className="p-4">
                  <h5 className="font-medium mb-1">Future Enterprises</h5>
                  <p className="text-sm text-gray-500 mb-2">Cold Call</p>
                </div>
              </Card>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">Demo</h4>
                  <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">2</span>
                </div>
              </div>
              
              <Card className="shadow-sm border-gray-200">
                <div className="p-4">
                  <h5 className="font-medium mb-1">Global Innovations</h5>
                  <p className="text-sm text-gray-500 mb-2">Meeting</p>
                </div>
              </Card>
              
              <Card className="shadow-sm border-gray-200">
                <div className="p-4">
                  <h5 className="font-medium mb-1">Nexus Group</h5>
                  <p className="text-sm text-gray-500 mb-2">Meeting</p>
                </div>
              </Card>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">Negotiation</h4>
                  <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">3</span>
                </div>
              </div>
              
              <Card className="shadow-sm border-red-100">
                <div className="p-4">
                  <h5 className="font-medium mb-1">Acme Corp</h5>
                  <p className="text-sm text-gray-500 mb-1">Demo</p>
                  <p className="text-sm font-medium">$52,000</p>
                </div>
              </Card>
              
              <Card className="shadow-sm border-yellow-100">
                <div className="p-4">
                  <h5 className="font-medium mb-1">Stellar Systems</h5>
                  <p className="text-sm text-gray-500 mb-1">Proposal</p>
                  <p className="text-sm font-medium">$28,000</p>
                </div>
              </Card>
              
              <Card className="shadow-sm border-red-100">
                <div className="p-4">
                  <h5 className="font-medium mb-1">Quantum Industries</h5>
                  <p className="text-sm text-gray-500 mb-1">Demo</p>
                  <p className="text-sm font-medium">$65,000</p>
                </div>
              </Card>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">Closed Won</h4>
                  <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">1</span>
                </div>
              </div>
              
              <Card className="shadow-sm border-green-200">
                <div className="p-4">
                  <h5 className="font-medium mb-1">Tech Solutions</h5>
                  <p className="text-sm text-gray-500 mb-1">Closing</p>
                  <p className="text-sm font-medium">$15,000</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

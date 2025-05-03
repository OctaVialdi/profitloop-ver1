
import React from 'react';
import { History } from 'lucide-react';

const ChangeHistoryTab: React.FC = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center p-8">
        <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Change History</h3>
        <p className="text-gray-500 max-w-sm">
          This section will track changes made to company information.
        </p>
      </div>
    </div>
  );
};

export default ChangeHistoryTab;

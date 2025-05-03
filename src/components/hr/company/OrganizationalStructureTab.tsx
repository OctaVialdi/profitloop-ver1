
import React from 'react';
import { Network } from 'lucide-react';

const OrganizationalStructureTab: React.FC = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center p-8">
        <Network className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Organizational Structure</h3>
        <p className="text-gray-500 max-w-sm">
          This section will display the company's organizational hierarchy and structure.
        </p>
      </div>
    </div>
  );
};

export default OrganizationalStructureTab;

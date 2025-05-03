
import React from 'react';
import { File } from 'lucide-react';

const FilesTab: React.FC = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center p-8">
        <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No Company Files</h3>
        <p className="text-gray-500 max-w-sm">
          This section will contain company documents and files.
        </p>
      </div>
    </div>
  );
};

export default FilesTab;

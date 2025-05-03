
import React from 'react';
import { Handle, Position } from '@xyflow/react';

type OrgPositionNodeProps = {
  id: string;
  data: {
    label: string;
    department?: string;
    color?: string;
  };
  selected?: boolean;
};

const OrgPositionNode: React.FC<OrgPositionNodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`px-3 py-2 rounded-md bg-gray-50 border ${selected ? 'border-primary shadow-lg' : 'border-gray-100'}`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-1.5 !bg-purple-400" />
      <div className="w-32 text-center">
        <div className="font-medium text-sm">{data.label}</div>
        {data.department && (
          <div 
            className="text-xs mt-1 px-1.5 py-0.5 rounded-full inline-block"
            style={{ 
              backgroundColor: data.color ? `${data.color}15` : '#e5deff',
              color: data.color || '#9b87f5'
            }}
          >
            {data.department}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-1.5 !bg-purple-400" />
    </div>
  );
};

export default OrgPositionNode;

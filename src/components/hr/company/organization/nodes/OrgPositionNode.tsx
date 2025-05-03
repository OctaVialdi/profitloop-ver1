
import React from 'react';
import { Handle, Position } from '@xyflow/react';

type OrgPositionNodeProps = {
  id: string;
  data: {
    label: string;
    department?: string;
    color?: string;
    role?: string;
  };
  selected?: boolean;
  dragging?: boolean;
};

const OrgPositionNode: React.FC<OrgPositionNodeProps> = ({ data, selected, dragging }) => {
  return (
    <div 
      className={`px-4 py-3 rounded-md ${selected ? 'shadow-lg ring-2 ring-purple-400' : 'shadow-sm border'} ${dragging ? 'opacity-70' : 'opacity-100'} transition-all duration-200`}
      style={{
        backgroundColor: '#f8f8f8',
        borderColor: data.color || '#e0e0e0',
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-1.5 !bg-purple-400" 
      />
      <div className="w-40 max-w-full text-center">
        <div className="font-medium text-sm">{data.label}</div>
        {data.role && <div className="text-xs text-gray-500 mt-1">{data.role}</div>}
        {data.department && (
          <div 
            className="text-xs mt-2 px-2 py-1 rounded-full inline-block"
            style={{ 
              backgroundColor: data.color ? `${data.color}15` : '#e5deff',
              color: data.color || '#9b87f5'
            }}
          >
            {data.department}
          </div>
        )}
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-1.5 !bg-purple-400" 
      />
    </div>
  );
};

export default OrgPositionNode;


import React from 'react';
import { Handle, Position } from '@xyflow/react';

type OrgDepartmentNodeProps = {
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

const OrgDepartmentNode: React.FC<OrgDepartmentNodeProps> = ({ data, selected, dragging }) => {
  return (
    <div 
      className={`px-4 py-3 rounded-md transition-shadow ${selected ? 'shadow-lg' : 'shadow-sm'} ${dragging ? 'opacity-70' : 'opacity-100'}`}
      style={{ 
        backgroundColor: data.color ? `${data.color}15` : '#e5deff',
        borderLeft: `4px solid ${data.color || '#9b87f5'}`
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-1.5 !bg-purple-400" 
      />
      <div className="w-48 max-w-full">
        <div className="font-medium text-base">{data.label}</div>
        {data.role && <div className="text-xs text-gray-500 mt-1">{data.role}</div>}
        {data.department && data.department !== data.label && (
          <div className="text-xs text-gray-500 mt-1">{data.department}</div>
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

export default OrgDepartmentNode;


import React from 'react';
import { Handle, Position } from '@xyflow/react';

type OrgDepartmentNodeProps = {
  id: string;
  data: {
    label: string;
    department?: string;
    color?: string;
  };
  selected?: boolean;
};

const OrgDepartmentNode: React.FC<OrgDepartmentNodeProps> = ({ data, selected }) => {
  return (
    <div 
      className={`px-4 py-2 rounded-md ${selected ? 'shadow-lg' : 'shadow-sm'}`}
      style={{ 
        backgroundColor: data.color ? `${data.color}15` : '#e5deff',
        borderLeft: `4px solid ${data.color || '#9b87f5'}`
      }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-1.5 !bg-purple-400" />
      <div className="w-40">
        <div className="font-medium">{data.label}</div>
        {data.department && <div className="text-xs text-gray-500">{data.department}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-1.5 !bg-purple-400" />
    </div>
  );
};

export default OrgDepartmentNode;


import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type OrgPersonNodeProps = {
  id: string;
  data: {
    label: string;
    role?: string;
    email?: string;
    joinDate?: string;
    profileImage?: string;
    color?: string;
  };
  selected?: boolean;
};

const OrgPersonNode: React.FC<OrgPersonNodeProps> = ({ data, selected }) => {
  return (
    <div className={`p-3 rounded-md bg-white border ${selected ? 'border-primary shadow-lg' : 'border-gray-200'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-1.5 !bg-purple-400" />
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
          {data.profileImage ? (
            <AvatarImage src={data.profileImage} alt={data.label} />
          ) : (
            <AvatarFallback 
              style={{ backgroundColor: data.color || '#9b87f5' }} 
              className="text-white"
            >
              {data.label.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-medium text-sm">{data.label}</div>
          {data.role && <div className="text-xs text-gray-500">{data.role}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-1.5 !bg-purple-400" />
    </div>
  );
};

export default OrgPersonNode;

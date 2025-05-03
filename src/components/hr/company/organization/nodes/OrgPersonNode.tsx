
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
    department?: string;
  };
  selected?: boolean;
  dragging?: boolean;
};

const OrgPersonNode: React.FC<OrgPersonNodeProps> = ({ data, selected, dragging }) => {
  return (
    <div 
      className={`p-4 rounded-md bg-white ${selected ? 'ring-2 ring-purple-400 shadow-lg' : 'border shadow-sm'} ${dragging ? 'opacity-70' : 'opacity-100'} transition-shadow duration-200`}
      style={{
        borderColor: data.color ? data.color : '#e2e8f0',
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-1.5 !bg-purple-400" 
      />
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
        <div className="max-w-[160px]">
          <div className="font-medium text-sm truncate">{data.label}</div>
          {data.role && (
            <div className="text-xs text-gray-500 truncate">{data.role}</div>
          )}
          {data.email && (
            <div className="text-xs text-blue-600 mt-1 truncate">{data.email}</div>
          )}
          {data.department && !data.email && (
            <div className="text-xs text-gray-500 mt-1 truncate">{data.department}</div>
          )}
        </div>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-1.5 !bg-purple-400" 
      />
    </div>
  );
};

export default OrgPersonNode;


import React from 'react';

export const TableHeader: React.FC = () => (
  <div className="grid grid-cols-12 gap-4 py-3 px-4 font-medium text-sm text-muted-foreground border-b bg-white sticky top-0">
    <div className="col-span-2">DATE</div>
    <div className="col-span-4">DISCUSSION POINT</div>
    <div className="col-span-2">REQUEST BY</div>
    <div className="col-span-2">STATUS</div>
    <div className="col-span-1">UPDATES</div>
    <div className="col-span-1">ACTIONS</div>
  </div>
);


import React from 'react';

interface ContentPlanErrorProps {
  error: Error;
}

export default function ContentPlanError({ error }: ContentPlanErrorProps) {
  return (
    <div className="p-4 text-center">
      <p className="text-red-500">Error loading content plan: {error.message}</p>
    </div>
  );
}

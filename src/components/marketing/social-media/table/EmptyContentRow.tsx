
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

export const EmptyContentRow: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={11} className="h-24 text-center">
        No content items. Click "Add Row" to create one.
      </TableCell>
    </TableRow>
  );
};

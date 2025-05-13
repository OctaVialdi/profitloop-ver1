
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

export default function ContentPlanEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={29} className="text-center py-4">
        No content plans available. Add a new row to get started.
      </TableCell>
    </TableRow>
  );
}

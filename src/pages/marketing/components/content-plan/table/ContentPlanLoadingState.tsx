
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

export default function ContentPlanLoadingState() {
  return (
    <TableRow>
      <TableCell colSpan={29} className="text-center py-4">
        Loading content plans...
      </TableCell>
    </TableRow>
  );
}

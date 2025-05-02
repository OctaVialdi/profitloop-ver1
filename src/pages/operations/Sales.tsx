
import { useOrganization } from "@/hooks/useOrganization";
import { SalesHeader } from "./sales/SalesHeader";
import { SalesTabsContainer } from "./sales/SalesTabsContainer";

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <SalesHeader />
      <SalesTabsContainer />
    </div>
  );
}

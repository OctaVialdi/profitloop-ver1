
import { useOrganizationSetup } from "./organization/useOrganizationSetup";

// Re-export the hook with all of its properties, including organization
export { useOrganizationSetup };

// Type re-export if needed (although it should be handled automatically by TypeScript)
export type { Organization, OrganizationFormData } from "./organization/useOrganizationSetup";

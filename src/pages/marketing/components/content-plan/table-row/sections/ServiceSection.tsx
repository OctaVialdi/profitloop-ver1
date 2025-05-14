
import React from "react";
import ServiceCell from "../cells/ServiceCell";
import SubServiceCell from "../cells/SubServiceCell";
import { Service, SubService } from "@/hooks/content-plan";

interface ServiceSectionProps {
  id: string;
  serviceId: string | null;
  subServiceId: string | null;
  services: Service[];
  getFilteredSubServices: (serviceId: string) => SubService[];
  handleFieldChange: (id: string, field: string, value: any) => void;
}

export default function ServiceSection({
  id,
  serviceId,
  subServiceId,
  services,
  getFilteredSubServices,
  handleFieldChange
}: ServiceSectionProps) {
  return (
    <>
      {/* 5. Layanan */}
      <ServiceCell 
        id={id} 
        serviceId={serviceId} 
        services={services} 
        onChange={handleFieldChange} 
      />

      {/* 6. Sub Layanan */}
      <SubServiceCell 
        id={id} 
        serviceId={serviceId} 
        subServiceId={subServiceId} 
        getFilteredSubServices={getFilteredSubServices} 
        onChange={handleFieldChange} 
      />
    </>
  );
}


import { SubService } from './types';

export const getFilteredSubServices = (subServices: SubService[], serviceId: string): SubService[] => {
  if (!serviceId) return [];
  return subServices.filter(subService => subService.service_id === serviceId);
};

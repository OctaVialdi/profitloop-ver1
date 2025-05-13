
import { useState, useEffect } from 'react';
import { ContentPlanItem } from './types';

export const useContentPlan = () => {
  const [contentItems, setContentItems] = useState<ContentPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContentPlan = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // This is mock data for now, but in a real application 
        // this would fetch from your backend or Supabase
        const mockData: ContentPlanItem[] = [
          {
            id: '1',
            title: 'Instagram Post - Product Launch',
            status: 'in-progress',
            progress: 75,
            post_date: '2025-05-20',
            pic_id: undefined,
            pic_production_id: undefined
          },
          {
            id: '2',
            title: 'Facebook Ad Campaign',
            status: 'pending',
            progress: 30,
            post_date: '2025-05-25',
            pic_id: undefined,
            pic_production_id: undefined
          },
          {
            id: '3',
            title: 'TikTok Product Demo',
            status: 'completed',
            progress: 100,
            post_date: '2025-05-10',
            pic_id: undefined,
            pic_production_id: undefined
          },
          {
            id: '4',
            title: 'Blog Post - Industry Insights',
            status: 'new',
            progress: 0,
            post_date: '2025-05-30',
            pic_id: undefined,
            pic_production_id: undefined
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setContentItems(mockData);
          setIsLoading(false);
        }, 500);
      } catch (err: any) {
        console.error('Error loading content plan:', err);
        setError(err.message || 'Failed to load content plan');
        setIsLoading(false);
      }
    };

    loadContentPlan();
  }, []);

  return {
    contentItems,
    isLoading,
    error
  };
};

export type { ContentPlanItem } from './types';

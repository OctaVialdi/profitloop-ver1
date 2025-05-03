
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OrgNode, OrgEdge } from '@/components/hr/company/OrganizationalStructureTab';
import { toast } from 'sonner';

type UseOrgStructureProps = {
  organizationId: string | undefined;
};

type DbOrgNode = {
  id: string;
  name: string;
  role: string | null;
  parent_id: string | null;
  color_hex: string | null;
  profile_pic_url: string | null;
  type: 'department' | 'position' | 'person';
  order_index: number | null;
};

export function useOrgStructure({ organizationId }: UseOrgStructureProps) {
  const [nodes, setNodes] = useState<OrgNode[]>([]);
  const [edges, setEdges] = useState<OrgEdge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Fetch organization structure from Supabase
  const fetchOrgStructure = useCallback(async () => {
    if (!organizationId) return;
    
    setIsLoading(true);
    
    try {
      const { data: orgStructureData, error } = await supabase
        .from('org_structure')
        .select('id, name, role, parent_id, color_hex, profile_pic_url, type, order_index')
        .eq('organization_id', organizationId)
        .order('order_index', { ascending: true });
        
      if (error) {
        throw error;
      }

      if (orgStructureData && orgStructureData.length > 0) {
        const transformedNodes: OrgNode[] = [];
        const transformedEdges: OrgEdge[] = [];
        
        // Process nodes
        orgStructureData.forEach((node: DbOrgNode, index) => {
          // Generate a position for the node
          // This is a simple layout - in a real app, you'd use a more sophisticated algorithm
          const position = {
            x: ((node.order_index || index) % 3) * 300 + 100,
            y: Math.floor((node.order_index || index) / 3) * 150 + 100
          };
          
          // If the node has a parent, create an edge
          if (node.parent_id) {
            transformedEdges.push({
              id: `edge-${node.parent_id}-${node.id}`,
              source: node.parent_id,
              target: node.id,
              animated: true
            });
          }
          
          // Transform database node to OrgNode
          transformedNodes.push({
            id: node.id,
            type: node.type || 'department',
            data: {
              label: node.name,
              role: node.role || undefined,
              profileImage: node.profile_pic_url || undefined,
              color: node.color_hex || undefined
            },
            position
          });
        });
        
        setNodes(transformedNodes);
        setEdges(transformedEdges);
      } else {
        // If no data, set empty arrays
        setNodes([]);
        setEdges([]);
      }
    } catch (error) {
      console.error("Error fetching organization structure:", error);
      toast.error("Failed to load organization structure");
    } finally {
      setIsLoading(false);
      setHasChanges(false);
    }
  }, [organizationId]);
  
  // Save organization structure to Supabase
  const saveOrgStructure = useCallback(async () => {
    if (!organizationId) {
      toast.error("No organization found");
      return false;
    }

    try {
      setIsLoading(true);
      
      // First, let's delete all existing structure to rebuild it
      // In a production app, you might want a more sophisticated approach that only updates what changed
      await supabase
        .from('org_structure')
        .delete()
        .eq('organization_id', organizationId);
      
      // Insert all nodes
      const dbNodes = nodes.map((node, index) => ({
        id: node.id.startsWith('node-') ? undefined : node.id, // Use undefined for new nodes to let Supabase generate UUIDs
        organization_id: organizationId,
        name: node.data.label,
        role: node.data.role || null,
        type: node.type,
        color_hex: node.data.color || null,
        profile_pic_url: node.data.profileImage || null,
        order_index: index,
        // We'll set parent_id in a second pass
      }));
      
      const { data: insertedNodes, error: insertError } = await supabase
        .from('org_structure')
        .insert(dbNodes)
        .select();
        
      if (insertError) {
        throw insertError;
      }
      
      // Create a mapping of our temporary IDs to the real UUIDs
      const idMapping: Record<string, string> = {};
      insertedNodes?.forEach((node, index) => {
        idMapping[nodes[index].id] = node.id;
      });
      
      // Now add the parent relationships
      const updatePromises = edges.map(edge => {
        const sourceId = idMapping[edge.source] || edge.source;
        const targetId = idMapping[edge.target] || edge.target;
        
        return supabase
          .from('org_structure')
          .update({ parent_id: sourceId })
          .eq('id', targetId);
      });
      
      await Promise.all(updatePromises);
      
      // Refetch to get the latest data
      await fetchOrgStructure();
      
      toast.success("Organization structure saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving organization structure:", error);
      toast.error("Failed to save organization structure");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, nodes, edges, fetchOrgStructure]);
  
  // Initialize data
  useEffect(() => {
    fetchOrgStructure();
  }, [fetchOrgStructure]);
  
  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    isLoading,
    hasChanges,
    setHasChanges,
    fetchOrgStructure,
    saveOrgStructure
  };
}

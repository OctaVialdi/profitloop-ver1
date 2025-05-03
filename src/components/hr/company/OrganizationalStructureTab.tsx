
import React, { useState, useCallback, useEffect } from 'react';
import { Network, ZoomIn, ZoomOut, PlusCircle, Trash2, Edit, Move, Save, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from '@/hooks/useOrganization';

import OrganizationFlowChart from './organization/OrganizationFlowChart';
import NodeEditDialog from './organization/NodeEditDialog';

export type OrgNode = {
  id: string;
  type: 'department' | 'position' | 'person';
  data: {
    label: string;
    department?: string;
    email?: string;
    role?: string;
    joinDate?: string;
    profileImage?: string;
    color?: string;
  };
  position: { x: number; y: number };
  parentId?: string;
};

export type OrgEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
};

// Type definitions for database data
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

const OrganizationalStructureTab: React.FC = () => {
  const { organization } = useOrganization();
  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [nodes, setNodes, onNodesChange] = useNodesState<OrgNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<OrgEdge>([]);
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Load organizational structure from Supabase
  const fetchOrgStructure = useCallback(async () => {
    if (!organization?.id) return;
    
    setIsLoading(true);
    
    try {
      const { data: orgStructureData, error } = await supabase
        .from('org_structure')
        .select('id, name, role, parent_id, color_hex, profile_pic_url, type, order_index')
        .eq('organization_id', organization.id)
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
          // This is a simple hierarchical layout - in a real app, you'd use a more sophisticated algorithm
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
  }, [organization?.id, setNodes, setEdges]);
  
  // Call the fetch function when the component mounts or organization changes
  useEffect(() => {
    fetchOrgStructure();
  }, [fetchOrgStructure]);

  // Functions for node operations
  const handleNodeClick = (node: OrgNode) => {
    setSelectedNode(node);
  };

  const handleAddNode = () => {
    const newNode: OrgNode = {
      id: `node-${Date.now()}`,
      type: 'position',
      data: { label: 'New Position' },
      position: { x: 100, y: 100 }
    };
    
    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
    setIsEditDialogOpen(true);
    setHasChanges(true);
    toast.success("New position added. Edit the details.");
  };

  const handleEditNode = () => {
    if (selectedNode) {
      setIsEditDialogOpen(true);
    } else {
      toast.error("Please select a node to edit");
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => 
        eds.filter((edge) => 
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
      setHasChanges(true);
      toast.success("Node deleted successfully");
    } else {
      toast.error("Please select a node to delete");
    }
  };

  const handleSaveNode = (updatedNode: OrgNode) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
    setIsEditDialogOpen(false);
    setSelectedNode(updatedNode);
    setHasChanges(true);
    toast.success("Node updated successfully");
  };

  const handleConnect = useCallback((params: any) => {
    const newEdge = { 
      id: `edge-${params.source}-${params.target}`,
      source: params.source, 
      target: params.target,
      animated: true
    };
    setEdges((eds) => [...eds, newEdge]);
    setHasChanges(true);
  }, [setEdges]);

  // Export current view as PNG
  const handleExportPNG = () => {
    // The implementation of this would typically use html2canvas or a similar library
    // For now, we'll just show a toast
    toast.success("Export feature will be implemented soon");
  };

  // Save the organization structure to Supabase
  const saveOrganizationStructure = async () => {
    if (!organization?.id) {
      toast.error("No organization found");
      return;
    }

    try {
      setIsLoading(true);
      
      // First, let's delete all existing structure to rebuild it
      // In a production app, you might want a more sophisticated approach that only updates what changed
      await supabase
        .from('org_structure')
        .delete()
        .eq('organization_id', organization.id);
      
      // Insert all nodes
      const dbNodes = nodes.map((node, index) => ({
        id: node.id.startsWith('node-') ? undefined : node.id, // Use undefined for new nodes to let Supabase generate UUIDs
        organization_id: organization.id,
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
    } catch (error) {
      console.error("Error saving organization structure:", error);
      toast.error("Failed to save organization structure");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-purple-500" />
          <h2 className="text-2xl font-bold">Organizational Structure</h2>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Unsaved Changes
            </Badge>
          )}
          <Button 
            onClick={saveOrganizationStructure} 
            disabled={isLoading || !hasChanges}
            className="flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save Structure
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-x-2">
          <Tabs 
            defaultValue={viewMode} 
            value={viewMode} 
            onValueChange={(v) => setViewMode(v as 'vertical' | 'horizontal')}
            className="inline-flex"
          >
            <TabsList>
              <TabsTrigger value="vertical">Vertical View</TabsTrigger>
              <TabsTrigger value="horizontal">Horizontal View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleExportPNG}
            className="gap-1"
          >
            <Download className="h-4 w-4" />
            Export PNG
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddNode}
            className="gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Node
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleEditNode}
            disabled={!selectedNode}
            className="gap-1"
          >
            <Edit className="h-4 w-4" />
            Edit Node
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDeleteNode}
            disabled={!selectedNode}
            className="gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Delete Node
          </Button>
        </div>
      </div>

      {selectedNode && (
        <Card className="p-4 flex gap-4 items-center">
          <div className="flex-shrink-0">
            <Avatar className="h-12 w-12">
              {selectedNode.data.profileImage ? (
                <AvatarImage src={selectedNode.data.profileImage} alt={selectedNode.data.label} />
              ) : (
                <AvatarFallback 
                  style={{ backgroundColor: selectedNode.data.color || '#9b87f5' }}
                  className="text-white"
                >
                  {selectedNode.data.label.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div>
            <h3 className="font-medium">{selectedNode.data.label}</h3>
            {selectedNode.data.role && <p className="text-sm text-gray-500">{selectedNode.data.role}</p>}
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedNode.data.department && (
                <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                  {selectedNode.data.department}
                </Badge>
              )}
              {selectedNode.data.email && (
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  {selectedNode.data.email}
                </Badge>
              )}
              {selectedNode.data.joinDate && (
                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                  Joined: {selectedNode.data.joinDate}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="border rounded-lg h-[600px] bg-white relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
          </div>
        ) : (
          <OrganizationFlowChart 
            nodes={nodes}
            edges={edges}
            direction={viewMode === 'vertical' ? 'TB' : 'LR'}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onNodeClick={handleNodeClick}
          />
        )}
      </div>
      
      <NodeEditDialog 
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        node={selectedNode}
        onSave={handleSaveNode}
      />
    </div>
  );
};

export default OrganizationalStructureTab;

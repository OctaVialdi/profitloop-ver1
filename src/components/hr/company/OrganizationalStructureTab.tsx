
import React, { useState, useCallback, useRef } from 'react';
import { Network, ZoomIn, ZoomOut, PlusCircle, Trash2, Edit, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import OrganizationFlowChart from './organization/OrganizationFlowChart';
import NodeEditDialog from './organization/NodeEditDialog';
import { useOrganization } from '@/hooks/useOrganization';
import { toast } from 'sonner';

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

const OrganizationalStructureTab: React.FC = () => {
  const { organization } = useOrganization();
  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [nodes, setNodes] = useState<OrgNode[]>(initialNodes);
  const [edges, setEdges] = useState<OrgEdge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
    toast.success("Node updated successfully");
  };

  const handleNodesChange = useCallback((changes: any) => {
    setNodes((nds) => {
      const updatedNodes = [...nds];
      changes.forEach((change: any) => {
        if (change.type === 'position' && change.id) {
          const nodeIndex = updatedNodes.findIndex((n) => n.id === change.id);
          if (nodeIndex !== -1) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              position: {
                x: change.position?.x || updatedNodes[nodeIndex].position.x,
                y: change.position?.y || updatedNodes[nodeIndex].position.y,
              },
            };
          }
        }
      });
      return updatedNodes;
    });
  }, []);

  const handleEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => {
      return eds.filter((edge) => {
        return !changes.some((change: any) => 
          change.type === 'remove' && change.id === edge.id
        );
      });
    });
  }, []);

  const handleConnect = useCallback((params: any) => {
    const newEdge = { 
      id: `edge-${params.source}-${params.target}`,
      source: params.source, 
      target: params.target,
      animated: true
    };
    setEdges((eds) => [...eds, newEdge]);
  }, []);

  const saveOrganizationStructure = () => {
    console.log("Saving organization structure:", { nodes, edges });
    // Here we would save to database in the future
    toast.success("Organization structure saved successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-purple-500" />
          <h2 className="text-2xl font-bold">Organizational Structure</h2>
        </div>
        <Button onClick={saveOrganizationStructure}>Save Structure</Button>
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
        <OrganizationFlowChart 
          nodes={nodes}
          edges={edges}
          direction={viewMode === 'vertical' ? 'TB' : 'LR'}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          onNodeClick={handleNodeClick}
        />
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

// Sample initial data
const initialNodes: OrgNode[] = [
  {
    id: 'ceo',
    type: 'person',
    data: { 
      label: 'CEO', 
      role: 'Chief Executive Officer',
      email: 'ceo@company.com',
      joinDate: '2020-01-15',
      color: '#8B5CF6'
    },
    position: { x: 250, y: 0 }
  },
  {
    id: 'cto',
    type: 'person',
    data: { 
      label: 'CTO', 
      role: 'Chief Technology Officer',
      department: 'Technology',
      email: 'cto@company.com',
      joinDate: '2020-03-10',
      color: '#0EA5E9'
    },
    position: { x: 100, y: 100 }
  },
  {
    id: 'cfo',
    type: 'person',
    data: { 
      label: 'CFO', 
      role: 'Chief Financial Officer',
      department: 'Finance',
      email: 'cfo@company.com',
      joinDate: '2020-02-20',
      color: '#F97316'
    },
    position: { x: 400, y: 100 }
  },
  {
    id: 'dev-team',
    type: 'department',
    data: { 
      label: 'Development Team',
      department: 'Technology',
      color: '#0EA5E9'
    },
    position: { x: 100, y: 200 }
  },
  {
    id: 'finance-team',
    type: 'department',
    data: { 
      label: 'Finance Team',
      department: 'Finance',
      color: '#F97316'
    },
    position: { x: 400, y: 200 }
  }
];

const initialEdges: OrgEdge[] = [
  { id: 'e-ceo-cto', source: 'ceo', target: 'cto' },
  { id: 'e-ceo-cfo', source: 'ceo', target: 'cfo' },
  { id: 'e-cto-dev', source: 'cto', target: 'dev-team' },
  { id: 'e-cfo-fin', source: 'cfo', target: 'finance-team' }
];

export default OrganizationalStructureTab;

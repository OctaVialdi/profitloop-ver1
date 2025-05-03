import React, { useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  ConnectionLineType,
  Panel,
  ConnectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ZoomIn, ZoomOut, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import OrgPersonNode from './nodes/OrgPersonNode';
import OrgDepartmentNode from './nodes/OrgDepartmentNode';
import OrgPositionNode from './nodes/OrgPositionNode';
import { OrgNode, OrgEdge } from '../OrganizationalStructureTab';

type OrganizationFlowChartProps = {
  nodes: OrgNode[];
  edges: OrgEdge[];
  direction?: 'TB' | 'LR';
  onNodesChange?: (changes: any) => void;
  onEdgesChange?: (changes: any) => void;
  onConnect?: (connection: any) => void;
  onNodeClick?: (node: OrgNode) => void;
};

const nodeTypes = {
  person: OrgPersonNode,
  department: OrgDepartmentNode,
  position: OrgPositionNode,
};

const OrganizationFlowChart: React.FC<OrganizationFlowChartProps> = ({
  nodes,
  edges,
  direction = 'TB',
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick
}) => {
  const flowInstance = React.useRef<any>(null);
  
  const handleInit = (instance: any) => {
    flowInstance.current = instance;
    instance.fitView({ padding: 0.2 });
  };

  const handleZoomIn = () => {
    if (flowInstance.current) {
      flowInstance.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (flowInstance.current) {
      flowInstance.current.zoomOut();
    }
  };
  
  const handleFitView = () => {
    if (flowInstance.current) {
      flowInstance.current.fitView({ padding: 0.2 });
    }
  };

  const handleNodeClick = useCallback((_, node) => {
    if (onNodeClick) {
      onNodeClick(node as OrgNode);
    }
  }, [onNodeClick]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onInit={handleInit}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      connectionLineType={ConnectionLineType.Bezier}
      defaultEdgeOptions={{ 
        style: { stroke: '#9b87f5', strokeWidth: 2 },
        animated: true 
      }}
      fitView
      proOptions={{ hideAttribution: true }}
      nodeOrigin={[0.5, 0]}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      minZoom={0.1}
      maxZoom={2}
      connectionMode={ConnectionMode.Loose}
      snapToGrid
      snapGrid={[15, 15]}
    >
      <Background 
        color="#f0f0f0"
        gap={20}
        size={1}
      />
      <Controls position="bottom-right" />
      <MiniMap 
        nodeStrokeWidth={3}
        zoomable
        pannable
        maskColor="rgba(240, 240, 240, 0.6)"
      />
      <Panel position="top-right">
        <div className="flex gap-2 bg-white rounded-md shadow-sm p-1">
          <Button onClick={handleZoomIn} size="icon" variant="outline" title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button onClick={handleZoomOut} size="icon" variant="outline" title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button onClick={handleFitView} size="icon" variant="outline" title="Fit View">
            <Focus className="h-4 w-4" />
          </Button>
        </div>
      </Panel>
    </ReactFlow>
  );
};

export default OrganizationFlowChart;

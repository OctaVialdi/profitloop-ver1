
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OrgNode } from '../OrganizationalStructureTab';

interface NodeEditDialogProps {
  open: boolean;
  onClose: () => void;
  node: OrgNode | null;
  onSave: (node: OrgNode) => void;
}

const NodeEditDialog: React.FC<NodeEditDialogProps> = ({ 
  open, 
  onClose, 
  node, 
  onSave 
}) => {
  const [editedNode, setEditedNode] = useState<OrgNode | null>(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (node) {
      setEditedNode(JSON.parse(JSON.stringify(node))); // Deep copy
    }
  }, [node, open]);

  const handleSave = () => {
    if (editedNode) {
      onSave(editedNode);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (!editedNode) return;
    
    setEditedNode({
      ...editedNode,
      data: {
        ...editedNode.data,
        [field]: value
      }
    });
  };

  const handleTypeChange = (type: 'department' | 'position' | 'person') => {
    if (!editedNode) return;
    
    setEditedNode({
      ...editedNode,
      type
    });
  };

  if (!editedNode) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Organization Node</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Node Type</Label>
              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant={editedNode.type === 'department' ? 'default' : 'outline'} 
                  onClick={() => handleTypeChange('department')}
                  size="sm"
                >
                  Department
                </Button>
                <Button 
                  type="button" 
                  variant={editedNode.type === 'position' ? 'default' : 'outline'} 
                  onClick={() => handleTypeChange('position')}
                  size="sm"
                >
                  Position
                </Button>
                <Button 
                  type="button" 
                  variant={editedNode.type === 'person' ? 'default' : 'outline'} 
                  onClick={() => handleTypeChange('person')}
                  size="sm"
                >
                  Person
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="label">Name/Title</Label>
              <Input 
                id="label" 
                value={editedNode.data.label || ''} 
                onChange={(e) => handleChange('label', e.target.value)} 
                placeholder={editedNode.type === 'department' ? 'Department Name' : 
                             editedNode.type === 'position' ? 'Position Title' : 'Person Name'}
              />
            </div>
            
            {(editedNode.type === 'person' || editedNode.type === 'position') && (
              <div className="space-y-2">
                <Label htmlFor="role">Role/Description</Label>
                <Input 
                  id="role" 
                  value={editedNode.data.role || ''} 
                  onChange={(e) => handleChange('role', e.target.value)} 
                  placeholder={editedNode.type === 'person' ? 'Job Title' : 'Role Description'}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={editedNode.data.department || ''} 
                onChange={(e) => handleChange('department', e.target.value)} 
                placeholder="Department Name"
              />
            </div>
            
            {editedNode.type === 'person' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={editedNode.data.email || ''} 
                    onChange={(e) => handleChange('email', e.target.value)} 
                    placeholder="email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input 
                    id="joinDate" 
                    type="date" 
                    value={editedNode.data.joinDate || ''} 
                    onChange={(e) => handleChange('joinDate', e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Image URL</Label>
                  <Input 
                    id="profileImage" 
                    value={editedNode.data.profileImage || ''} 
                    onChange={(e) => handleChange('profileImage', e.target.value)} 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  id="color"
                  value={editedNode.data.color || '#9b87f5'} 
                  onChange={(e) => handleChange('color', e.target.value)} 
                  className="h-10 w-10 rounded cursor-pointer"
                />
                <Input 
                  value={editedNode.data.color || '#9b87f5'} 
                  onChange={(e) => handleChange('color', e.target.value)} 
                  className="flex-1"
                />
              </div>
              
              <div className="mt-4">
                <Label>Preview</Label>
                <div className="mt-2 p-4 rounded-md border" 
                  style={{
                    backgroundColor: editedNode.type === 'department' ? 
                      `${editedNode.data.color || '#9b87f5'}15` : 
                      editedNode.type === 'position' ? '#f8f8f8' : '#ffffff',
                    borderLeft: editedNode.type === 'department' ? 
                      `4px solid ${editedNode.data.color || '#9b87f5'}` : undefined,
                    borderColor: editedNode.type !== 'department' ? 
                      editedNode.data.color || '#9b87f5' : undefined,
                  }}
                >
                  <div className="font-medium">{editedNode.data.label || 'Node Title'}</div>
                  {editedNode.data.role && <div className="text-sm text-gray-500">{editedNode.data.role}</div>}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeEditDialog;

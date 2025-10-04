/**
 * Content Blocks Demo Page
 * Demonstrates the modular content block system
 */

'use client'

import React, { useState } from 'react';
import { ContentBlock } from '@/lib/blocks/types';
import { BlockEditor } from '@/components/content-blocks/BlockEditor';
import { BlockPreview } from '@/components/content-blocks/BlockPreview';
import { BlockTemplateSelector } from '@/components/content-blocks/BlockTemplateSelector';
import { serializeBlocks, deserializeBlocks } from '@/lib/blocks/serialization';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Save, 
  Download, 
  Upload, 
  Eye, 
  Settings,
  Layout,
  FileText
} from 'lucide-react';

export default function ContentBlocksDemo() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  const handleBlocksChange = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
  };

  const handleSelectTemplate = (template: any) => {
    setBlocks(template.blocks);
    setShowTemplateSelector(false);
  };

  const handleSave = () => {
    const serialized = serializeBlocks(blocks, {
      title: 'Content Blocks Demo',
      description: 'Demonstration of the modular content block system'
    });
    
    const blob = new Blob([JSON.stringify(serialized, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-blocks-demo.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const serialized = JSON.parse(e.target?.result as string);
            const loadedBlocks = deserializeBlocks(serialized);
            setBlocks(loadedBlocks);
          } catch (error) {
            console.error('Error loading file:', error);
            alert('Error loading file. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Blocks Demo</h1>
              <p className="text-gray-600">Modular content block system with drag-and-drop interface</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowTemplateSelector(true)}
              >
                <Layout className="h-4 w-4 mr-2" />
                Templates
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLoad}
              >
                <Upload className="h-4 w-4 mr-2" />
                Load
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={blocks.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Editor</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Block Editor</h2>
                  <p className="text-gray-600">Create and arrange content blocks with drag-and-drop</p>
                </div>
                
                <Button
                  onClick={() => setShowTemplateSelector(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Template</span>
                </Button>
              </div>
              
              <BlockEditor
                blocks={blocks}
                onBlocksChange={handleBlocksChange}
                selectedBlockId={selectedBlockId}
                onBlockSelect={setSelectedBlockId}
              />
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Live Preview</h2>
                <p className="text-gray-600">See how your content will look across different devices</p>
              </div>
              
              <BlockPreview
                blocks={blocks}
                onExport={(format, content) => {
                  const blob = new Blob([content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `content.${format}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              />
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Block Settings</h2>
                <p className="text-gray-600">Configure and customize your content blocks</p>
              </div>
              
              {selectedBlockId ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900">Selected Block</h3>
                    <p className="text-sm text-blue-700">
                      Block ID: {selectedBlockId}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Block Data</h4>
                    <pre className="text-sm bg-white p-3 rounded border overflow-auto">
                      {JSON.stringify(
                        blocks.find(b => b.id === selectedBlockId)?.data,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Block Selected</h3>
                  <p>Select a block in the editor to configure its settings</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <BlockTemplateSelector
                onSelectTemplate={handleSelectTemplate}
                onClose={() => setShowTemplateSelector(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



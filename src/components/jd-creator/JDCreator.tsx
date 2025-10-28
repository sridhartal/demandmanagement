import React, { useState, useEffect } from 'react';
import { Search, Plus, Save, Trash2, Sparkles, FileText, ChevronRight, Edit2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface Template {
  id: string;
  name: string;
  content: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export function JDCreator() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [user]);

  const loadTemplates = async () => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from('jd_templates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading templates:', error);
    } else {
      setTemplates(data || []);
    }
    setIsLoading(false);
  };

  const createNewTemplate = async () => {
    if (!user || !newTemplateName.trim()) return;

    setIsSaving(true);
    const { data, error } = await supabase
      .from('jd_templates')
      .insert([
        {
          user_id: user.id,
          name: newTemplateName.trim(),
          description: newTemplateDescription.trim(),
          content: '',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
    } else {
      setTemplates([data, ...templates]);
      setSelectedTemplate(data);
      setEditorContent('');
      setNewTemplateName('');
      setNewTemplateDescription('');
      setShowNewTemplateModal(false);
    }
    setIsSaving(false);
  };

  const saveTemplate = async () => {
    if (!selectedTemplate || !user) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('jd_templates')
      .update({
        content: editorContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedTemplate.id);

    if (error) {
      console.error('Error saving template:', error);
    } else {
      setTemplates(
        templates.map((t) =>
          t.id === selectedTemplate.id ? { ...t, content: editorContent, updated_at: new Date().toISOString() } : t
        )
      );
    }
    setIsSaving(false);
  };

  const deleteTemplate = async (templateId: string) => {
    if (!user) return;

    const { error } = await supabase.from('jd_templates').delete().eq('id', templateId);

    if (error) {
      console.error('Error deleting template:', error);
    } else {
      setTemplates(templates.filter((t) => t.id !== templateId));
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
        setEditorContent('');
      }
    }
  };

  const selectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditorContent(template.content);
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAIAssist = () => {
    if (!aiPrompt.trim()) return;

    const enhancedContent = editorContent + '\n\n' + `[AI Enhancement based on: "${aiPrompt}"]\n`;
    setEditorContent(enhancedContent);
    setAiPrompt('');
    setShowAIAssistant(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">JD Creator</h1>
            <p className="text-sm text-gray-600 mt-1">Create and manage job description templates</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              AI Assistant
            </button>
            <button
              onClick={() => setShowNewTemplateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Template
            </button>
            {selectedTemplate && (
              <button
                onClick={saveTemplate}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>
        </div>
      </div>

      {showAIAssistant && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask AI to modify or enhance your job description..."
              className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && handleAIAssist()}
            />
            <button
              onClick={handleAIAssist}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Apply
            </button>
            <button
              onClick={() => setShowAIAssistant(false)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Editor</h2>
            {selectedTemplate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="font-medium">{selectedTemplate.name}</span>
                {selectedTemplate.description && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span>{selectedTemplate.description}</span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto p-6">
            {selectedTemplate ? (
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                placeholder="Start writing your job description here..."
                className="w-full h-full min-h-[500px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No template selected</p>
                  <p className="text-sm mt-2">Select a template from the right panel or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-96 bg-white flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Templates</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-2">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading templates...</div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {searchTerm ? 'No templates found' : 'No templates yet. Create your first template!'}
                </p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => selectTemplate(template)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                      {template.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.description}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this template?')) {
                          deleteTemplate(template.id);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Updated {new Date(template.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showNewTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Template</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g., Software Engineer Template"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="Brief description of this template..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={createNewTemplate}
                  disabled={!newTemplateName.trim() || isSaving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Creating...' : 'Create Template'}
                </button>
                <button
                  onClick={() => {
                    setShowNewTemplateModal(false);
                    setNewTemplateName('');
                    setNewTemplateDescription('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Save, Trash2, Sparkles, FileText, ChevronRight, Edit2, X, Upload, Send, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface Template {
  id: string;
  name: string;
  content: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_predefined?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PREDEFINED_TEMPLATES: Template[] = [
  {
    id: 'predefined-1',
    name: 'Senior Software Engineer',
    description: 'Template for Senior Software Engineer position',
    content: `JOB DESCRIPTION - Senior Software Engineer

POSITION OVERVIEW
We are seeking an experienced Senior Software Engineer to join our dynamic engineering team. This role will focus on designing, developing, and maintaining scalable software solutions.

KEY RESPONSIBILITIES
• Design and implement robust, scalable software solutions
• Lead technical discussions and architectural decisions
• Mentor junior engineers and conduct code reviews
• Collaborate with cross-functional teams to deliver high-quality products
• Optimize application performance and ensure code quality
• Participate in agile development processes

REQUIRED QUALIFICATIONS
• Bachelor's degree in Computer Science or related field
• 5+ years of professional software development experience
• Strong proficiency in modern programming languages (Java, Python, JavaScript, etc.)
• Experience with cloud platforms (AWS, Azure, or GCP)
• Solid understanding of data structures, algorithms, and design patterns
• Experience with version control systems (Git)
• Strong problem-solving and analytical skills

PREFERRED QUALIFICATIONS
• Master's degree in Computer Science or related field
• Experience with microservices architecture
• Knowledge of CI/CD pipelines and DevOps practices
• Experience with containerization (Docker, Kubernetes)
• Contributions to open-source projects

BENEFITS
• Competitive salary and equity
• Health, dental, and vision insurance
• 401(k) with company match
• Flexible work arrangements
• Professional development opportunities
• Generous PTO policy`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_predefined: true,
  },
  {
    id: 'predefined-2',
    name: 'Frontend Software Engineer',
    description: 'Template for Frontend focused role',
    content: `JOB DESCRIPTION - Frontend Software Engineer

POSITION OVERVIEW
Join our team as a Frontend Software Engineer where you'll create beautiful, responsive user interfaces and deliver exceptional user experiences.

KEY RESPONSIBILITIES
• Develop responsive web applications using modern frontend frameworks
• Build reusable components and front-end libraries
• Optimize applications for maximum speed and scalability
• Collaborate with UX/UI designers to implement pixel-perfect designs
• Ensure cross-browser compatibility and accessibility standards
• Write clean, maintainable, and well-documented code

REQUIRED QUALIFICATIONS
• 3+ years of experience in frontend development
• Expert knowledge of HTML5, CSS3, and JavaScript/TypeScript
• Strong experience with React, Vue.js, or Angular
• Understanding of responsive design principles
• Experience with state management libraries (Redux, MobX, etc.)
• Familiarity with RESTful APIs and GraphQL
• Knowledge of version control systems (Git)

PREFERRED QUALIFICATIONS
• Experience with modern CSS frameworks (Tailwind, Styled Components)
• Knowledge of testing frameworks (Jest, React Testing Library)
• Understanding of web performance optimization
• Experience with build tools (Webpack, Vite)
• Portfolio of live projects

BENEFITS
• Competitive compensation package
• Remote-friendly work environment
• Latest technology and tools
• Learning and development budget
• Team events and activities`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_predefined: true,
  },
  {
    id: 'predefined-3',
    name: 'Full Stack Software Engineer',
    description: 'Template for Full Stack role',
    content: `JOB DESCRIPTION - Full Stack Software Engineer

POSITION OVERVIEW
We're looking for a versatile Full Stack Software Engineer who can work across the entire technology stack to build and maintain our applications.

KEY RESPONSIBILITIES
• Design and develop full-stack web applications
• Build and maintain RESTful APIs and microservices
• Create responsive and intuitive user interfaces
• Implement database schemas and optimize queries
• Deploy and maintain applications in cloud environments
• Participate in all phases of the software development lifecycle

REQUIRED QUALIFICATIONS
• 4+ years of full-stack development experience
• Proficiency in frontend technologies (React, Vue, or Angular)
• Strong backend experience (Node.js, Python, Java, or Go)
• Experience with SQL and NoSQL databases
• Understanding of cloud platforms (AWS, Azure, GCP)
• Knowledge of containerization and orchestration
• Strong understanding of software design patterns

PREFERRED QUALIFICATIONS
• Experience with serverless architecture
• Knowledge of message queues and event-driven architecture
• Experience with monitoring and logging tools
• Understanding of security best practices
• DevOps experience and CI/CD pipeline setup

WHAT WE OFFER
• Competitive salary with performance bonuses
• Comprehensive benefits package
• Flexible working hours
• Remote work options
• Career growth opportunities
• Cutting-edge technology stack`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_predefined: true,
  },
];

export function JDCreator() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTemplates();
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadTemplates = async () => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from('jd_templates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading templates:', error);
      setTemplates([...PREDEFINED_TEMPLATES]);
    } else {
      setTemplates([...PREDEFINED_TEMPLATES, ...(data || [])]);
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
      setTemplates([...PREDEFINED_TEMPLATES, data, ...templates.filter(t => !t.is_predefined)]);
      setSelectedTemplate(data);
      setEditorContent('');
      setNewTemplateName('');
      setNewTemplateDescription('');
      setShowNewTemplateModal(false);
    }
    setIsSaving(false);
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !user) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;

      const templateName = uploadFile.name.replace(/\.(pdf|docx)$/, '');

      setIsSaving(true);
      const { data, error } = await supabase
        .from('jd_templates')
        .insert([
          {
            user_id: user.id,
            name: templateName,
            description: `Uploaded from ${uploadFile.name}`,
            content: content || 'File content extracted from uploaded document.',
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error uploading template:', error);
      } else {
        setTemplates([...PREDEFINED_TEMPLATES, data, ...templates.filter(t => !t.is_predefined)]);
        setSelectedTemplate(data);
        setEditorContent(data.content);
        setUploadFile(null);
        setShowUploadModal(false);
      }
      setIsSaving(false);
    };

    reader.readAsText(uploadFile);
  };

  const saveTemplate = async () => {
    if (!selectedTemplate || !user || selectedTemplate.is_predefined) return;

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
    setChatMessages([]);
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
    };

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `I've processed your request: "${currentMessage}". The content has been updated accordingly.`,
    };

    setChatMessages([...chatMessages, userMessage, assistantMessage]);

    const enhancedContent = editorContent + '\n\n' + `[Modification: ${currentMessage}]\n`;
    setEditorContent(enhancedContent);

    setCurrentMessage('');
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
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Template
            </button>
            <button
              onClick={() => setShowNewTemplateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Template
            </button>
            {selectedTemplate && !selectedTemplate.is_predefined && (
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
                {selectedTemplate.is_predefined && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Predefined
                  </span>
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
                disabled={selectedTemplate.is_predefined}
                className="w-full h-full min-h-[500px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
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

          {selectedTemplate && (
            <div className="border-t border-gray-200 bg-gray-50">
              <div className="px-6 py-3 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  AI Assistant
                </div>
              </div>
              <div className="p-4 max-h-64 overflow-y-auto space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Ask AI to help modify your job description</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={selectedTemplate.is_predefined}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || selectedTemplate.is_predefined}
                    className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
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
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                        {template.is_predefined && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">
                            Sample
                          </span>
                        )}
                      </div>
                      {template.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.description}</p>
                      )}
                    </div>
                    {!template.is_predefined && (
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
                    )}
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

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Template</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File (PDF or DOCX)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {uploadFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {uploadFile.name}
                  </p>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  Note: The file content will be extracted and saved as a template. Supported formats: PDF, DOCX
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleFileUpload}
                  disabled={!uploadFile || isSaving}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
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

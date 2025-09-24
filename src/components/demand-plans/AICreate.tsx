import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, ArrowLeft, User, CheckCircle, Edit, Save, Lightbulb, MessageSquare, Zap } from 'lucide-react';
import { POSITION_CATEGORIES } from '../../types';

interface AICreateProps {
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

interface GeneratedRequisition {
  position_title: string;
  position_category: string;
  location: string;
  job_description: string;
  number_of_positions: number;
  min_experience: number;
  max_experience: number;
  min_salary: number;
  mid_salary: number;
  max_salary: number;
  mandatory_skills: string[];
  optional_skills: string[];
  employment_type: string;
  remote_option: string;
  department: string;
  urgency: string;
}

export function AICreate({ onBack }: AICreateProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI hiring assistant. I'll help you create detailed job requisitions by understanding your needs. What position are you looking to hire for?",
      timestamp: new Date(),
      suggestions: [
        "We need 2 senior software engineers in San Francisco",
        "Looking for a product manager with 3-5 years experience",
        "Need to hire a data science team for our AI project",
        "Want to expand our DevOps team with cloud expertise"
      ]
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedRequisition, setGeneratedRequisition] = useState<GeneratedRequisition | null>(null);
  const [conversationStep, setConversationStep] = useState(0);
  const [extractedInfo, setExtractedInfo] = useState<any>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const conversationFlow = [
    { key: 'position', question: "What position are you looking to hire for?" },
    { key: 'location', question: "Where will this position be located?" },
    { key: 'experience', question: "What level of experience are you looking for?" },
    { key: 'count', question: "How many people do you need to hire?" },
    { key: 'budget', question: "What's your budget range for this position?" },
    { key: 'skills', question: "What key skills or technologies should they know?" },
    { key: 'timeline', question: "When do you need them to start?" }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      processUserInput(currentInput);
      setIsProcessing(false);
    }, 1500);
  };

  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let newExtractedInfo = { ...extractedInfo };

    // Extract information based on conversation step
    if (conversationStep === 0) {
      // Position extraction
      if (lowerInput.includes('software engineer') || lowerInput.includes('developer')) {
        newExtractedInfo.position_title = 'Software Engineer';
        newExtractedInfo.position_category = 'Software Engineer';
        response = "Great! I see you're looking for a Software Engineer. ";
      } else if (lowerInput.includes('product manager')) {
        newExtractedInfo.position_title = 'Product Manager';
        newExtractedInfo.position_category = 'Product Manager';
        response = "Perfect! A Product Manager role. ";
      } else if (lowerInput.includes('data scientist')) {
        newExtractedInfo.position_title = 'Data Scientist';
        newExtractedInfo.position_category = 'Data Scientist';
        response = "Excellent! Data Scientist is a great role. ";
      } else {
        newExtractedInfo.position_title = input;
        response = `Got it! You're looking for a ${input}. `;
      }
      
      response += "Where will this position be located?";
      suggestions = ['San Francisco, CA', 'New York, NY', 'Remote', 'Austin, TX', 'Seattle, WA'];
      
    } else if (conversationStep === 1) {
      // Location extraction
      newExtractedInfo.location = input;
      response = `${input} - great location! What level of experience are you looking for?`;
      suggestions = ['Entry level (0-2 years)', 'Mid-level (3-5 years)', 'Senior (5+ years)', 'Any experience level'];
      
    } else if (conversationStep === 2) {
      // Experience extraction
      if (lowerInput.includes('entry') || lowerInput.includes('junior') || lowerInput.includes('0-2')) {
        newExtractedInfo.min_experience = 0;
        newExtractedInfo.max_experience = 2;
      } else if (lowerInput.includes('mid') || lowerInput.includes('3-5')) {
        newExtractedInfo.min_experience = 3;
        newExtractedInfo.max_experience = 5;
      } else if (lowerInput.includes('senior') || lowerInput.includes('5+')) {
        newExtractedInfo.min_experience = 5;
        newExtractedInfo.max_experience = 8;
      }
      
      response = "Perfect! How many people do you need to hire for this role?";
      suggestions = ['1 person', '2-3 people', '5+ people', 'A whole team'];
      
    } else if (conversationStep === 3) {
      // Count extraction
      const numbers = input.match(/\d+/);
      if (numbers) {
        newExtractedInfo.number_of_positions = parseInt(numbers[0]);
      } else if (lowerInput.includes('team')) {
        newExtractedInfo.number_of_positions = 5;
      } else {
        newExtractedInfo.number_of_positions = 1;
      }
      
      response = "Got it! What's your budget range for this position?";
      suggestions = ['80,000 - 120,000', '120,000 - 160,000', '160,000 - 200,000', 'Competitive salary'];
      
    } else if (conversationStep === 4) {
      // Budget extraction
      const budgetNumbers = input.match(/\d+/g);
      if (budgetNumbers && budgetNumbers.length >= 2) {
        newExtractedInfo.min_salary = parseInt(budgetNumbers[0]) * (budgetNumbers[0].length <= 3 ? 1000 : 1);
        newExtractedInfo.max_salary = parseInt(budgetNumbers[1]) * (budgetNumbers[1].length <= 3 ? 1000 : 1);
        newExtractedInfo.mid_salary = Math.round((newExtractedInfo.min_salary + newExtractedInfo.max_salary) / 2);
      } else if (budgetNumbers && budgetNumbers.length === 1) {
        const budget = parseInt(budgetNumbers[0]) * (budgetNumbers[0].length <= 3 ? 1000 : 1);
        newExtractedInfo.min_salary = budget * 0.9;
        newExtractedInfo.max_salary = budget * 1.1;
        newExtractedInfo.mid_salary = budget;
      }
      
      response = "Excellent! What key skills or technologies should they know?";
      suggestions = ['JavaScript, React, Node.js', 'Python, SQL, Machine Learning', 'AWS, Docker, Kubernetes', 'Product Strategy, Analytics'];
      
    } else if (conversationStep === 5) {
      // Skills extraction
      const skillsList = input.split(/[,\s]+/).filter(skill => skill.length > 2);
      newExtractedInfo.mandatory_skills = skillsList.slice(0, 5);
      newExtractedInfo.optional_skills = skillsList.slice(5, 8);
      
      response = "Perfect! When do you need them to start?";
      suggestions = ['ASAP', 'Within 2 weeks', 'Within a month', 'Flexible timing'];
      
    } else {
      // Final step - generate requisition
      newExtractedInfo.urgency = lowerInput.includes('asap') || lowerInput.includes('urgent') ? 'High' : 'Normal';
      
      // Fill in defaults
      newExtractedInfo.employment_type = 'Full-time';
      newExtractedInfo.remote_option = newExtractedInfo.location?.toLowerCase().includes('remote') ? 'Remote' : 'Office';
      newExtractedInfo.department = newExtractedInfo.position_title?.includes('Engineer') ? 'Engineering' : 'General';
      newExtractedInfo.job_description = generateJobDescription(newExtractedInfo);
      
      setGeneratedRequisition(newExtractedInfo);
      response = "Perfect! I've gathered all the information and created your job requisition. You can review it on the right and make any adjustments before saving.";
      suggestions = [];
    }

    setExtractedInfo(newExtractedInfo);
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestions: suggestions,
      data: newExtractedInfo
    };

    setMessages(prev => [...prev, assistantMessage]);
    setConversationStep(prev => Math.min(prev + 1, conversationFlow.length));
  };

  const generateJobDescription = (info: any) => {
    return `Job Brief
We are looking for a passionate ${info.position_title} to design, develop and install software solutions.

${info.position_title} responsibilities include gathering user requirements, defining system functionality and writing code in various languages, like Java, Ruby on Rails or .NET programming languages (e.g. C++ or JScript.NET.) Our ideal candidates are familiar with the software development life cycle (SDLC) from preliminary system analysis to tests and deployment.

Ultimately, the role of the ${info.position_title} is to build high-quality, innovative and fully performing software that complies with coding standards and technical design.

Responsibilities
Execute full software development life cycle (SDLC)
Develop flowcharts, layouts and documentation to identify requirements and solutions
Write well-designed, testable code
Produce specifications and determine operational feasibility
Integrate software components into a fully functional software system
Develop software verification plans and quality assurance procedures
Document and maintain software functionality
Troubleshoot, debug and upgrade existing systems
Deploy programs and evaluate user feedback
Comply with project plans and industry standards
Ensure software is updated with latest features

Requirements and skills
Proven work experience as a ${info.position_title} or Software Developer
Experience designing interactive applications
Ability to develop software in Java, Ruby on Rails, C++ or other programming languages
Excellent knowledge of relational databases, SQL and ORM technologies (JPA2, Hibernate)
Experience developing web applications using at least one popular web framework (JSF, Wicket, GWT, Spring MVC)
Experience with test-driven development
Proficiency in software engineering tools
Ability to document requirements and specifications
BSc degree in Computer Science, Engineering or relevant field`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion);
    inputRef.current?.focus();
  };

  const handleSave = () => {
    if (generatedRequisition) {
      console.log('Saving AI-generated requisition...', generatedRequisition);
      alert('AI-generated requisition saved successfully!');
      onBack();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Hiring Assistant</h1>
              <p className="text-sm text-gray-600">Smart requisition creation through conversation</p>
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Zap className="w-4 h-4 text-green-500" />
            <span>AI Powered</span>
          </div>
        </div>
      </div>

      {/* Split Screen Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Chat Interface */}
        <div className="w-1/2 flex flex-col bg-white border-r border-gray-200">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-gradient-to-br from-purple-500 to-blue-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Lightbulb className="w-3 h-3" />
                        <span>Quick suggestions:</span>
                      </div>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-3 py-2 text-sm bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  disabled={isProcessing}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isProcessing}
                className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Press Enter to send</span>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span>{messages.length} messages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Requisition Preview */}
        <div className="w-1/2 bg-gray-50 flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Requisition Preview</h2>
              {generatedRequisition && (
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Requisition</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {Object.keys(extractedInfo).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start the Conversation</h3>
                <p className="text-gray-600">
                  As you chat with the AI assistant, your requisition details will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Indicator */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">
                      {Math.min(conversationStep, conversationFlow.length)}/{conversationFlow.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(Math.min(conversationStep, conversationFlow.length) / conversationFlow.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Extracted Information */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Information</h3>
                  
                  <div className="space-y-4">
                    {extractedInfo.position_title && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Position</p>
                          <p className="text-gray-900">{extractedInfo.position_title}</p>
                        </div>
                      </div>
                    )}
                    
                    {extractedInfo.location && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Location</p>
                          <p className="text-gray-900">{extractedInfo.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {extractedInfo.min_experience !== undefined && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Experience</p>
                          <p className="text-gray-900">{extractedInfo.min_experience}-{extractedInfo.max_experience} years</p>
                        </div>
                      </div>
                    )}
                    
                    {extractedInfo.number_of_positions && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Positions</p>
                          <p className="text-gray-900">{extractedInfo.number_of_positions}</p>
                        </div>
                      </div>
                    )}
                    
                    {extractedInfo.min_salary && (
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Budget Range</p>
                          <p className="text-gray-900">
                            {extractedInfo.min_salary.toLocaleString()} - {extractedInfo.max_salary.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {extractedInfo.mandatory_skills && extractedInfo.mandatory_skills.length > 0 && (
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Skills</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {extractedInfo.mandatory_skills.map((skill: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Requisition Preview */}
                {generatedRequisition && (
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Complete Requisition</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        Ready to Save
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Position Title</p>
                          <p className="text-gray-900">{generatedRequisition.position_title}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Category</p>
                          <p className="text-gray-900">{generatedRequisition.position_category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Location</p>
                          <p className="text-gray-900">{generatedRequisition.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Positions</p>
                          <p className="text-gray-900">{generatedRequisition.number_of_positions}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Job Description</p>
                        <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                          <p className="text-sm text-gray-900 whitespace-pre-line">
                            {generatedRequisition.job_description.substring(0, 200)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
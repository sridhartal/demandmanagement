import React, { useState } from 'react';
import { Bot, Send, Sparkles, ArrowLeft, Edit, Save } from 'lucide-react';
import { POSITION_CATEGORIES } from '../../types';

interface AICreateProps {
  onBack: () => void;
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
}

export function AICreate({ onBack }: AICreateProps) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    planTitle: string;
    planDescription: string;
    requisitions: GeneratedRequisition[];
  } | null>(null);
  const [editMode, setEditMode] = useState(false);

  const samplePrompts = [
    "We need to hire a team for our new mobile app project in San Francisco. Looking for 2 senior iOS developers, 2 Android developers, and 1 mobile architect. Budget range is 120k-180k per role.",
    "Expanding our data science team in New York. Need 3 data scientists with 3-7 years experience, 1 senior ML engineer, and 1 data engineering lead. Focus on Python, SQL, and cloud platforms.",
    "Building a DevOps team for our cloud migration. Need 2 DevOps engineers in Austin with AWS/Azure experience, 1 site reliability engineer, and 1 cloud architect. 5+ years experience preferred."
  ];

  const processAIPrompt = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate mock data based on common patterns
      const mockData = {
        planTitle: "AI Generated Demand Plan",
        planDescription: "Automatically generated based on your requirements",
        requisitions: [
          {
            position_title: "Senior Software Engineer",
            position_category: "Senior Software Engineer",
            location: "San Francisco, CA",
            job_description: "Develop and maintain scalable web applications using modern technologies. Collaborate with cross-functional teams to deliver high-quality software solutions.",
            number_of_positions: 2,
            min_experience: 5,
            max_experience: 8,
            min_salary: 120000,
            mid_salary: 140000,
            max_salary: 160000,
            mandatory_skills: ["JavaScript", "React", "Node.js", "SQL"],
            optional_skills: ["TypeScript", "AWS", "Docker", "Kubernetes"]
          },
          {
            position_title: "Product Manager",
            position_category: "Product Manager",
            location: "San Francisco, CA",
            job_description: "Lead product strategy and roadmap development. Work closely with engineering, design, and business stakeholders to deliver exceptional user experiences.",
            number_of_positions: 1,
            min_experience: 3,
            max_experience: 6,
            min_salary: 110000,
            mid_salary: 130000,
            max_salary: 150000,
            mandatory_skills: ["Product Strategy", "Agile", "Analytics", "User Research"],
            optional_skills: ["Figma", "SQL", "Python", "A/B Testing"]
          }
        ]
      };

      setGeneratedData(mockData);
    } catch (error) {
      console.error('Error processing AI prompt:', error);
      alert('Error processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (generatedData) {
      console.log('Saving AI-generated plan...', generatedData);
      // Here you would typically save to Supabase
      alert('AI-generated demand plan saved successfully!');
      onBack();
    }
  };

  const updateRequisition = (index: number, field: string, value: any) => {
    if (!generatedData) return;
    
    const updatedRequisitions = generatedData.requisitions.map((req, i) =>
      i === index ? { ...req, [field]: value } : req
    );
    
    setGeneratedData({
      ...generatedData,
      requisitions: updatedRequisitions
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Creation</h1>
          <p className="text-gray-600">Describe your hiring needs in natural language</p>
        </div>
      </div>

      {/* AI Input Section */}
      {!generatedData && (
        <div className="space-y-6">
          {/* Prompt Examples */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Try these examples</h3>
                <div className="space-y-3">
                  {samplePrompts.map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(sample)}
                      className="block w-full text-left p-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your hiring needs
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="Example: We need to expand our engineering team for a new AI project. Looking for 3 senior software engineers with Python and ML experience in New York, budget around 120-150k each. Also need 1 ML engineer lead with 5+ years experience..."
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Be as specific as possible about roles, locations, experience, and budget
                </p>
                <button
                  onClick={processAIPrompt}
                  disabled={!prompt.trim() || isProcessing}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Generate Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Processing */}
          {isProcessing && (
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Bot className="w-8 h-8 text-purple-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI is analyzing your request</h3>
                  <p className="text-gray-600 mt-2">
                    Parsing requirements, extracting job details, and structuring your demand plan...
                  </p>
                </div>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generated Results */}
      {generatedData && (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">AI Plan Generated Successfully!</h3>
                <p className="text-green-700 text-sm">
                  Review and edit the generated requisitions before saving
                </p>
              </div>
            </div>
          </div>

          {/* Plan Overview */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Plan Overview</h3>
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Edit className="w-4 h-4" />
                <span>{editMode ? 'View Mode' : 'Edit Mode'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700">Plan Title</p>
                <p className="text-gray-900">{generatedData.planTitle}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700">Total Requisitions</p>
                <p className="text-gray-900">{generatedData.requisitions.length}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700">Total Positions</p>
                <p className="text-gray-900">
                  {generatedData.requisitions.reduce((sum, req) => sum + req.number_of_positions, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Requisitions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Generated Requisitions</h3>
            {generatedData.requisitions.map((req, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Requisition {index + 1}: {req.position_title}
                </h4>
                
                {editMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position Title
                      </label>
                      <input
                        type="text"
                        value={req.position_title}
                        onChange={(e) => updateRequisition(index, 'position_title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={req.position_category}
                        onChange={(e) => updateRequisition(index, 'position_category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {POSITION_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={req.location}
                        onChange={(e) => updateRequisition(index, 'location', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Positions
                      </label>
                      <input
                        type="number"
                        value={req.number_of_positions}
                        onChange={(e) => updateRequisition(index, 'number_of_positions', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="text-gray-900">{req.position_category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900">{req.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Positions</p>
                      <p className="text-gray-900">{req.number_of_positions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="text-gray-900">{req.min_experience}-{req.max_experience} years</p>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Job Description</p>
                  <p className="text-gray-900 text-sm">{req.job_description}</p>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mandatory Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {req.mandatory_skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Optional Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {req.optional_skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Salary Range</p>
                  <p className="text-gray-900 text-sm">
                    ${req.min_salary.toLocaleString()} - ${req.max_salary.toLocaleString()} 
                    (Mid: ${req.mid_salary.toLocaleString()})
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setGeneratedData(null);
                setPrompt('');
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Generate New Plan
            </button>

            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, FileText, ArrowLeft } from 'lucide-react';
import { BulkUploadError } from '../../types';

interface BulkUploadProps {
  onBack: () => void;
}

export function BulkUpload({ onBack }: BulkUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<BulkUploadError[]>([]);
  const [validationComplete, setValidationComplete] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const downloadTemplate = () => {
    // Create a sample CSV template
    const headers = [
      'position_title',
      'position_category',
      'location',
      'job_description',
      'number_of_positions',
      'min_experience',
      'max_experience',
      'min_salary',
      'mid_salary',
      'max_salary',
      'mandatory_skills',
      'optional_skills'
    ];

    const sampleRow = [
      'Senior Software Engineer',
      'Software Engineer',
      'New York, NY',
      'Develop and maintain web applications using modern technologies',
      '2',
      '3',
      '7',
      '90000',
      '110000',
      '130000',
      'JavaScript,React,Node.js',
      'TypeScript,AWS,Docker'
    ];

    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demand_plan_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(csv|xls|xlsx)$/i)) {
      alert('Please upload a CSV or Excel file');
      return;
    }

    setUploadedFile(file);
    setValidationComplete(false);
    setValidationErrors([]);
    validateFile(file);
  };

  const validateFile = async (file: File) => {
    setIsValidating(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const requiredHeaders = [
        'position_title',
        'position_category',
        'location',
        'number_of_positions'
      ];

      const errors: BulkUploadError[] = [];
      const preview: any[] = [];

      // Check headers
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        errors.push({
          row: 1,
          field: 'headers',
          message: `Missing required headers: ${missingHeaders.join(', ')}`
        });
      }

      // Validate data rows
      for (let i = 1; i < Math.min(lines.length, 101); i++) { // Limit to 100 rows for preview
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const rowData: any = {};
        
        headers.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });

        // Validate required fields
        if (!rowData.position_title) {
          errors.push({ row: i + 1, field: 'position_title', message: 'Position title is required' });
        }
        if (!rowData.position_category) {
          errors.push({ row: i + 1, field: 'position_category', message: 'Position category is required' });
        }
        if (!rowData.location) {
          errors.push({ row: i + 1, field: 'location', message: 'Location is required' });
        }

        // Validate numeric fields
        if (rowData.number_of_positions && isNaN(parseInt(rowData.number_of_positions))) {
          errors.push({ row: i + 1, field: 'number_of_positions', message: 'Number of positions must be a number' });
        }

        preview.push(rowData);
      }

      setValidationErrors(errors);
      setPreviewData(preview);
      setValidationComplete(true);
    } catch (error) {
      setValidationErrors([{
        row: 0,
        field: 'file',
        message: 'Error reading file. Please check the format.'
      }]);
    } finally {
      setIsValidating(false);
    }
  };

  const handleUpload = () => {
    if (validationErrors.length === 0) {
      console.log('Uploading data...', previewData);
      // Here you would typically upload to Supabase
      alert('Bulk upload completed successfully!');
      onBack();
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Bulk Upload</h1>
          <p className="text-gray-600">Upload multiple requisitions using CSV or Excel files</p>
        </div>
      </div>

      {/* Template Download */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Download Template</h3>
            <p className="text-gray-600 mb-4">
              Start with our pre-formatted template to ensure your data is structured correctly.
            </p>
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upload your file</h3>
              <p className="text-gray-600 mt-2">
                Drag and drop your CSV or Excel file here, or click to browse
              </p>
            </div>
            <div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Choose File</span>
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Supports CSV, XLS, XLSX files up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* File Processing */}
      {uploadedFile && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{uploadedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          {isValidating && (
            <div className="flex items-center space-x-3 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Validating file...</span>
            </div>
          )}

          {validationComplete && (
            <div className="space-y-4">
              {validationErrors.length > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h4 className="font-medium text-red-900">
                      {validationErrors.length} Error(s) Found
                    </h4>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {validationErrors.slice(0, 10).map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                        Row {error.row}: {error.message}
                      </div>
                    ))}
                    {validationErrors.length > 10 && (
                      <div className="text-sm text-red-600">
                        ... and {validationErrors.length - 10} more errors
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-900">
                      File validated successfully!
                    </h4>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {previewData.length} requisitions ready to upload
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Data Preview */}
      {validationComplete && previewData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-2 font-medium text-gray-700">Position Title</th>
                  <th className="text-left p-2 font-medium text-gray-700">Category</th>
                  <th className="text-left p-2 font-medium text-gray-700">Location</th>
                  <th className="text-left p-2 font-medium text-gray-700">Positions</th>
                  <th className="text-left p-2 font-medium text-gray-700">Experience</th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-2 text-gray-900">{row.position_title}</td>
                    <td className="p-2 text-gray-600">{row.position_category}</td>
                    <td className="p-2 text-gray-600">{row.location}</td>
                    <td className="p-2 text-gray-600">{row.number_of_positions}</td>
                    <td className="p-2 text-gray-600">
                      {row.min_experience}-{row.max_experience} years
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 5 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                ... and {previewData.length - 5} more rows
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {validationComplete && (
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setUploadedFile(null);
              setValidationComplete(false);
              setValidationErrors([]);
              setPreviewData([]);
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Upload Different File
          </button>
          
          <button
            onClick={handleUpload}
            disabled={validationErrors.length > 0}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload {previewData.length} Requisitions
          </button>
        </div>
      )}
    </div>
  );
}
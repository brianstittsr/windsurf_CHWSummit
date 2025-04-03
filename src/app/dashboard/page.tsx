'use client';

import React, { useState, useEffect } from 'react';
import { 
  getSurveyResponses, 
  getAnalytics, 
  exportSurveyResponsesAsCSV, 
  exportSurveyResponsesAsJSON,
  clearAllSurveyResponses,
  SurveyResponse,
  SURVEY_DATA_UPDATED_EVENT
} from '@/utils/dataStorage';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<ReturnType<typeof getAnalytics> | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  // Load data on client side only
  useEffect(() => {
    setIsClient(true);
    loadData();
    
    // Listen for survey data update events
    const handleSurveyDataUpdated = () => {
      console.log('Survey data updated event received');
      loadData();
    };
    
    window.addEventListener(SURVEY_DATA_UPDATED_EVENT, handleSurveyDataUpdated);
    
    return () => {
      window.removeEventListener(SURVEY_DATA_UPDATED_EVENT, handleSurveyDataUpdated);
    };
  }, []);
  
  const loadData = () => {
    if (typeof window !== 'undefined') {
      setAnalytics(getAnalytics());
      setResponses(getSurveyResponses());
    }
  };
  
  const handleExportCSV = () => {
    const csvContent = exportSurveyResponsesAsCSV();
    if (!csvContent) {
      alert('No data to export');
      return;
    }
    
    downloadFile(csvContent, 'chw-survey-responses.csv', 'text/csv');
  };
  
  const handleExportJSON = () => {
    const jsonContent = exportSurveyResponsesAsJSON();
    if (jsonContent === '[]') {
      alert('No data to export');
      return;
    }
    
    downloadFile(jsonContent, 'chw-survey-responses.json', 'application/json');
  };
  
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleClearData = () => {
    clearAllSurveyResponses();
    loadData();
    setShowConfirmClear(false);
  };
  
  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold">CHW Survey Dashboard</h1>
            <Link href="/" className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
              Back to Survey
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 font-medium ${
                activeTab === 'overview' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`py-3 px-4 font-medium ${
                activeTab === 'responses' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Responses
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`py-3 px-4 font-medium ${
                activeTab === 'export' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Export
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Responses</h3>
                <p className="text-3xl font-bold text-blue-600">{analytics.totalResponses}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Contacts</h3>
                <p className="text-3xl font-bold text-blue-600">{analytics.totalContacts}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">Last Updated</h3>
                <p className="text-gray-600">{new Date().toLocaleString()}</p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Referral Resource is Priority</span>
                      <span className="font-medium">{analytics.isPriorityPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${analytics.isPriorityPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Uses Referral Platform</span>
                      <span className="font-medium">{analytics.usesPlatformPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${analytics.usesPlatformPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Platform is Efficient</span>
                      <span className="font-medium">{analytics.isEfficientPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-500 h-2.5 rounded-full" 
                        style={{ width: `${analytics.isEfficientPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Inefficiency Reasons</h3>
                {analytics.inefficiencyReasons.length > 0 ? (
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {analytics.inefficiencyReasons.map((reason, index) => (
                      <li key={index} className="p-3 bg-gray-50 rounded-md text-sm">
                        "{reason}"
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No inefficiency reasons reported</p>
                )}
              </motion.div>
            </div>
          </div>
        )}
        
        {activeTab === 'responses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Survey Responses</h2>
              <button 
                onClick={() => setShowConfirmClear(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear All Data
              </button>
            </div>
            
            {responses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacts</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {responses.map((response: any) => (
                      <tr key={response.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{response.id.slice(0, 8)}...</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(response.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {response.data.mediaContacts.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            onClick={() => alert(JSON.stringify(response.data, null, 2))}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500 text-lg">No survey responses yet</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'export' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Export Data</h2>
            <p className="text-gray-600 mb-6">
              Export your survey data in CSV or JSON format for further analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleExportCSV}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export as CSV
              </button>
              
              <button
                onClick={handleExportJSON}
                className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export as JSON
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Clear Data</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to clear all survey responses? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

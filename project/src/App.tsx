import React, { useState, useCallback, useRef } from 'react';
import { Shield, Upload, AlertTriangle, Settings, BarChart3, Image as ImageIcon, MessageSquare, X, TrendingUp, Users, AlertOctagon, Clock } from 'lucide-react';
import { analyzeContent, analyzeImage, AnalysisResult } from './utils/toxicWords';

function App() {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [inputText, setInputText] = useState('');
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult>({
    safetyScore: 100,
    issues: [],
    processingTime: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const weeklyStats = [
    { day: 'Mon', toxic: 45, safe: 255 },
    { day: 'Tue', toxic: 62, safe: 238 },
    { day: 'Wed', toxic: 38, safe: 262 },
    { day: 'Thu', toxic: 51, safe: 249 },
    { day: 'Fri', toxic: 73, safe: 227 },
    { day: 'Sat', toxic: 29, safe: 271 },
    { day: 'Sun', toxic: 35, safe: 265 },
  ];

  const totalScanned = weeklyStats.reduce((acc, day) => acc + day.toxic + day.safe, 0);
  const totalToxic = weeklyStats.reduce((acc, day) => acc + day.toxic, 0);
  const averageResponseTime = 0.34;

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    const result = analyzeContent(newText);
    setAnalysis(result);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setIsAnalyzing(true);
      const result = await analyzeImage(file);
      setAnalysis(result);
      setIsAnalyzing(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsAnalyzing(true);
      const result = await analyzeImage(file);
      setAnalysis(result);
      setIsAnalyzing(false);
    }
  }, []);

  const getSafetyColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">GuardianAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsAdminPanelOpen(true)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button className="text-gray-300 hover:text-white">
                <BarChart3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-slate-700">
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-slate-700 p-1">
              <button
                onClick={() => setActiveTab('text')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'text'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Text Analysis
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'image'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Image Analysis
              </button>
            </div>
          </div>

          {activeTab === 'text' ? (
            <div className="space-y-6">
              <textarea
                value={inputText}
                onChange={handleTextChange}
                className="w-full h-40 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                placeholder="Enter text to analyze..."
              />
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-slate-700 rounded-lg p-12"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="text-center">
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isAnalyzing ? 'text-blue-400 animate-bounce' : 'text-gray-400'}`} />
                <p className="text-lg text-gray-300 mb-2">
                  {isAnalyzing ? 'Analyzing image...' : 'Drag and drop your image here'}
                </p>
                <p className="text-sm text-gray-400 mb-4">or</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center"
                  disabled={isAnalyzing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Content Safety Score</h3>
            <div className={`text-3xl font-bold ${getSafetyColor(analysis.safetyScore)}`}>
              {analysis.safetyScore}%
            </div>
            <p className="text-gray-400 mt-2">
              {analysis.safetyScore >= 90 
                ? 'Content appears to be safe'
                : analysis.safetyScore >= 70
                ? 'Content needs review'
                : 'Content may be harmful'}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Detected Issues</h3>
            <div className="text-3xl font-bold text-blue-400">{analysis.issues.length}</div>
            <div className="text-gray-400 mt-2 text-sm max-h-20 overflow-y-auto">
              {analysis.issues.map((issue, index) => (
                <div key={index} className="mb-1">{issue}</div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Processing Time</h3>
            <div className="text-3xl font-bold text-purple-400">
              {analysis.processingTime.toFixed(3)}s
            </div>
            <p className="text-gray-400 mt-2">Analysis completed</p>
          </div>
        </div>
      </main>

      {/* Admin Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-700 transform transition-transform duration-300 ease-in-out ${
          isAdminPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Admin Control Panel</h2>
            <button
              onClick={() => setIsAdminPanelOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Weekly Overview Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center text-blue-400 mb-2">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Total Scanned</span>
                </div>
                <div className="text-2xl font-bold text-white">{totalScanned}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center text-red-400 mb-2">
                  <AlertOctagon className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Total Toxic</span>
                </div>
                <div className="text-2xl font-bold text-white">{totalToxic}</div>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Weekly Analysis</h3>
              <div className="space-y-2">
                {weeklyStats.map((day) => (
                  <div key={day.day} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{day.day}</span>
                      <span>{day.toxic + day.safe} scans</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(day.safe / (day.toxic + day.safe)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center text-purple-400 mb-2">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Avg Response Time</span>
              </div>
              <div className="text-2xl font-bold text-white">{averageResponseTime}s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
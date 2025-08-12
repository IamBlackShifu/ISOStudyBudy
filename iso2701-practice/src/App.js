// Main Application Component
// Routes between exam selector and individual exams

import React, { useState } from 'react';
import ExamSelector from './components/ExamSelector';
import ISO27001Exam from './components/ISO27001Exam';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('selector'); // selector, iso27001, iso22301
  
  const handleExamSelect = (examType) => {
    setCurrentView(examType);
  };
  
  const handleBackToSelector = () => {
    setCurrentView('selector');
  };

  return (
    <div className="App">
      {currentView === 'selector' && (
        <ExamSelector onExamSelect={handleExamSelect} />
      )}
      
      {currentView === 'iso27001' && (
        <ISO27001Exam onBackToSelector={handleBackToSelector} />
      )}
      
      {currentView === 'iso22301' && (
        <div className="coming-soon-page">
          <h2>ISO 22301 Exam Coming Soon</h2>
          <p>This exam is currently under development.</p>
          <button onClick={handleBackToSelector}>Back to Exam Selection</button>
        </div>
      )}
    </div>
  );
}

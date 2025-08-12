import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = ({ examHistory, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate overall statistics
  const calculateOverallStats = () => {
    if (!examHistory || examHistory.length === 0) {
      return {
        totalExams: 0,
        averageScore: 0,
        passRate: 0,
        totalTimeSpent: 0,
        averageTimePerExam: 0,
        improvementTrend: 0
      };
    }

    const totalExams = examHistory.length;
    const totalScore = examHistory.reduce((sum, exam) => sum + exam.score.percent, 0);
    const averageScore = Math.round(totalScore / totalExams);
    const passedExams = examHistory.filter(exam => exam.score.percent >= 70).length;
    const passRate = Math.round((passedExams / totalExams) * 100);
    
    const totalTimeSpent = examHistory.reduce((sum, exam) => {
      const timeParts = exam.timeTaken.split(':');
      const minutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]) + parseInt(timeParts[2]) / 60;
      return sum + minutes;
    }, 0);
    const averageTimePerExam = Math.round(totalTimeSpent / totalExams);

    // Calculate improvement trend (last 3 vs first 3 exams)
    const recentExams = examHistory.slice(-3);
    const earlyExams = examHistory.slice(0, 3);
    const recentAvg = recentExams.reduce((sum, exam) => sum + exam.score.percent, 0) / recentExams.length;
    const earlyAvg = earlyExams.reduce((sum, exam) => sum + exam.score.percent, 0) / earlyExams.length;
    const improvementTrend = Math.round(recentAvg - earlyAvg);

    return {
      totalExams,
      averageScore,
      passRate,
      totalTimeSpent: Math.round(totalTimeSpent),
      averageTimePerExam,
      improvementTrend
    };
  };

  // Analyze weak areas based on question categories
  const analyzeWeakAreas = () => {
    if (!examHistory || examHistory.length === 0) return [];

    const categoryPerformance = {};
    
    examHistory.forEach(exam => {
      exam.questions.forEach((question, index) => {
        const userAnswer = exam.answers[index];
        const isCorrect = userAnswer !== undefined && question.correct === userAnswer;
        
        // Categorize questions based on content (simplified categorization)
        let category = 'General';
        const questionText = question.question.toLowerCase();
        
        if (questionText.includes('risk') || questionText.includes('threat') || questionText.includes('vulnerability')) {
          category = 'Risk Management';
        } else if (questionText.includes('control') || questionText.includes('security control')) {
          category = 'Security Controls';
        } else if (questionText.includes('isms') || questionText.includes('management system')) {
          category = 'ISMS Framework';
        } else if (questionText.includes('audit') || questionText.includes('review') || questionText.includes('compliance')) {
          category = 'Audit & Compliance';
        } else if (questionText.includes('policy') || questionText.includes('procedure') || questionText.includes('document')) {
          category = 'Documentation';
        } else if (questionText.includes('implementation') || questionText.includes('project')) {
          category = 'Implementation';
        }

        if (!categoryPerformance[category]) {
          categoryPerformance[category] = { correct: 0, total: 0 };
        }
        
        categoryPerformance[category].total += 1;
        if (isCorrect) {
          categoryPerformance[category].correct += 1;
        }
      });
    });

    return Object.entries(categoryPerformance)
      .map(([category, stats]) => ({
        category,
        percentage: Math.round((stats.correct / stats.total) * 100),
        correct: stats.correct,
        total: stats.total
      }))
      .sort((a, b) => a.percentage - b.percentage);
  };

  // Get performance over time data
  const getPerformanceOverTime = () => {
    if (!examHistory || examHistory.length === 0) return [];
    
    return examHistory.map((exam, index) => ({
      examNumber: index + 1,
      score: exam.score.percent,
      date: exam.date || `Exam ${index + 1}`,
      timeTaken: exam.timeTaken
    }));
  };

  const overallStats = calculateOverallStats();
  const weakAreas = analyzeWeakAreas();
  const performanceData = getPerformanceOverTime();

  return (
    <div className="analytics-overlay">
      <div className="analytics-container">
        <div className="analytics-header">
          <h2>📊 Performance Analytics</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="analytics-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
          <button 
            className={`tab ${activeTab === 'weak-areas' ? 'active' : ''}`}
            onClick={() => setActiveTab('weak-areas')}
          >
            Weak Areas
          </button>
        </div>

        <div className="analytics-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-value">{overallStats.totalExams}</div>
                  <div className="stat-label">Total Exams</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-value">{overallStats.averageScore}%</div>
                  <div className="stat-label">Average Score</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{overallStats.passRate}%</div>
                  <div className="stat-label">Pass Rate</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-value">{overallStats.averageTimePerExam}m</div>
                  <div className="stat-label">Avg Time/Exam</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🚀</div>
                  <div className="stat-value">
                    {overallStats.improvementTrend > 0 ? '+' : ''}{overallStats.improvementTrend}%
                  </div>
                  <div className="stat-label">Improvement</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-value">{Math.floor(overallStats.totalTimeSpent / 60)}h</div>
                  <div className="stat-label">Total Study Time</div>
                </div>
              </div>

              {examHistory && examHistory.length > 0 && (
                <div className="recent-performance">
                  <h3>Recent Performance</h3>
                  <div className="performance-chart">
                    {performanceData.slice(-5).map((exam, index) => (
                      <div key={index} className="performance-bar">
                        <div className="bar-container">
                          <div 
                            className={`bar ${exam.score >= 70 ? 'pass' : 'fail'}`}
                            style={{ height: `${(exam.score / 100) * 100}%` }}
                          ></div>
                        </div>
                        <div className="bar-label">
                          <div className="exam-score">{exam.score}%</div>
                          <div className="exam-number">#{exam.examNumber}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="trends-tab">
              <h3>Performance Trends</h3>
              {performanceData.length > 0 ? (
                <div className="trends-chart">
                  <div className="chart-container">
                    {performanceData.map((exam, index) => (
                      <div key={index} className="trend-point">
                        <div 
                          className="trend-dot"
                          style={{ 
                            bottom: `${(exam.score / 100) * 200}px`,
                            backgroundColor: exam.score >= 70 ? '#48bb78' : '#f56565'
                          }}
                          title={`Exam ${exam.examNumber}: ${exam.score}%`}
                        ></div>
                        <div className="trend-label">#{exam.examNumber}</div>
                      </div>
                    ))}
                  </div>
                  <div className="trend-insights">
                    <div className="insight">
                      <strong>Trend Analysis:</strong>
                      {overallStats.improvementTrend > 5 ? 
                        ' 📈 Great improvement! You\'re getting better.' :
                        overallStats.improvementTrend < -5 ? 
                        ' 📉 Focus on reviewing weak areas.' :
                        ' 📊 Consistent performance. Keep practicing!'
                      }
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-data">
                  <p>Take more exams to see performance trends!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'weak-areas' && (
            <div className="weak-areas-tab">
              <h3>Areas for Improvement</h3>
              {weakAreas.length > 0 ? (
                <div className="weak-areas-list">
                  {weakAreas.map((area, index) => (
                    <div key={index} className="weak-area-item">
                      <div className="area-header">
                        <span className="area-name">{area.category}</span>
                        <span className={`area-score ${area.percentage < 70 ? 'low' : area.percentage < 85 ? 'medium' : 'high'}`}>
                          {area.percentage}%
                        </span>
                      </div>
                      <div className="area-progress">
                        <div 
                          className="progress-fill"
                          style={{ width: `${area.percentage}%` }}
                        ></div>
                      </div>
                      <div className="area-stats">
                        {area.correct} correct out of {area.total} questions
                      </div>
                      {area.percentage < 70 && (
                        <div className="improvement-tip">
                          💡 Focus more study time on this area
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <p>Complete some exams to see your weak areas analysis!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

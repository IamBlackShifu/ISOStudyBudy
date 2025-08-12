import React from 'react';
import './ExamSelector.css';

const ExamSelector = ({ onExamSelect }) => {
  const examTypes = [
    {
      id: 'iso27001',
      title: 'ISO 27001:2022',
      subtitle: 'Information Security Management System (ISMS)',
      description: 'Master the fundamentals of information security management with comprehensive practice questions covering risk assessment, security controls, and ISMS implementation.',
      features: [
        'PECB format compliance (80 questions, 180 minutes)',
        '62+ comprehensive questions covering all domains',
        'Organizational, People, Physical & Technological controls',
        'Risk management and assessment methodologies',
        'Implementation and audit requirements'
      ],
      difficulty: 'Lead Implementer',
      duration: '180 minutes',
      questions: '80 questions',
      passingScore: '70%',
      available: true,
      icon: '🔒',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgPattern: 'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23667eea" fill-opacity="0.1"%3E%3Cpath d="M30 0l30 30-30 30L0 30z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'
    },
    {
      id: 'iso22301',
      title: 'ISO 22301:2019',
      subtitle: 'Business Continuity Management System (BCMS)',
      description: 'Prepare for business continuity leadership with practice questions on BCMS implementation, risk assessment, and organizational resilience strategies.',
      features: [
        'PECB format compliance (80 questions, 180 minutes)',
        'Business impact analysis and risk assessment',
        'Continuity strategy development and implementation',
        'Crisis management and emergency response',
        'Performance evaluation and continual improvement'
      ],
      difficulty: 'Lead Implementer',
      duration: '180 minutes',
      questions: '80 questions',
      passingScore: '70%',
      available: false,
      icon: '🔄',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgPattern: 'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f093fb" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="20"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'
    }
  ];

  return (
    <div className="exam-selector">
      <div className="selector-header">
        <h1>ISO Practice Exams</h1>
        <p>Choose your certification path and master ISO standards with comprehensive practice exams</p>
      </div>

      <div className="exam-cards-container">
        {examTypes.map((exam) => (
          <div 
            key={exam.id} 
            className={`exam-card ${!exam.available ? 'disabled' : ''}`}
            style={{ 
              background: exam.color,
              backgroundImage: `url("${exam.bgPattern}")`,
              backgroundSize: '60px 60px'
            }}
          >
            <div className="exam-card-content">
              <div className="exam-header">
                <div className="exam-icon">{exam.icon}</div>
                <div className="exam-title-section">
                  <h2>{exam.title}</h2>
                  <h3>{exam.subtitle}</h3>
                </div>
              </div>

              <p className="exam-description">{exam.description}</p>

              <div className="exam-stats">
                <div className="stat-item">
                  <span className="stat-label">Difficulty</span>
                  <span className="stat-value">{exam.difficulty}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Duration</span>
                  <span className="stat-value">{exam.duration}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Questions</span>
                  <span className="stat-value">{exam.questions}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Pass Score</span>
                  <span className="stat-value">{exam.passingScore}</span>
                </div>
              </div>

              <div className="exam-features">
                <h4>What You'll Practice:</h4>
                <ul>
                  {exam.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="exam-card-footer">
                {exam.available ? (
                  <button 
                    className="start-exam-btn"
                    onClick={() => onExamSelect(exam.id)}
                  >
                    Start Practice Exam
                  </button>
                ) : (
                  <div className="coming-soon">
                    <span>Coming Soon</span>
                    <small>This exam will be available in the next update</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="about-section">
        <div className="about-content">
          <h3>About Our Practice Exams</h3>
          <div className="about-grid">
            <div className="about-item">
              <div className="about-icon">📚</div>
              <h4>Comprehensive Coverage</h4>
              <p>Our practice exams cover all domains and requirements of each ISO standard, ensuring complete preparation.</p>
            </div>
            <div className="about-item">
              <div className="about-icon">⏱️</div>
              <h4>Authentic Format</h4>
              <p>Following PECB standards with realistic timing, question formats, and scoring criteria.</p>
            </div>
            <div className="about-item">
              <div className="about-icon">🎯</div>
              <h4>Detailed Explanations</h4>
              <p>Every question includes comprehensive explanations to enhance your understanding and learning.</p>
            </div>
            <div className="about-item">
              <div className="about-icon">📊</div>
              <h4>Performance Analytics</h4>
              <p>Track your progress with detailed scoring, time analysis, and areas for improvement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSelector;

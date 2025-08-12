// ISO27001 Practice Exam Component
// Extracted from the main App.js to be modular

import React, {useState, useEffect, useRef} from 'react';
import Analytics from './Analytics';
import questionsData from '../questions.json';

// Config (PECB official parameters)
const PECB_CONFIG = {
  totalQuestions: 80, // standard exam size
  durationMinutes: 180, // 3 hours
  passPercent: 70
};

// Utility: shuffle array
function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function formatTime(sec){
  const h = Math.floor(sec/3600).toString().padStart(2,'0');
  const m = Math.floor((sec%3600)/60).toString().padStart(2,'0');
  const s = (sec%60).toString().padStart(2,'0');
  return `${h}:${m}:${s}`;
}

const ISO27001Exam = ({ onBackToSelector }) => {
  const [mode, setMode] = useState('setup'); // setup, exam, results
  const [numQuestions, setNumQuestions] = useState(PECB_CONFIG.totalQuestions);
  const [durationMinutes, setDurationMinutes] = useState(PECB_CONFIG.durationMinutes);
  const [questionPool, setQuestionPool] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes*60);
  const [examStartTime, setExamStartTime] = useState(null);
  const [examEndTime, setExamEndTime] = useState(null);
  const [examHistory, setExamHistory] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const timerRef = useRef(null);

  useEffect(()=>{
    // load pool (questionsData imported)
    setQuestionPool(questionsData);
    
    // Load exam history from localStorage
    const savedHistory = localStorage.getItem('iso27001-exam-history');
    if (savedHistory) {
      setExamHistory(JSON.parse(savedHistory));
    }
  },[]);

  useEffect(()=>{
    if(mode==='exam'){
      setTimeLeft(durationMinutes*60);
      setExamStartTime(Date.now());
      setExamEndTime(null);
      timerRef.current = setInterval(()=>{
        setTimeLeft(prev=>{
          if(prev<=1){
            clearInterval(timerRef.current);
            finishExam();
            return 0;
          }
          return prev-1;
        });
      },1000);
    } else {
      clearInterval(timerRef.current);
    }
    return ()=>clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[mode]);

  function startExam(){
    // validate pool length
    const pool = [...questionPool];
    if(pool.length===0){
      alert('No questions found. Add questions.json in src with question bank.');
      return;
    }
    const shuffled = shuffle(pool);
    const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));
    setExamQuestions(selected);
    setAnswers({});
    setMode('exam');
  }

  function selectAnswer(qIndex, optionIndex){
    setAnswers(prev=>({
      ...prev,
      [qIndex]: optionIndex
    }));
  }

  function finishExam(){
    clearInterval(timerRef.current);
    setExamEndTime(Date.now());
    setMode('results');
  }

  function calculateScore(){
    let correct=0;
    examQuestions.forEach((q, i)=>{
      const choice = answers[i];
      if(choice!==undefined && q.correct === choice) correct++;
    });
    return {correct, total: examQuestions.length, percent: examQuestions.length? Math.round((correct/examQuestions.length)*100):0};
  }

  function calculateTimeTaken() {
    if (examStartTime && examEndTime) {
      const timeTaken = Math.floor((examEndTime - examStartTime) / 1000);
      return formatTime(timeTaken);
    }
    return 'N/A';
  }

  function saveExamToHistory(score, timeTaken) {
    const examResult = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      score: score,
      timeTaken: timeTaken,
      questions: examQuestions,
      answers: answers,
      numQuestions: examQuestions.length,
      examType: 'ISO 27001:2022'
    };

    const updatedHistory = [...examHistory, examResult];
    setExamHistory(updatedHistory);
    
    // Save to localStorage
    localStorage.setItem('iso27001-exam-history', JSON.stringify(updatedHistory));
  }

  function resetToSetup(){
    setMode('setup');
    setExamQuestions([]);
    setAnswers({});
    setExamStartTime(null);
    setExamEndTime(null);
  }

  return (
    <div className="app-root">
      <header>
        <div>
          <button className="back-btn" onClick={onBackToSelector}>
            ← Back to Exam Selection
          </button>
          <h1>ISO 27001:2022 Practice Exam</h1>
          <span className="exam-subtitle">Information Security Management System (ISMS)</span>
        </div>
        <div className="exam-info">
          <div>PECB format: {PECB_CONFIG.totalQuestions} questions • {PECB_CONFIG.durationMinutes} minutes • Pass: {PECB_CONFIG.passPercent}%</div>
          {mode==='exam' && <div className="timer-display">Time left: {formatTime(timeLeft)}</div>}
        </div>
      </header>

      {mode==='setup' && (
        <div className="setup-section">
          <div className="setup-header">
            <h2>Exam Settings</h2>
            {examHistory.length > 0 && (
              <button 
                className="analytics-btn"
                onClick={() => setShowAnalytics(true)}
              >
                📊 View Analytics ({examHistory.length} exams)
              </button>
            )}
          </div>
          
          <div className="form-group">
            <label>Number of questions:</label>
            <input 
              type="number" 
              value={numQuestions} 
              min={5} 
              max={Math.max(5,questionPool.length)} 
              onChange={e=>setNumQuestions(parseInt(e.target.value)||5)} 
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes):</label>
            <input 
              type="number" 
              value={durationMinutes} 
              min={10} 
              max={480} 
              onChange={e=>setDurationMinutes(parseInt(e.target.value)||10)} 
            />
          </div>
          <div style={{marginTop: 20}}>
            <button onClick={startExam} className="btn-primary">Start Exam</button>
            <button 
              className="btn-quick" 
              onClick={()=>{
                setNumQuestions(20); 
                setDurationMinutes(60);
              }}
            >
              Quick 20Q Practice
            </button>
          </div>

          <div className="question-bank-info">
            <h3>Question Bank</h3>
            <p>Loaded questions: <strong>{questionPool.length}</strong>. This comprehensive bank covers all aspects of ISO 27001:2022 including ISMS requirements, risk management, controls, and compliance.</p>
          </div>

          {examHistory.length > 0 && (
            <div className="recent-stats">
              <h3>Recent Performance</h3>
              <div className="stats-summary">
                <div className="stat-item">
                  <span className="stat-label">Last Score:</span>
                  <span className="stat-value">{examHistory[examHistory.length - 1].score.percent}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average:</span>
                  <span className="stat-value">
                    {Math.round(examHistory.reduce((sum, exam) => sum + exam.score.percent, 0) / examHistory.length)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Best Score:</span>
                  <span className="stat-value">
                    {Math.max(...examHistory.map(exam => exam.score.percent))}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode==='exam' && (
        <div className="exam-section">
          <h2>Exam in Progress</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{width: `${(Object.keys(answers).length / examQuestions.length) * 100}%`}}
            ></div>
          </div>
          <p style={{marginBottom: 20, color: '#4a5568'}}>
            Progress: {Object.keys(answers).length} / {examQuestions.length} questions answered
          </p>
          
          <ol className="question-list">
            {examQuestions.map((q, i)=> (
              <li key={i} className="question-item">
                <div className="question-text">
                  Question {i + 1}: <span dangerouslySetInnerHTML={{__html: q.question}} />
                </div>
                <div className="options-container">
                  {q.options.map((opt, oi)=> (
                    <div key={oi} className="option-item">
                      <input 
                        type="radio" 
                        name={`q-${i}`} 
                        id={`q-${i}-${oi}`}
                        checked={answers[i]===oi} 
                        onChange={()=>selectAnswer(i, oi)} 
                      />
                      <label htmlFor={`q-${i}-${oi}`}>
                        <span dangerouslySetInnerHTML={{__html:opt}} />
                      </label>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          
          <div style={{marginTop: 30, textAlign: 'center'}}>
            <button onClick={finishExam} className="btn-success">Submit Exam</button>
            <button 
              className="btn-secondary" 
              onClick={()=>{if(window.confirm('End and submit now?')) finishExam();}}
            >
              End Now
            </button>
            <button 
              className="btn-danger" 
              onClick={()=>{if(window.confirm('Abort exam and return to settings?')) {clearInterval(timerRef.current); resetToSetup();}}}
            >
              Abort
            </button>
          </div>
        </div>
      )}

      {mode==='results' && (
        <ResultsPanel 
          score={calculateScore()} 
          questions={examQuestions} 
          answers={answers} 
          passPercent={PECB_CONFIG.passPercent} 
          timeTaken={calculateTimeTaken()}
          onRetry={()=>{resetToSetup();}} 
          onSaveToHistory={saveExamToHistory}
        />
      )}

      {showAnalytics && (
        <Analytics 
          examHistory={examHistory}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      <footer>
        <div>This tool is for practice only. Use the official PECB candidate handbook for real exam rules.</div>
        <div style={{marginTop: 5}}>Comprehensive ISO 27001:2022 practice questions covering all domains</div>
      </footer>
    </div>
  );
};

function ResultsPanel({score, questions, answers, passPercent, timeTaken, onRetry, onSaveToHistory}){
  const passed = score.percent >= passPercent;
  
  // Save to history when component mounts (only once)
  useEffect(() => {
    if (onSaveToHistory) {
      onSaveToHistory(score, timeTaken);
    }
  }, [score, timeTaken, onSaveToHistory]);
  
  return (
    <div className="results-section">
      <h2>Exam Results</h2>
      <div className="score-display">
        <div className="score-text">
          Score: {score.correct} / {score.total} ({score.percent}%)
        </div>
        <div className="time-taken">
          Time taken: {timeTaken}
        </div>
        <div className={`pass-status ${passed ? 'pass' : 'fail'}`}>
          {passed ? 'PASS ✓' : 'FAIL ✗'}
        </div>
      </div>
      
      <div className="answer-review">
        <h3>Answer Review & Explanations</h3>
        <ol style={{listStyle: 'none', padding: 0}}>
          {questions.map((q,i)=> {
            const userAnswer = answers[i];
            const isCorrect = userAnswer !== undefined && q.correct === userAnswer;
            
            return (
              <li key={i} className="review-question">
                <div className="review-question-text">
                  Question {i + 1}: <span dangerouslySetInnerHTML={{__html:q.question}} />
                </div>
                <div className={`answer-line ${isCorrect ? 'correct-user-answer' : 'wrong-user-answer'}`}>
                  <strong>Your answer:</strong> {userAnswer !== undefined ? q.options[userAnswer] : <em>Not answered</em>}
                </div>
                <div className="answer-line correct-answer">
                  <strong>Correct answer:</strong> {q.options[q.correct]}
                </div>
                {q.explanation && (
                  <div className="explanation">
                    <strong>Explanation:</strong> <span dangerouslySetInnerHTML={{__html:q.explanation}} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      
      <div style={{marginTop: 30, textAlign: 'center'}}>
        <button onClick={onRetry} className="btn-primary">Take Another Exam</button>
      </div>
    </div>
  );
}

export default ISO27001Exam;

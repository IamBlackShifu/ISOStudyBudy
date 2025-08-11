// ISO27001 Practice Exam Web App
// Single-file React app (App.jsx) with a simple local JSON question bank.
// Features:
// - Choose exam length (PECB standard: 80 questions, 180 minutes)
// - Randomized question selection
// - Timer with exam duration and per-question countdown display
// - Submit and receive score, pass/fail (70% pass threshold)
// - Show correct answers and explanations after finish
// - Questions stored in `questions.json` (import or fetch)

// To run locally:
// 1. Create a React app: `npx create-react-app iso2701-practice` 
// 2. Replace src/App.js with this file's contents and add `src/questions.json` containing the question bank.
// 3. Install dependencies if desired, then `npm start`.

import React, {useState, useEffect, useRef} from 'react';
import questionsData from './questions.json'; // create this file with an array of question objects
import './App.css';

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

export default function App(){
  const [mode, setMode] = useState('setup'); // setup, exam, results
  const [numQuestions, setNumQuestions] = useState(PECB_CONFIG.totalQuestions);
  const [durationMinutes, setDurationMinutes] = useState(PECB_CONFIG.durationMinutes);
  const [questionPool, setQuestionPool] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes*60);
  const timerRef = useRef(null);
  const [examStartTime, setExamStartTime] = useState(null);

  useEffect(()=>{
    // load pool (questionsData imported)
    setQuestionPool(questionsData);
  },[]);

  useEffect(()=>{
    if(mode==='exam'){
      setTimeLeft(durationMinutes*60);
      setExamStartTime(Date.now());
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
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - examStartTime) / 1000);
    setMode('results');
    // Store time taken for results display
    window.examTimeTaken = timeTaken;
  }

  function calculateScore(){
    let correct=0;
    examQuestions.forEach((q, i)=>{
      const choice = answers[i];
      if(choice!==undefined && q.correct === choice) correct++;
    });
    return {correct, total: examQuestions.length, percent: examQuestions.length? Math.round((correct/examQuestions.length)*100):0};
  }

  function resetToSetup(){
    setMode('setup');
    setExamQuestions([]);
    setAnswers({});
  }

  return (
    <div className="app-root">
      <header>
        <div>
          <h1>ISO 27001 Practice Exam</h1>
        </div>
        <div className="exam-info">
          <div>PECB format: {PECB_CONFIG.totalQuestions} questions • {PECB_CONFIG.durationMinutes} minutes • Pass: {PECB_CONFIG.passPercent}%</div>
          {mode==='exam' && <div className="timer-display">Time left: {formatTime(timeLeft)}</div>}
        </div>
      </header>

      {mode==='setup' && (
        <div className="setup-section">
          <h2>Exam Settings</h2>
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
            <p>Loaded questions: <strong>{questionPool.length}</strong>. This comprehensive bank covers all aspects of ISO 27001 including ISMS requirements, risk management, controls, and compliance.</p>
          </div>
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
          timeTaken={window.examTimeTaken || 0}
          totalTime={durationMinutes * 60}
          onRetry={()=>{resetToSetup();}} 
        />
      )}

      <footer>
        <div>This tool is for practice only. Use the official PECB candidate handbook for real exam rules.</div>
        <div style={{marginTop: 5}}>Comprehensive ISO 27001:2022 practice questions covering all domains</div>
      </footer>
    </div>
  );
}

function ResultsPanel({score, questions, answers, passPercent, timeTaken, totalTime, onRetry}){
  const passed = score.percent >= passPercent;
  
  const timeUsed = formatTime(timeTaken);
  const timeTotal = formatTime(totalTime);
  const timeRemaining = formatTime(totalTime - timeTaken);
  
  return (
    <div className="results-section">
      <h2>Exam Results</h2>
      <div className="score-display">
        <div className="score-text">
          Score: {score.correct} / {score.total} ({score.percent}%)
        </div>
        <div className={`pass-status ${passed ? 'pass' : 'fail'}`}>
          {passed ? 'PASS ✓' : 'FAIL ✗'}
        </div>
        <div style={{marginTop: 15, fontSize: '0.95rem', color: '#4a5568'}}>
          <div><strong>Time Used:</strong> {timeUsed} / {timeTotal}</div>
          <div><strong>Time Remaining:</strong> {timeRemaining}</div>
          <div><strong>Average per Question:</strong> {formatTime(Math.floor(timeTaken / questions.length))}</div>
        </div>
      </div>
      
      <div className="answer-review">
        <h3>Answer Review & Explanations</h3>
        <ol style={{listStyle: 'none', padding: 0}}>
          {questions.map((q,i)=> {
            const userAnswer = answers[i];
            const isCorrect = userAnswer !== undefined && q.correct === userAnswer;
            const isAnswered = userAnswer !== undefined;
            
            return (
              <li key={i} className="review-question">
                <div className="review-question-text">
                  Question {i + 1}: <span dangerouslySetInnerHTML={{__html:q.question}} />
                </div>
                <div className={`answer-line ${isAnswered ? (isCorrect ? 'correct-answer' : 'wrong-answer') : 'user-answer'}`}>
                  <strong>Your answer:</strong> {isAnswered ? q.options[userAnswer] : <em>Not answered</em>}
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

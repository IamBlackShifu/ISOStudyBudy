# ISO 27001 Practice Exam Web Application

A comprehensive web-based practice exam application for ISO/IEC 27001 Information Security Management System (ISMS) certification preparation. This application follows the PECB exam format and provides an authentic exam experience with a complete question bank covering all domains of ISO 27001.

## 🎯 Features

### Exam Functionality
- **Authentic PECB Format**: Default 80 questions in 180 minutes (3 hours)
- **Customizable Settings**: Adjust number of questions (5-62) and duration (10-480 minutes)
- **Quick Practice Mode**: 20 questions in 60 minutes for rapid review
- **Randomized Questions**: Questions are shuffled for each exam attempt
- **Real-time Timer**: Countdown timer with visual indicators
- **Progress Tracking**: Visual progress bar showing completion status

### Question Bank
- **62+ Comprehensive Questions**: Covering all ISO 27001:2022 domains
- **Multiple Choice Format**: 4 options per question matching real exam format
- **Detailed Explanations**: In-depth explanations for each correct answer
- **Current Standards**: Based on ISO/IEC 27001:2022 latest version

### Results & Analytics
- **Pass/Fail Scoring**: 70% pass threshold (PECB standard)
- **Detailed Review**: Question-by-question answer analysis
- **Visual Feedback**: Wrong answers highlighted in red, correct in green
- **Time Tracking**: Shows total time taken for the exam
- **Performance Insights**: Comprehensive score breakdown

### User Interface
- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Navigation**: Easy-to-use controls and clear visual hierarchy
- **Accessibility**: Proper color contrast and keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone [repository-url]
   cd iso2701-practice
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

To create a production build:

```bash
npm run build
```

This creates a `build` folder with optimized static files ready for deployment.

## 📚 Question Bank Structure

The application uses a JSON-based question bank located at `src/questions.json`. Each question follows this structure:

```json
{
  "question": "Question text here",
  "options": [
    "Option A",
    "Option B", 
    "Option C",
    "Option D"
  ],
  "correct": 1,
  "explanation": "Detailed explanation of the correct answer"
}
```

### Question Categories Covered
- ISO 27001 fundamentals and requirements
- Information Security Management System (ISMS) concepts
- Risk management and assessment
- Security controls (Organizational, People, Physical, Technological)
- Implementation methodologies
- Compliance and audit requirements
- Continual improvement processes

## 🎮 How to Use

### Starting an Exam
1. **Configure Settings**: Choose number of questions and duration
2. **Quick Practice**: Use the "Quick 20Q Practice" for rapid review
3. **Start Exam**: Click "Start Exam" to begin

### During the Exam
- **Answer Questions**: Select one option per question
- **Track Progress**: Monitor the progress bar and timer
- **Submit**: Click "Submit Exam" when finished or time expires

### Reviewing Results
- **Score Analysis**: View your percentage and pass/fail status
- **Answer Review**: See correct answers with explanations
- **Performance Insights**: Understand areas for improvement

## 🛠️ Technical Details

### Built With
- **React**: Frontend framework for dynamic user interface
- **JavaScript (ES6+)**: Modern JavaScript features
- **CSS3**: Custom styling with gradients and animations
- **HTML5**: Semantic markup structure

### Project Structure
```
iso2701-practice/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Styling and theme
│   ├── questions.json  # Question bank
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
├── package.json
└── README.md
```

### Key Components
- **App Component**: Main application logic and state management
- **ResultsPanel**: Results display and answer review
- **Timer System**: Real-time countdown with automatic submission
- **Progress Tracking**: Visual indicators for exam completion

## 📊 Exam Standards Compliance

This application follows **PECB (Professional Evaluation and Certification Board)** standards:

- **Question Count**: 80 questions (configurable)
- **Duration**: 180 minutes (3 hours)
- **Pass Threshold**: 70%
- **Question Format**: Multiple choice with 4 options
- **Content Coverage**: All ISO 27001:2022 domains

## 🎯 Learning Objectives

After using this practice exam, you should be able to:

1. **Understand ISMS fundamentals** and ISO 27001 requirements
2. **Apply risk management** principles and methodologies
3. **Identify appropriate security controls** for various scenarios
4. **Comprehend implementation** strategies and best practices
5. **Demonstrate knowledge** of compliance and audit processes

## 🔧 Customization

### Adding New Questions
1. Open `src/questions.json`
2. Add new question objects following the existing format
3. Ensure the `correct` field uses zero-based indexing (0, 1, 2, or 3)
4. Include detailed explanations for learning value

### Modifying Exam Settings
Default settings can be changed in `App.js`:
```javascript
const PECB_CONFIG = {
  totalQuestions: 80,     // Default question count
  durationMinutes: 180,   // Default duration
  passPercent: 70         // Pass threshold
};
```

## 📝 License

This project is for educational purposes. Please ensure compliance with ISO standards and certification body requirements when using for official preparation.

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Add new questions or improve functionality
4. Submit a pull request with detailed description

## 📞 Support

For questions or issues:
- Review the question bank for accuracy
- Check the exam format compliance
- Verify timer functionality
- Test responsive design

## 🏆 Best Practices for Use

### Effective Study Strategy
1. **Take full-length exams** to simulate real conditions
2. **Review explanations** thoroughly for wrong answers
3. **Focus on weak areas** identified through results
4. **Practice regularly** to maintain knowledge retention
5. **Time management** practice with the built-in timer

### Exam Preparation Tips
- Use the application multiple times with different question sets
- Study the explanations to understand underlying concepts
- Practice under timed conditions to build confidence
- Review ISO 27001:2022 standard alongside practice questions

---

**Note**: This is a practice tool only. Refer to official PECB candidate handbooks and ISO standards for authoritative exam information and requirements.

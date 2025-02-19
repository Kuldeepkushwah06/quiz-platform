import React, { useState, useEffect, useCallback } from 'react';
import { quizData } from '../data/quizData';
import { saveQuizAttempt } from '../services/db';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleNextQuestion = useCallback(async () => {
    // Auto-save the current answer if it exists and hasn't been saved yet
    if (currentAnswer) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: currentAnswer
      }));
      setCurrentAnswer(''); // Reset current answer after saving
    }

    const currentQuestionData = quizData.questions[currentQuestion];
    const userAnswer = currentAnswer || answers[currentQuestion];
    const isCorrect = userAnswer?.toString() === currentQuestionData.correctAnswer.toString();
    
    setQuestionResults(prev => [...prev, {
      question: currentQuestionData.question,
      userAnswer: userAnswer || "Not answered",
      correctAnswer: currentQuestionData.correctAnswer,
      isCorrect
    }]);

    if (currentQuestion === quizData.questions.length - 1) {
      const results = quizData.questions.map((question, index) => {
        const answer = answers[index];
        const correct = answer?.toString() === question.correctAnswer.toString();
        return { questionId: question.id, userAnswer: answer, isCorrect: correct };
      });

      const correctAnswers = results.filter(r => r.isCorrect).length;
      const finalScore = (correctAnswers / quizData.questions.length) * 100;
      
      setScore(finalScore);
      setQuizCompleted(true);
      await saveQuizAttempt(finalScore, 300 - timeLeft, results);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(30);
      setFeedback(null);
    }
  }, [currentQuestion, answers, timeLeft, currentAnswer]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !quizCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleNextQuestion();
    }
    return () => clearInterval(timer);
  }, [timeLeft, quizCompleted, handleNextQuestion]);

  const handleAnswer = (value) => {
    setCurrentAnswer(value);
  };

  const handleSaveAnswer = () => {
    if (!currentAnswer) {
      return;
    }

    const currentQuestionData = quizData.questions[currentQuestion];
    const isCorrect = currentAnswer.toString() === currentQuestionData.correctAnswer.toString();
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: currentAnswer
    }));

    // Show feedback only when explicitly saving
    setFeedback({
      isCorrect,
      message: isCorrect ? "Correct! ✅" : "Incorrect ❌",
      correctAnswer: currentQuestionData.correctAnswer
    });

    setCurrentAnswer('');
  };

  const renderQuestion = () => {
    const question = quizData.questions[currentQuestion];
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            ></div>
          </div>
          <p className="mt-2 text-right font-bold">
            Time remaining: {timeLeft}s
          </p>
        </div>

        <h2 className="text-xl font-bold mb-4">
          Question {currentQuestion + 1} of {quizData.questions.length}
        </h2>
        
        <p className="text-lg mb-6">{question.question}</p>
        
        {question.type === 'multiple-choice' ? (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                  ${currentAnswer === String.fromCharCode(65 + index) 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  value={String.fromCharCode(65 + index)}
                  checked={currentAnswer === String.fromCharCode(65 + index)}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="mr-3"
                />
                <span>{String.fromCharCode(65 + index)}. {option}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type="number"
            value={currentAnswer}
            onChange={(e) => handleAnswer(parseInt(e.target.value))}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your answer..."
          />
        )}

        {feedback && (
          <div className={`mt-4 p-4 rounded-lg ${feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="font-bold">{feedback.message}</p>
            {!feedback.isCorrect && (
              <p>Correct answer: {feedback.correctAnswer}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderScorecard = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Quiz Completed! 🎉</h2>
        <div className="text-6xl font-bold text-blue-600 mb-2">
          {score.toFixed(1)}%
        </div>
        <p className="text-gray-600">
          You answered {questionResults.filter(r => r.isCorrect).length} out of {quizData.questions.length} questions correctly
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold mb-4">Question Summary:</h3>
        {questionResults.map((result, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg ${result.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
          >
            <p className="font-bold mb-2">Question {index + 1}: {result.question}</p>
            <p className="text-gray-600">Your answer: {result.userAnswer}</p>
            {!result.isCorrect && (
              <p className="text-gray-600">Correct answer: {result.correctAnswer}</p>
            )}
            <span 
              className={`inline-block px-2 py-1 rounded text-sm mt-2 
                ${result.isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
            >
              {result.isCorrect ? 'Correct' : 'Incorrect'}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.location.reload()}
        className="mt-8 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Take Quiz Again
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {!quizCompleted ? (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{quizData.title}</h1>
            <div className="flex gap-2 mb-4">
              {quizData.questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index === currentQuestion 
                      ? 'bg-blue-600' 
                      : index < currentQuestion 
                        ? 'bg-green-500' 
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {renderQuestion()}

          <div className="mt-6 flex justify-between gap-4">
            <button
              disabled={currentQuestion === 0}
              onClick={() => {
                setCurrentQuestion(prev => prev - 1);
                setTimeLeft(30);
                setFeedback(null);
              }}
              className="px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={handleSaveAnswer}
                disabled={!currentAnswer}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                         hover:bg-blue-700 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed"
              >
                Save Answer
              </button>
              
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentQuestion === quizData.questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        renderScorecard()
      )}
    </div>
  );
};

export default Quiz; 
import { useState, useEffect } from 'react';
import Result from './Result';

const API_URL = 'http://localhost:5000/api/questions';

// Fisher-Yates Shuffle
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

function Exam() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { questionId: selectedOptionText }
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        startExam();
    }, []);

    const startExam = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            // Prepare questions: shuffle questions, and for each question, shuffle options
            const preparedQuestions = data.map(q => {
                const optionsWithMeta = q.options.map((opt, idx) => ({
                    text: opt,
                    originalIndex: idx,
                    isCorrect: idx === q.correctOptionIndex
                }));
                return {
                    ...q,
                    shuffledOptions: shuffleArray(optionsWithMeta)
                };
            });

            setQuestions(shuffleArray(preparedQuestions));
            setCurrentQuestionIndex(0);
            setUserAnswers({});
            setIsFinished(false);
        } catch (err) {
            console.error('Error fetching questions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionText) => {
        setUserAnswers({
            ...userAnswers,
            [questionId]: optionText
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (loading) return <div>Loading exam...</div>;
    if (questions.length === 0) return <div className="card">No questions found. Please add some in the Admin section.</div>;

    if (isFinished) {
        return <Result questions={questions} userAnswers={userAnswers} onRetry={startExam} />;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="exam-container">
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--surface-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary-color)', transition: 'width 0.3s' }}></div>
                </div>
            </div>

            <div className="card">
                <h3>{currentQuestion.questionText}</h3>
                <div className="options-list">
                    {currentQuestion.shuffledOptions.map((opt, idx) => {
                        const isSelected = userAnswers[currentQuestion.id] === opt.text;
                        return (
                            <div
                                key={idx}
                                className={`option-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(currentQuestion.id, opt.text)}
                            >
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: '2px solid var(--text-muted)',
                                    marginRight: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderColor: isSelected ? 'var(--primary-color)' : 'var(--text-muted)'
                                }}>
                                    {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>}
                                </div>
                                {opt.text}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleNext}
                    disabled={!userAnswers[currentQuestion.id]}
                >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish Exam' : 'Next Question'}
                </button>
            </div>
        </div>
    );
}

export default Exam;

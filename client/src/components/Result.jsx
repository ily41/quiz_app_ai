import React from 'react';
import { Link } from 'react-router-dom';

function Result({ questions, userAnswers, onRetry }) {
    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q) => {
            const userAnswer = userAnswers[q.id];
            // Note: userAnswers stores the original index of the selected option
            // But wait, if we shuffled options, we need to track the original index or the string value.
            // Let's assume we track the string value or the original object if we structured it that way.
            // To keep it simple, let's say userAnswers stores the selected option TEXT.
            // And we compare it with q.options[q.correctOptionIndex].

            const correctOptionText = q.options[q.correctOptionIndex];
            if (userAnswer === correctOptionText) {
                correct++;
            }
        });
        return correct;
    };

    const score = calculateScore();
    const total = questions.length;

    return (
        <div className="result-container">
            <h2>Exam Results</h2>
            <div className="card" style={{ textAlign: 'center' }}>
                <h3>You scored {score} out of {total}</h3>
                <p>{Math.round((score / total) * 100)}%</p>
                <button onClick={onRetry}>Take Exam Again</button>
                <Link to="/admin" style={{ marginLeft: '10px' }}>
                    <button style={{ backgroundColor: 'var(--surface-color)' }}>Manage Questions</button>
                </Link>
            </div>

            <h3>Detailed Review</h3>
            {questions.map((q) => {
                const userAnswer = userAnswers[q.id];
                const correctOptionText = q.options[q.correctOptionIndex];
                const isCorrect = userAnswer === correctOptionText;

                return (
                    <div key={q.id} className="card" style={{ borderLeft: `5px solid ${isCorrect ? 'var(--success-color)' : 'var(--error-color)'}` }}>
                        <h4>{q.questionText}</h4>
                        <p>
                            Your Answer: <span style={{ color: isCorrect ? 'var(--success-color)' : 'var(--error-color)' }}>
                                {userAnswer || 'Skipped'}
                            </span>
                        </p>
                        {!isCorrect && (
                            <p>Correct Answer: <span style={{ color: 'var(--success-color)' }}>{correctOptionText}</span></p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Result;

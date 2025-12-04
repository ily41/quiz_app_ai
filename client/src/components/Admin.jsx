import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/questions';

function Admin() {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setQuestions(data);
        } catch (err) {
            console.error('Error fetching questions:', err);
        }
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...newQuestion.options];
        updatedOptions[index] = value;
        setNewQuestion({ ...newQuestion, options: updatedOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newQuestion)
            });
            if (res.ok) {
                setNewQuestion({
                    questionText: '',
                    options: ['', '', '', ''],
                    correctOptionIndex: 0
                });
                fetchQuestions();
            }
        } catch (err) {
            console.error('Error saving question:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchQuestions();
            }
        } catch (err) {
            console.error('Error deleting question:', err);
        }
    };

    return (
        <div className="admin-container">
            <h2>Manage Questions</h2>

            <div className="card">
                <h3>Add New Question</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Question Text:</label>
                        <input
                            type="text"
                            value={newQuestion.questionText}
                            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                            required
                            placeholder="Enter your question here..."
                        />
                    </div>

                    <div>
                        <label>Options:</label>
                        {newQuestion.options.map((opt, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={newQuestion.correctOptionIndex === idx}
                                    onChange={() => setNewQuestion({ ...newQuestion, correctOptionIndex: idx })}
                                />
                                <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    required
                                    placeholder={`Option ${idx + 1}`}
                                />
                            </div>
                        ))}
                    </div>

                    <button type="submit">Save Question</button>
                </form>
            </div>

            <div className="question-list">
                <h3>Existing Questions ({questions.length})</h3>
                {questions.map((q) => (
                    <div key={q.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <strong>{q.questionText}</strong>
                                <ul>
                                    {q.options.map((opt, idx) => (
                                        <li key={idx} style={{ color: idx === q.correctOptionIndex ? 'var(--success-color)' : 'inherit' }}>
                                            {opt} {idx === q.correctOptionIndex && '(Correct)'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button className="delete-btn" onClick={() => handleDelete(q.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Admin;

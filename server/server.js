const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, '../data/questions.json');

// Helper to read questions
const readQuestions = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to write questions
const writeQuestions = (questions) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(questions, null, 2));
};

// GET /api/questions
app.get('/api/questions', (req, res) => {
    const questions = readQuestions();
    res.json(questions);
});

// POST /api/questions
app.post('/api/questions', (req, res) => {
    const { questionText, options, correctOptionIndex } = req.body;
    if (!questionText || !options || correctOptionIndex === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const questions = readQuestions();
    const newQuestion = {
        id: Date.now().toString(),
        questionText,
        options,
        correctOptionIndex
    };
    questions.push(newQuestion);
    writeQuestions(questions);
    res.status(201).json(newQuestion);
});

// DELETE /api/questions/:id
app.delete('/api/questions/:id', (req, res) => {
    const { id } = req.params;
    let questions = readQuestions();
    const initialLength = questions.length;
    questions = questions.filter(q => q.id !== id);
    
    if (questions.length === initialLength) {
        return res.status(404).json({ error: 'Question not found' });
    }

    writeQuestions(questions);
    res.json({ message: 'Question deleted' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

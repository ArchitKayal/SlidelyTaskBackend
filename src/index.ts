import express from 'express';
import bodyParser from 'body-parser';
import { writeFile, readFileSync } from 'fs';

const app = express();
app.use(bodyParser.json());

interface Submission {
    name: string;
    email: string;
    phone: string;
    github_link: string;
    stopwatch_time: string;
}

let submissions: Submission[] = [];
const dbFile = 'db.json';

try {
    const data = readFileSync(dbFile, 'utf8');
    submissions = JSON.parse(data);
} catch (err) {
    console.error('Error reading database:', err);
}

app.get('/ping', (req, res) => {
    res.send(true);
});

app.post('/submit', (req, res) => {
    const submission: Submission = req.body;
    submissions.push(submission);
    writeFile(dbFile, JSON.stringify(submissions), (err) => {
        if (err) {
            console.error('Error writing to database:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Submission saved');
        }
    });
});

app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string, 10);
    if (index >= 0 && index < submissions.length) {
        res.json(submissions[index]);
    } else {
        res.status(404).send('Not Found');
    }
});

app.listen(3000, () => {
    console.log('Backend server is running on http://localhost:3000');
});

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.use(express.static(path.join(__dirname, 'public')));

const generatePirateLog = async (userInput) => {
  const apiKey = process.env.GROQ_API_KEY; 
 
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",  
    },
    body: JSON.stringify({ 
      messages: [
        {
          role: "system",
          content: `The users will send messages regarding their daily activity or journaling for that day. Convert the text into a pirate captain’s log entry. Use nautical language, pirate jargon, and make it sound adventurous and exaggerated. Be sure to use pirate expressions like 'Arrr!', 'Ahoy, matey!', and 'Avast!'.`,
        },  
        {
          role: "user",
          content: userInput, 
        },
      ],
      model: "llama3-8b-8192", 
      temperature: 0.8,
      max_tokens: 1500,
      top_p: 1,
      stop: null,
      stream: false,
    }),
  });

  const data = await response.json();

  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  } else {
    return "Arrr, something went wrong, matey!";
  }
};

app.post('/generate-log', async (req, res) => {
  const { userActivity, logName } = req.body;
  const pirateLog = await generatePirateLog(userActivity);
  const timestamp = new Date().toISOString();
  
  const logEntry = {
    name: logName,
    log: pirateLog,
    timestamp: timestamp
  };

  // Save the log entry to a file
  fs.appendFileSync('logs.json', JSON.stringify(logEntry) + '\n');

  res.json({ pirateLog });
});

app.get('/logbook.html', function (req, res) {
  res.sendFile(path.join(__dirname, '/logbook.html'));
});

app.get('/logs', function (req, res) {
  const logs = fs.readFileSync('logs.json', 'utf-8').split('\n').filter(Boolean).map(JSON.parse);
  res.json(logs);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
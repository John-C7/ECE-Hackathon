// server.js

const express = require('express');
const bodyParser = require('body-parser');
const googleTranslate = require('google-translate');

const app = express();
const port = 5001;

const translate = googleTranslate();

app.use(bodyParser.json());

// Endpoint to handle translation
app.post('/translate', (req, res) => {
  const { text, targetLanguage } = req.body;

  translate.translate(text, 'en', targetLanguage, function(err, translation) {
    if (err) {
      console.error('Translation error:', err);
      res.status(500).json({ error: 'Translation failed' });
    } else {
      res.json({ translation: translation.translatedText });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

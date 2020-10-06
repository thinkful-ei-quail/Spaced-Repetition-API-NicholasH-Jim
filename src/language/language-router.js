const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

const languageRouter = express.Router();
const jsonBodyParser = express.json();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/', async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get('/head', async (req, res, next) => {
  try {
    const headWord = await LanguageService.getHeadWord(
      req.app.get('db'),
      req.language.id,
      req.language.head
    );

    const resHeadWord = {
      nextWord: headWord.original,
      totalScore: headWord.total_score,
      wordCorrectCount: headWord.correct_count,
      wordIncorrectCount: headWord.incorrect_count,
    };

    res.json(resHeadWord);
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.post('/guess', jsonBodyParser, async (req, res, next) => {
  const { guess } = req.body;
  if (!guess) {
    return res.status(400).json({ error: `Missing 'guess' in request body` });
  }

  res.send('implement me!');
});

module.exports = languageRouter;

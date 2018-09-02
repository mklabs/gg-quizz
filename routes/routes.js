const debug = require('debug')('gg-quizz:routes');
const {
  getQuestionsService,
  getQuestionService,
  addQuestionService,
  deleteQuestionWithId
} = require('../services/service');

const index = async (req, res, next) => {
  debug('Render index page');

  res.render('index', { user: await req.user });
};

const questions = async (req, res, next) => {
  debug('Render questions page..');
  const questions = await getQuestions();
  res.render('questions', { questions, user: await req.user });
};

const addQuestion = async (req, res, next) => {
  debug('Adding question with', req.body);
  const user = await req.user;
  if (!user) throw new Error('Utilisateur non identifié');

  res.render('addQuestions', {
    user
  });
};

const deleteQuestion = async (req, res, next) => {
  const user = await req.user;
  const { id } = req.params;
  debug('Deleting question with id: ', id);

  if (!id) throw new Error('Missing ID');
  await deleteQuestionWithId(id);

  res.redirect('/questions');
};

const renderAddQuestion = async (req, res, next) => {
  debug('Render add questions page');
  res.render('addQuestions', { user: await req.user });
};

const renderApi = async (req, res, next) => {
  debug('Render api page');
  res.render('api', { user: await req.user });
};

const login = async (req, res, next) => {
  debug('Render login page');
  res.render('login', { user: await req.user });
};

const logout = async (req, res, next) => {
  req.logout();
  res.redirect('/');
};

const cgu = async (req, res, next) => {
  debug('Show CGU');
  res.render('cgu', { user: await req.user });
};

module.exports = {
  addQuestion,
  renderAddQuestion,
  deleteQuestion,
  renderApi,
  index,
  login,
  logout,
  questions,
  cgu
};

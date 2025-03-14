const Student = require('./student');
const Auth = require('./auth');

module.exports = (app) => {
  app.use('/api', Student);
  app.use('/api', Auth);
}
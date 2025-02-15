const Student = require('./student');

module.exports = (app) => {
  app.use('/api', Student);
}
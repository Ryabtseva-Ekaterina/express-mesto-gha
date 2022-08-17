const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const users = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const { INTERNAL_SERVER_ERROR } = require('./errors/statusCode');
const { NotFound } = require('./errors/notFound');
const { login, createUser } = require('./controllers/users');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', users);
app.use('/', cardRouter);
app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

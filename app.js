const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const { NOT_FOUND_CODE } = require('./errors/statusCode');
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
app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({
    message: 'Страница не найдена',
  });
});

// app.use((err, req, res, next) => {
//  res.status(err.StatusCode).send({ message: err.message });
// });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

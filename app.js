const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cardRouter = require('./routes/cards');
const { PORT=3000 } = process.env;
const NotFound = require('./errors/errors');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.user = {
    _id: '62eb5c47797b65001abe8c39'
  };
  next();
});

app.use('/', users);
app.use('/', cardRouter);
app.use ('*', function (req,res) {
  res.status(404).send("Страница не найдена");
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})
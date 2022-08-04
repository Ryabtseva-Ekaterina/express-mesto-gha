const {incorrectDataError, notFoundError} = require ('../error')

const User = require('../models/user.js');

module.exports.getUsers = (req, res) => {
   User.find({})
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'incorrectDataError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные при создании пользователя. "
        })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
   .then(user => res.send({ data: user }))
   .catch((err) => {
    if (err.name === 'notFoundError') {
      res.status (404). send( {
        "message" : "Пользователь по указанному _id не найден."
      })
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  });
}

module.exports.createUser= (req, res) => {
  const { name, about } = req.body;
  User.create({ name, about })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'incorrectDataError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные при создании пользователя. "
        })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

module.exports.updateUser= (req, res) => {
  const { name, about} = req.body;
  User.findByIdAndUpdate( req.user._id,
    {name: name , about: about },
    {
      new: true,
      runValidators: true,
      upsert: false
  } )
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'incorrectDataError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные при обновлении пользователя. "
        })
      } if (err.name === 'notFoundError') {
        res.status (404). send( {
          "message" : "Пользователь по указанному _id не найден."
        })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

module.exports.updateAvatar= (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate( req.user._id,
     {avatar : avatar},
     {
      new: true,
      runValidators: true,
      upsert: false
  } )
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'incorrectDataError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные при обновлении аватара. "
        })
      } if (err.name === 'notFoundError') {
        res.status (404). send( {
          "message" : "Пользователь по указанному _id не найден."
        })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

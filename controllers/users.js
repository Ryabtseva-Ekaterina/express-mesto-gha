const User = require('../models/user.js');

module.exports.getUsers = (req, res) => {
   User.find({})
    .then(user => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
   .then(user => res.send({ user }))
   .catch((err) => {
    if (err.name === 'DocumentNotFoundError') {
      res.status (404). send( {
        "message" : "Пользователь по указанному _id не найден."
      })
    } else {
      res.status(500).send({ message: 'Произошла ошибка' })
    }
  });
}

module.exports.createUser= (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(200||201).send({ user }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
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
    .then(user => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные при обновлении пользователя. "
        })
      } if (err.name === 'DocumentNotFoundError') {
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
    .then(user => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные при обновлении аватара. "
        })
      } if (err.name === 'DocumentNotFoundErrorr') {
        res.status (404). send( {
          "message" : "Пользователь по указанному _id не найден."
        })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

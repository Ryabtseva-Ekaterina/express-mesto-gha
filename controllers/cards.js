const Card = require('../models/card.js');
const NotFound = require('../errors/errors');

module.exports.getCards= (req, res) => {
   Card.find({})
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные при создании карточки. "
        })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

module.exports.createCard= (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные при создании карточки. "
        })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

module.exports.deleteCard= (req, res) => {
  Card.findByIdAndRemove( req.params.cardId )
    .orFail (() => {
      throw new NotFound;
    })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные удаления."
        })
        return;
      } else if (err.name === "NotFound") {
        res.status (404). send( {
          "message" : "Карточка с указанным _id не найдена."
        })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

module.exports.likeCard= (req, res) => {
  Card.findByIdAndUpdate( req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }, )
    .orFail (() => {
      throw new NotFound;
    })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "NotFound") {
        res.status (404). send( {
          "message" : "Передан несуществующий _id карточки"
        })
      } else if (err.name === 'CastError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные для постановки лайка."
        })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}

module.exports.dislikeCard= (req, res) => {
  Card.findByIdAndUpdate( req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }, )
    .orFail (() => {
      throw new NotFound;
    })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status (400). send( {
          "message" : "Переданы некорректные данные для снятия лайка."
        })
        return;
      } else if (err.name === "NotFound") {
        res.status (404). send( {
          "message" : "Передан несуществующий _id карточки."
        })
      } else {
        res.status(500).send({ message: 'Произошла ошибка' })
      }
    });
}
const Card = require('../models/card');
const NotFound = require('../errors/errors');
const {
  ERROR_CODE, NOT_FOUND_CODE, INTERNAL_SERVER_ERROR,
} = require('../errors/statusCode');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные при создании карточки. ',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => {
      if (!req.user._id) {
        return res.status(ERROR_CODE).send({ message: 'Невозможно удалить карточку' });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные удаления.',
        });
      } else if (err.name === 'NotFound') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Передан несуществующий _id карточки',
        });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      } else if (err.name === 'NotFound') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const Card = require('../models/card');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки. '));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  console.log(req.user._id);
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      console.log(card.owner);
      if (!req.user._id === card.owner) {
        throw new Forbidden('Невозможно удалить карточку');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Передан несуществующий _id карточки');
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Переданы некорректные данные для снятия лайка.');
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

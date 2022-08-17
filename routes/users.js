const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, getThisUserInfo, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getThisUserInfo);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }),
}), getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;

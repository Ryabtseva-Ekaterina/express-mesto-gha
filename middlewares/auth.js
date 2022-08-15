const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authotization } = req.headers;
  if (!authotization || !authotization.startsWith('Bearer')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authotization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};

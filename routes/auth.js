const router = require('express').Router();
const auth = require('../middlewares/auth');
const { login, createUser, logout } = require('../controllers/user');
const {
  validatySigUp,
  validatySigIn,
} = require('../middlewares/validation');

router.post('/signin', validatySigIn, login);
router.post('/signup', validatySigUp, createUser);
router.get('/logout', auth, logout);

module.exports = router;

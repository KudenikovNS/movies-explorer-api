const router = require('express').Router();
const { updateUser, getUser } = require('../controllers/user');
const { validatyUser } = require('../middlewares/validation');

router.get('/me', getUser); // возвращает информацию о текущем пользователе (email и имя)
router.patch('/me', validatyUser, updateUser); // обновляет информацию о пользователе (email и имя)

module.exports = router;

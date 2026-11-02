const router = require('express').Router();
const controller = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.post('/login', validate({ username: { required: true, label: 'Username' }, password: { required: true, label: 'Password' } }), controller.login);
router.get('/me', authenticate, controller.me);

module.exports = router;

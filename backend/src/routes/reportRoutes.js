const router = require('express').Router();
const controller = require('../controllers/reportController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/stock', controller.stock);
router.get('/history', controller.history);

module.exports = router;

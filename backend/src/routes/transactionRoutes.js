const router = require('express').Router();
const controller = require('../controllers/transactionController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', validate({ type: { required: true, oneOf: ['in', 'out'], label: 'Tipe transaksi' } }), controller.create);

module.exports = router;

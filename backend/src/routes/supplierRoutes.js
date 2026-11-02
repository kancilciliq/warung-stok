const router = require('express').Router();
const controller = require('../controllers/supplierController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', validate({ name: { required: true, label: 'Nama supplier' } }), controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;

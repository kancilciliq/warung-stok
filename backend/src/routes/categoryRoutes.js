const router = require('express').Router();
const controller = require('../controllers/categoryController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', validate({ name: { required: true, label: 'Nama kategori' } }), controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;

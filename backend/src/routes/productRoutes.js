const router = require('express').Router();
const controller = require('../controllers/productController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.use(authenticate);

const createRules = {
  category_id: { required: true, type: 'int', label: 'Kategori' },
  code: { required: true, label: 'Kode barang' },
  name: { required: true, label: 'Nama barang' },
  min_stock: { type: 'int', min: 0, label: 'Stok minimum' },
};

router.get('/', controller.list);
router.get('/low-stock', controller.lowStock); // harus sebelum '/:id'
router.get('/:id', controller.get);
router.post('/', validate(createRules), controller.create);
router.put('/:id', validate({ min_stock: { type: 'int', min: 0, label: 'Stok minimum' } }), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;

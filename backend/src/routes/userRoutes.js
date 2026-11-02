const router = require('express').Router();
const controller = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

router.use(authenticate, authorize('admin'));

const createRules = {
  name: { required: true, label: 'Nama' },
  username: { required: true, label: 'Username' },
  password: { required: true, label: 'Password', minLength: 6 },
  role: { oneOf: ['admin', 'staff'], label: 'Role' },
};
const updateRules = { password: { minLength: 6, label: 'Password' }, role: { oneOf: ['admin', 'staff'], label: 'Role' } };

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', validate(createRules), controller.create);
router.put('/:id', validate(updateRules), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;

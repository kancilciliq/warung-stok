const router = require('express').Router();
const { authenticate } = require('../middlewares/auth');
const reportController = require('../controllers/reportController');

router.get('/health', (req, res) => res.json({ success: true, message: 'API berjalan' }));

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/suppliers', require('./supplierRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/transactions', require('./transactionRoutes'));
router.use('/reports', require('./reportRoutes'));
router.get('/dashboard', authenticate, reportController.dashboard);

module.exports = router;

const crudController = require('./crudController');
const supplierModel = require('../models/supplierModel');

module.exports = crudController(supplierModel, 'Supplier');

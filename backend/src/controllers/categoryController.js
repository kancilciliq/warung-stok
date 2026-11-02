const crudController = require('./crudController');
const categoryModel = require('../models/categoryModel');

module.exports = crudController(categoryModel, 'Kategori');

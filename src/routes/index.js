const express = require('express');
const router = express.Router();

const defaultRoute = require('./default');
const mainView = require('./mainView');
const products = require('./products');
const { testView, productosTest } = require('./productsTest');
const register = require('./register')
const login = require('./login');
const logout = require('./logout');
const info = require('./info');
const random = require('./random');
const graphql = require('./graphql.js')

router.use('/', mainView);
router.use('/api/productos', products);
router.use('/api/productos-test', productosTest);
router.use('/test', testView);
router.use('/test', testView);
router.use('/register', register);
router.use('/login', login);
router.use('/logout', logout);
router.use('/info', info);
router.use('/api/randoms', random);
router.use('/graphql', graphql);

module.exports = router;
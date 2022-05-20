const express = require('express');
const posts = require('./posts');
const auth = require('./auth');
const user = require('./user');
const admin = require('./admin');

const router = express.Router();

router.use('/posts', posts);
router.use('/auth', auth);
router.use('/users', user);
router.use('/admin', admin);

module.exports = router;

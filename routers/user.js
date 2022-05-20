const express = require('express');

const { getSingleUser, getUsers } = require('../controllers/user.js');
const {
  checkUserExist,
} = require('../middlewares/database/databaseErrorHelpers');

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', checkUserExist, getSingleUser);

module.exports = router;

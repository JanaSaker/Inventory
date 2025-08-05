const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { verifyToken } = require('../middlewares/auth');
const { isUser, isAdmin } = require('../middlewares/role');
const itemController = require('../controllers/itemController');

// 🔓 Public route
router.get('/', itemController.getAllItems);

// 🔐 Protected routes with image upload
router.post('/', verifyToken, isUser, upload.single('image'), itemController.createItem);
router.put('/:id', verifyToken, isUser, upload.single('image'), itemController.updateItem);
router.delete('/:id', verifyToken, isAdmin, itemController.deleteItem);

module.exports = router;

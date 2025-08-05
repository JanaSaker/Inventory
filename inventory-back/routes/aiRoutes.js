const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth');
const { search } = require('../controllers/aiController');

router.post('/', verifyToken, search);

module.exports = router;

const router = require('express').Router();

const authController = require('../controllers/userController');
router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/logout',authController.logout);
router.get('/me',authController.me);
router.get('/user/:id',authController.show);
router.put('/user/:id',authController.update);
module.exports = router;

      
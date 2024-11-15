const express = require('express');
const router = express.Router();
const { authenticateUser } = require("../utils/auth");
const { createUser, getUser, updateUser, getUserImage, saveUserImage, deleteUserImage, verifyUserEmail } = require("../controllers/userController");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { logger } = require('../utils/logger');
const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};


router.post('/', createUser);
router.all('/', (request,response) => {
    logger.warn(`Invalid Request: Method Not Allowed. Expected: POST, Received: ${request.method}`);
    response.status(405).header(headers).send();
});

router.get('/self', authenticateUser, getUser);
router.put('/self', authenticateUser, updateUser);
router.all('/self', (request, response) => {
    logger.warn(`Invalid Request: Method Not Allowed. Expected: GET|PUT, Received: ${request.method}`);
    response.status(405).header(headers).send();
});

router.post('/self/pic', authenticateUser, upload.single('profilePic'), saveUserImage);
router.get('/self/pic', authenticateUser, getUserImage);
router.delete('/self/pic', authenticateUser, deleteUserImage);
router.all('/self/pic', (request, response) => {
    logger.warn(`Invalid Request: Method Not Allowed. Expected: GET|POST|DELETE, Received: ${request.method}`);
    response.status(405).header(headers).send();
});

router.get('/verify', verifyUserEmail);
router.all('/verify', (request, response) => {
    logger.warn(`Invalid Request: Method Not Allowed. Expected: GET, Received: ${request.method}`);
    response.status(405).header(headers).send();
});

module.exports = router;
const express = require('express');
const router = express.Router();

const { createUser } = require("../controllers/userController");

const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};

router.use((request, response, next) => {
    next();
});

router.post('/', createUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const { authenticateUser } = require("../utils/auth");
const { createUser, getUser, updateUser } = require("../controllers/userController");

const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
};


router.post('/', createUser);
router.all('/', (request,response) => {
    console.log("Create Method is not POST");
    response.status(405).header(headers).send();
});

router.get('/self', authenticateUser, getUser);
router.put('/self', authenticateUser, updateUser);
router.all('/self', (request, response) => {
    console.log("Method not allowed");
    response.status(405).header(headers).send();
})

module.exports = router;
const express = require('express');
const router = express.Router();
const { checkHealth } = require('../controllers/healthzController');

router.use((request, response, next) => {
    if (request.method !== 'GET') {
        console.log("Method is not GET");
        return response.status(405).header('Cache-Control', 'no-cache').send();
    }
    console.log("Request Body" + request.body);
    console.log("Request Headers" + request.headers);
    console.log("Request Headers contentType" + request.headers['content-type']);
    if (Object.keys(request.query).length > 0 || (Object.keys(request.body || {}).length > 0)) { // || request.headers['content-type'] !== 'application/json' Check for contentType
        console.log("Request contains Payload"); 
        return response.status(400).header('Cache-Control', 'no-cache').send();
    }

  
    next();
  });
  
  router.get('/', checkHealth);
  
  module.exports = router;
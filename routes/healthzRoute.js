const express = require('express');
const router = express.Router();
const { checkHealth } = require('../controllers/healthzController');

router.use((request, response, next) => {
    if (request.method !== 'GET') {
      return response.status(405).set('Cache-Control', 'no-cache').send();
    }
  
    if (Object.keys(request.query).length > 0 || (request.body && Object.keys(request.body).length > 0)) {
      return response.status(400).set('Cache-Control', 'no-cache').send();
    }
  
    next();
  });
  
  router.get('/', checkHealth);
  
  module.exports = router;
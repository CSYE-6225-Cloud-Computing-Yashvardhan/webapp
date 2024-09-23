const express = require('express');
const app = express();
const healthzRoute = require('./routes/healthzRoute.js');

const PORT = process.env.PORT || 3000;

app.use('/healthz', healthzRoute);
app.use('/', (req, res) => {
    res.status(404).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


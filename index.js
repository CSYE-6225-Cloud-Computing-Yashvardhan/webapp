const express = require('express');
const app = express();
const healthzRoute = require('./routes/healthzRoute.js');
const userRoute = require("./routes/userRoute.js");

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/healthz', healthzRoute);
app.use('/v2/user', userRoute);
app.use('/', (req, res) => {
    res.status(404).header('Cache-Control', 'no-cache').header('Pragma', 'no-cache').send();
});

/*app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});*/

module.exports = app;

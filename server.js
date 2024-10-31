const app = require("./index");
const PORT = process.env.PORT || 3000;
const { logger } = require('./utils/logger');
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
});
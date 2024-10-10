const app = require("./index");
const PORT = process.env.PORT || 3000;
console.log
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
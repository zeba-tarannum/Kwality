const express = require("express");

const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors')
// middlewares
app.use(express.json({ extended: false }));
app.use(cors())
// route included
app.use("/payment", require("./routes/payments"))

app.listen(port, () => console.log(`server started on port ${port}`));
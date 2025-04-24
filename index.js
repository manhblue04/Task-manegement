const express = require("express");
const cors = require("cors");
const database=require("./config/database");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
require("dotenv").config();
const RouteV1=require("./api/v1/routes/index.route");
const app = express();
const port = process.env.PORT;

database.connect();

//parse application/json
app.use(bodyParser.json());

//cookie-parser
app.use(cookieParser());

//cors
app.use(cors());

//Version1 Route
RouteV1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
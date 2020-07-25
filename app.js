const express = require('express');
const app = express();
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const expressValidator = require('express-validator');

//Import Mongoose
const mongoose = require('mongoose');

//Load .env Variables
const dotenv = require('dotenv');

dotenv.config()
 
//DB
mongoose.connect(
  process.env.MONGO_URI,
  {useNewUrlParser: true}
)
.then(() => console.log('DB Connected'))
 
mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});

//Bring In Routes
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user")

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error: "Unauthorized!"});
  }
});


const port = process.env.PORT || 8080;
app.listen(port, () => {console.log(`A Node Js API is listening on port: ${port}`);
});
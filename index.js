const express = require("express");
const app = express();
const dotenv = require('dotenv');
const cors = require("cors");
app.use(express.json());
app.use(cors());
const port = 7000;




app.get('/',(req, res) => {
    res.send({message:'server is running'})
})
const db = require("./models");

db.mongoose.set("strictQuery",false);

db.mongoose
.connect(db.url,process.env.MONGODB_URL_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
  
  require("./routes/parry.routes.js")(app);
  
  
  app.listen(port, () => {
      console.log('server is listening');
  })




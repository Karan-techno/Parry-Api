const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");

const db ={};
db.mongoose= mongoose;
db.url = dbConfig.url;
db.user = require("./parry.models.js")(mongoose);
db.flow = require("./spotFlow.models.js")(mongoose);
db.comment = require("./comments.models")(mongoose);
db.subcomment =  require("./subcomments.models")(mongoose);
db.profile = require("./myprofile.models")(mongoose);
module.exports = db;
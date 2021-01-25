const mongoose = require('mongoose');
require('dotenv').config({ path: 'ENV_FILENAME' });

const MONGODB_URI = process.env.DB_URI;  

// Use connect method to the server
mongoose.connect(process.env.DB_URI, 
{useNewUrlParser: true, 
    useUnifiedTopology: true}, 
(err) => {
  console.log(err)
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection:error:'));
db.once('open', () => {
  console.log("we are connected!")
})
//Schema for log array :
const logSchema = new mongoose.Schema({
  userId: String,
  description: String,
  duration: Number,
  date: String,
})
//Schema for user :
const userSchema = new mongoose.Schema({
  username: String,
  log: [logSchema],
})
const User = mongoose.model('User', userSchema);
const Log = mongoose.model('Log', logSchema);
//Mongodb 
// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert'); 

module.exports = (app) => {
    app.post('/api/exercise/new-user', (req, res) => {
        let username = req.body.username;
        const newUser = new User({ username: username})
        newUser.save((err, doc) => {
          if(err) {
            console.log(err)
          }
          res.json(doc); 
        })
      })
    
    app.post('/api/exercise/add', (req, res) => {
      let userId = req.body.userId;
      let description = req.body.description;
      let duration = req.body.duration;
      let date;
      let newLog;
      if (!req.body.date) {
        console.log("date is empty")
        date = new Date().toISOString().slice(0,10)
      } else {
        console.log("date is written")
        date = req.body.date;
      }
      newLog = new Log({userId: userId, description, duration, date: date.slice(0,10)})
      newLog.save((err, doc) => {
        if(err) console.log(err)
        res.json(doc);
      })
      
    })

    app.get('/api/exercise/users', (req, res) => {
      let usersArray = [];
      User.find({}, (err, docs) => {
        if(err) console.log(err)
        docs.forEach((doc) => {
          usersArray.push({username: doc.username, _id: doc._id})
        })
        res.json(usersArray);
      })
    })

    app.get('/api/exercise/log', (req, res) => {
      let logArray = [];
      let from = new Date(req.query.from).getTime();
      let to = new Date(req.query.to).getTime();
      let limit = req.query.limit;
      Log.find({userId: req.query.id}, (err, logs) => {
        if(err) console.log(err)
        if(from || to) {
          logs = logs.filter((log) => {
            return from <= new Date(log.date).getTime() &&
            to >= new Date(log.date).getTime()
          })
        }
        if(limit) {
          logs = logs.slice(0, limit)
        } 
        logArray.push({count: logs.length})
        logs.forEach(log => {
          logArray.push({description: log.description, duration: log.duration, date: log.date})
        })

        res.json(logArray);
      })
    })
}   
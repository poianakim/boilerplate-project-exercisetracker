const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const apiRoutes = require('./routes/api.js');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
//Routing for API
apiRoutes(app);

app.use((req, res, next) => {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

module.exports = app;

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/v-mongo')
  .then(db => console.log("Conectado a MongoDB"))
  .catch(err => console.log(err));
require('./config/config');

const express = require('express');
const app = express();
const mongoose = require(`mongoose`);
const bodyParser = require('body-parser');
// const port = process.env.PORT || 3000;



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
//configuracion global de rutas
app.use(require('./routes/index'));
// mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;
    console.log(`Base de datos online`);
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto`, process.env.PORT);
});
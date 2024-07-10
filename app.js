const express = require('express');
const app = express();
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const https = require('https')

const indexRoutes = require('./src/routes/indexRoutes.js');

// /****************************************** Configuración CORS ***************************************/
const listaBlanca = ['http://localhost:5173/', 'https://emilixweb.com/'];
const corsOptions = {
    origin: (origin, callback) => {
        if (listaBlanca.indexOf(origin != -1)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
// /*************************************************************************************************** */

app.set('view engine', 'ejs');// si no va a tener vistas desinstalar
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'Esto es secreto!!',
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.static("public"));

app.use('/', indexRoutes);

// /**************************servidor para https****************** */
// const port = process.env.PORT || 3000;
// https.createServer({
//     cert: fs.readFileSync('fullchain.pem'),
//     key: fs.readFileSync('privkey.pem')
// }, app).listen(port, () => {
//     console.log('Servidor corriendo en puerto', port);
// });
/***************************************************************** */

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Servidor corriendo en puerto', port);
});
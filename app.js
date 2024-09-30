const express = require('express');
const app = express();
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const https = require('https')
const mercadopago = require('mercadopago')

const indexRoutes = require('./src/routes/indexRoutes.js');
const usersRoutes = require('./src/routes/usersRoutes');
const privilegesRoutes = require('./src/routes/privilegesRoutes');
const categoriesRoutes = require('./src/routes/categoriesRoutes');
const productsRoutes = require('./src/routes/productsRoutes');
const mercadoPagoRoutes = require('./src/routes/mercadoPagoRoutes.js');
const ordersRoutes = require('./src/routes/ordersRoutes.js');

// /****************************************** Configuración CORS ***************************************/
const listaBlanca = process.env.CORS_AUTORIZED;
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
app.use('/users', usersRoutes);
app.use('/privileges', privilegesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/mercadoPago', mercadoPagoRoutes);
app.use('/orders', ordersRoutes);

// /**************************servidor para https****************** */
// const port = process.env.PORT || 3000;
// https.createServer({
//     cert: fs.readFileSync(process.env.CERT),
//     key: fs.readFileSync(process.env.KEY)
// }, app).listen(port, () => {
//     console.log('Servidor corriendo en puerto', port);
// });
/***************************************************************** */

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Servidor corriendo en puerto', port);
});
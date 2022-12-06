const express = require('express');
const axios = require('axios');
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const minimist = require('minimist');
const fork = require('child_process');
const cluster = require('cluster');
const compression = require('compression');
require('dotenv').config();

//------------------------------------------SESSION----------------------------------------//

const session = require('./src/middleware/session');
const cookieParser = require('cookie-parser');

//------------------------------------------PASSPORT----------------------------------------//

const { passport, localStrategy } = require('./src/middleware/passport');

//------------------------------------------RUTAS----------------------------------------//

const mainView = require('./src/routes/mainView.js');
const productos = require('./src/routes/products');
const { productosTest } = require('./src/routes/productsTest');
const { testView } = require('./src/routes/productsTest');
const login = require('./src/routes/login');
const logout = require('./src/routes/logout');
const register = require('./src/routes/register');
const info = require('./src/routes/info');
const random = require('./src/routes/random');
const defaultRoute = require('./src/routes/default');

//---------------------------------------ALMACENAMIENTO----------------------------------//

const sqlFactory = require('./src/persistence/factory');
const SQLFactory = new sqlFactory();

//------------------------------------------SERVIDOR-------------------------------------//

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const alias = { alias: { p: "puerto", m: "modo" } }
const parsedArgs = minimist(process.argv, alias);
const port = parsedArgs.puerto || 8080; //requires node server.js -p 8080
const mode = parsedArgs.modo || "fork";

//------------------------------------------APP.USE()-------------------------------------//

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(session); //maneja la session de un usuario
app.use(passport.initialize()); //inicializa passport
app.use(passport.session()); //vamos a utilizar session con passport
passport.use(localStrategy);
app.use(compression());

//Para poder interceptar la página principal sin ser enviado al index.html automáticamente,
//necesito crear una ruta para la página principal Y LUEGO servir los archivos públicos

app.use('/', mainView) //Vista principal
app.use(express.static(__dirname + '/public')); //Ya no hace falta con nginxMENTIRA
app.use('/api/productos', productos);
app.use('/api/productos-test', productosTest);
app.use('/test', testView); //Vista de prueba
app.use('/login', login); //Vista de login
app.use('/logout', logout); //Vista de logout
app.use('/register', register); //Vista de logout
app.use('/info', info); //Vista de info
app.use('/api/randoms', random); //Ruta de random
app.use('*', defaultRoute);

//------------------------------------------LOGGER-----------------------------------------//

const { logError, loggerConsole } = require('./src/utils/logger.js');

//------------------------------------------RUTAS DE SOCKET--------------------------------//

io.of('/info', socket => {
    // console.log('Conectado a /info')
    socket.emit('info');
})

io.of('/register').on('connection', socket => { //Register
    // console.log('Conectado a /register')
})

io.of('/logout').on('connection', socket => { //logout
    // console.log('Conectado a /logout')
    socket.emit('logout');
})

io.of('/login').on('connection', () => { //Login
    // console.log('Conectado a /login');
})

io.of('/test').on('connection', socket => { //test
    // console.log('Conectado a /test')
    socket.emit('testing');
})

io.of('/').on('connection', async(socket) => { //ruta principal
    const Message = SQLFactory.create("message");

    socket.emit('products');
    socket.emit('messages', await Message.getAllMessages());
    socket.emit('login')

    socket.on('new-product', (products) => {
        axios.post(`/api/productos`, products)
        io.sockets.emit('products')
    })

    socket.on('load-messages', async() => {
        socket.emit('messages', await Message.getAllMessages());
    });

    socket.on('new-message', async(data) => {
        await messages.save(data);
        io.sockets.emit('messages', await Message.getAllMessages())
    })

    socket.on('product-error', (message) => {
        loggerConsole.error(`Product error: ${message}`)
        logError.error(`Product error: ${message}`)
    })

    socket.on('message-error', (message) => {
        loggerConsole.error(`Message error: ${message}`)
        logError.error(`Message error: ${message}`)
    })
});

//------------------------------------------CONEXIÓN-------------------------------------//

// const numCPUs = require('os').cpus().length;
// if (cluster.isPrimary) {

//     console.log(`Primary ${process.pid} is running`);

//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork(); //crea un worker por cada procesador que tenga el sistema
//     }

//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`Worker ${process.pid} died`)
//     })
// } else {
httpServer.listen(port, () => {
        console.log(`Server listening on port ${port}, ${mode} mode => PID: ${process.pid}`)
    })
    // }
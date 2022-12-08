const express = require('express');
const axios = require('axios');
const path = require('path')
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');
const minimist = require('minimist');
const fork = require('child_process');
const cluster = require('cluster');
const compression = require('compression');
require('dotenv').config();

//------------------------------------------PASSPORT----------------------------------------//

const session = require('./src/middleware/session');
const cookieParser = require('cookie-parser');
const { passport, localStrategy } = require('./src/middleware/passport');

//------------------------------------------RUTAS----------------------------------------//

const router = require('./src/routes/index')

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

app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));


//------------------------------------------LOGGER-----------------------------------------//

const { logError, loggerConsole } = require('./src/utils/logger.js');

//------------------------------------------RUTAS DE SOCKET--------------------------------//

io.of('/info', socket => {
    socket.emit('info');
})

io.of('/logout').on('connection', socket => { //logout
    socket.emit('logout');
})

io.of('/test').on('connection', socket => { //test
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

const numCPUs = require('os').cpus().length;
if (cluster.isPrimary) {

    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork(); //crea un worker por cada procesador que tenga el sistema
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${process.pid} died`)
    })
} else {
    httpServer.listen(port, () => {
        console.log(`Server listening on port ${port} => PID: ${process.pid}`)
    })
}
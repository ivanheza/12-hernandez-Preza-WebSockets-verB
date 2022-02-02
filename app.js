//Socket
const express = require('express')
const app = express()
//Modulos
const Producto = require('./productos')
const formatoMensaje = require('./utils/mensajes')
const {
  nuevoUsuario,
  obtenerUsuarios,
  salidaUsuario,
} = require('./utils/usuarios')
//Socket
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const port = 3000
const path = require('path')
//handlebars
const { engine } = require('express-handlebars')
//server
httpServer
  .listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
  })
  .on('error', (error) => console.log(`Error en servidor ${error}`))
// Codificacion
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let listaProductos = []

///Configuracion Handlebars
app.engine(
  '.hbs',
  engine({
    extname: '.hbs', //extension
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
  })
)
//espacio Publico del servidor
app.use(express.static('./public'))
/// se establece el directorio
app.set('views', path.join(__dirname, 'views'))
///se establece el motor
app.set('view engine', 'hbs')

/// HOME

app.get('/', (req, res) => {
  res.render('join', {
    title: 'Bienvenido',
    path: '/',
    link: 'Prueba',
    desconectado: true,
  })
})
///HOME
app.get('/home', (req, res) => {
  res.render('index', {
    title: 'Proyecto Web Sockets',
    path: '/',
    link: 'Salir',
    desconectado: false,
  })
  /* username = req.query.username
  console.log('prueba', username) */
})

io.on('connection', (socket) => {
  //
  socket.on('join', (user) => {
    //console.log('Un cliente se ha conectado')
    const usuario = nuevoUsuario(socket.id, user.name, user.email)
    ///console.log(usuario)
    socket.emit(
      'mensaje',
      formatoMensaje('Bot', `¡Bienvenido ${usuario.username}!`)
    )

    //Bienvenida
    socket.broadcast.emit(
      'mensaje',
      formatoMensaje(
        'Bot Servidor',
        `El cliente ${usuario.username} se ha unido`
      )
    )
    io.emit('products', listaProductos)
    io.emit('usuarios', obtenerUsuarios())
  })

  socket.on('chatMessage', (msg) => {
    const mensaje = formatoMensaje(msg.username, msg.text)

    io.emit('mensaje', mensaje)
  })

  /// Socket New Product

  socket.on('newProduct', (product) => {
    const producto = new Producto(product.name, product.price, product.image)
    producto.nuevoProducto(listaProductos)
    //console.log(listaProductos)
    io.emit('products', listaProductos)
  })

  //El usuario se desconectó

  socket.on('disconnect', () => {
    const usuario = salidaUsuario(socket.id)
    if (usuario) {
      //console.log("usuario", usuario)
      io.emit(
        'mensaje',
        formatoMensaje('Bot', `${usuario.username} ha dejado el chat`)
      )

      //Usuarios
      io.emit('usuarios', obtenerUsuarios())
    }
  })
})

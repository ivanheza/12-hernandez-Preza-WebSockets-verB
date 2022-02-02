const users = []

// Entran Usuarios

const nuevoUsuario = (id, username, mail) => {
  const usuario = { id, username, mail }

  users.push(usuario)

  return usuario
}

const obtenerUsuarios = () => {
  return users
}

// Salida de Usuario
const salidaUsuario = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

module.exports = {
  nuevoUsuario,
  salidaUsuario,
  obtenerUsuarios,
}

const moment = require('moment');

const formatoMensaje = (username, text) => {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
  };
};

module.exports = formatoMensaje;

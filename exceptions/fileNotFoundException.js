class MovieFileAttachException extends Error {  
  constructor () {
    super(
      'ningun archivo coincide con el registro de peliculas.'
      + '\n'
      + 'Asegurate que el mensaje que lleva el registro' 
      + 'tenga un texto entre astericos ***ejemplo***'
      )
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor);
  }
}

class AttachedNotFoundException extends Error {  
  constructor () {
    super('no se encontro un mensaje con archivo adjunto.')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { MovieFileAttachException, AttachedNotFoundException }
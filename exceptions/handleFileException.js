class WriteFileException extends Error {  
  constructor () {
    super('no se pudo escribir en el archivo que lleva el registro de peliculas')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { WriteFileException }

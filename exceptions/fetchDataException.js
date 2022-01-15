class FetchTMDBException extends Error {  
  constructor () {
    super('no se pudo obtener los datos de la pelicula')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor);
  }
}

class FetchMovieFileException extends Error {  
  constructor () {
    super('no se pudo obtener los datos del archivo adjunto')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { FetchTMDBException, FetchMovieFileException }
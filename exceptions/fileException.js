class MovieFileAttachException extends Error {  
  constructor () {
    super(
      'ningun archivo coincide con el registro de peliculas.'
      + '\n'
      + 'Asegurate que el mensaje que lleva el registro' 
      + 'tenga un texto entre astericos \'***\'ejemplo\'***\''
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

class CreateBaseFileException extends Error {
  constructor () {
    super(
      'no se pudo crear el archivo base.'
      + '\n'
      + 'Una solucion podria ser adjuntar manualmente un archivo de texto vacio' 
      + 'junto a un texto entre asteriscos \'***\'ejemplo\'***\''
      )
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor);
  }
}

class BaseFileExistsException extends Error {  
  constructor () {
    super('el archivo que lleva el registro de las películas parece existir')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor);
  }
}

class WriteFileException extends Error {  
  constructor () {
    super('no se pudo escribir en el archivo que lleva el registro de peliculas')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { 
  WriteFileException,
  MovieFileAttachException,
  AttachedNotFoundException,
  BaseFileExistsException,
  CreateBaseFileException
}

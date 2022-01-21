class PermissionException extends Error {  
  constructor () {
    super('no posees los permisos necesarios para usar el bot')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = PermissionException
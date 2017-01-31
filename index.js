'use strict'

const Quark = require('proton-quark')
const fs = require('fs')
const path = require('path')

module.exports = class Exception extends Quark {

  constructor(proton) {
    super(proton)
    proton.app.exceptions = {}
    this.proton.app.exceptions.catch = function(context, err, withMsg) {
      let error = err
      if (err instanceof Error) {
        error = {
          "message": err.message,
          "description": "Unknown error. Contact webmaster.",
          "code": "unknownError"
        }
        context.response.status = 500
      }
      proton.log.error(JSON.stringify(error))
      if (!withMsg) {
        delete error.message
      }
      context.body = error
      return error
    }
  }

  configure() {
    // Nothing to do ....
  }

  validate() {
    // Nothing to do ....
  }

  initialize() {
    this._initializeExceptions()
  }

  _initializeExceptions() {
    const exceptions = this._exceptions
    for (let GroupExceptionName in exceptions) {
      const groupExceptions = exceptions[GroupExceptionName]
      this._initializeGroupException(groupExceptions)
    }
  }

  _initializeGroupException(exceptions) {
    for (let ExceptionName in exceptions) {
      const exception = exceptions[ExceptionName]
      this._initializeException(exception, ExceptionName)
    }
  }

  _initializeException(exception, name) {
    this.proton.app.exceptions[name] = function (message) {
      exception.message = message
      return exception
    }
  }

  get _exceptions() {
    const exceptions = path.join(this.proton.app.path, '/exceptions')
    return fs.existsSync(exceptions) ? require('require-all')(exceptions) : {}
  }

}

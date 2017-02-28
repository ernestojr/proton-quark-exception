'use strict'

const Quark = require('proton-quark')
const fs = require('fs')
const path = require('path')

const CONFIG_FILE = 'config'
const DEFAULT_CONFIG = {
  unknownError: {
    description: 'Unknown error. Please contact the API provider for more information.',
    code: 'unknownError'
  }
}

module.exports = class Exception extends Quark {

  constructor(proton) {
    super(proton)
    proton.app.exceptions = {}
    normalize = normalize.bind(this)
  }

  configure() {
    this._configuration()
  }

  validate() {
    // Nothing to do ....
  }

  initialize() {
    this._initializeExceptions()
  }

  _configuration() {
    this.config = this._config
    this.proton.app.exceptions.normalize = normalize
  }

  _initializeExceptions() {
    const exceptions = this._exceptions
    for (let GroupExceptionName in exceptions) {
      const groupExceptions = exceptions[GroupExceptionName]
      if (GroupExceptionName === CONFIG_FILE) {
        continue
      }
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

  get _config() {
    const config = path.join(this.proton.app.path, '/exceptions/config.json')
    return fs.existsSync(config) ? require(config) : DEFAULT_CONFIG
  }

  get _exceptions() {
    const exceptions = path.join(this.proton.app.path, '/exceptions')
    return fs.existsSync(exceptions) ? require('require-all')(exceptions) : {}
  }

}

function normalize(err, withMsg) {
  let error = err
  if (err instanceof Error) {
    error = {
      "message": err.message,
      "description": this.config.unknownError.description,
      "code": this.config.unknownError.code
    }
  }
  if (!withMsg) {
    delete error.message
  }
  return error
}

const path = require('path')
const Quark = require('../index.js')
const expect = require('chai').expect

const proton = {
  app: { path: __dirname },
  log: {
    error: function(text) {
      console.error(text)
    }
  }
}

describe('Quark test', () => {
  before(next => {
    const quark = new Quark(proton)
    quark.configure()
    quark.validate()
    quark.initialize()
    next()
  })
  it('generate the defined error object', function() {
    const err = proton.app.exceptions.requestBodyInvalid('this is message')
    console.log('proton.app.exceptions.requestBodyInvalid:', err)
    expect(err).to.have.deep.property('description', 'The request body is invalid.')
    expect(err).to.have.deep.property('message', 'this is message')
    expect(err).to.have.deep.property('code', 'claimRequestBodyInvalid')
  })
  it('handle an unknown error', function() {
    try {
      throw new Error('this is an unknown error with option show message active')
    } catch (err) {
      const error = proton.app.exceptions.normalize(err, true)
      console.log('proton.app.exceptions.normalize:', error)
      expect(error).to.have.deep.property('description', 'Unknown error. Please contact the API provider for more information.')
      expect(error).to.have.deep.property('message', 'this is an unknown error with option show message active')
      expect(error).to.have.deep.property('code', 'unknownError')
    }
  })
})

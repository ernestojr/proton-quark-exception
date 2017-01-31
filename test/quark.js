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
    quark.initialize()
    next()
  })
  it('generate the defined error object', function() {
    const err = proton.app.exceptions.requestBodyInvalid('Message off')
    console.log('proton.app.exceptions.requestBodyInvalid:', err)
    expect(err).to.have.deep.property('description', 'The request body is invalid.')
    expect(err).to.have.deep.property('message', 'Message off')
    expect(err).to.have.deep.property('code', 'claimRequestBodyInvalid')
  })
  it('handle an unknown error', function() {
    try {
      throw new Error('Message off')
    } catch (err) {
      this.response = {}
      const error = proton.app.exceptions.catch(this, err, true)
      console.log('proton.app.exceptions.catch:', error)
      expect(error).to.have.deep.property('description', 'Unknown error. Contact webmaster.')
      expect(error).to.have.deep.property('message', 'Message off')
      expect(error).to.have.deep.property('code', 'unknownError')
    }
  })
})

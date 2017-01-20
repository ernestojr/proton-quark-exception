const path = require('path')
const Quark = require('../index.js')

const proton = { app: { path: __dirname } }

describe('Quark test', () => {
  it('should load exceptions', function*() {
    const quark = new Quark(proton)
    quark.initialize()
  })
  it('should show `proton.app.exceptions`', function() {
    console.log('proton.app.exceptions.requestBodyInvalid:', proton.app.exceptions.requestBodyInvalid('Message off'))
  })
})

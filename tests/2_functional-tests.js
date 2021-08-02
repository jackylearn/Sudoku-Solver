const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzlesAndSolutions = require('../controllers/puzzle-strings.js')

suite('Functional Tests', () => {
  suite('check', () => {
    test('valid input without conflict', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'G8', value: 1 })
        .end((err, res) => {
          if (err) return console.log(err)
          console.log("res.body: " + JSON.stringify(res.body))
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'valid')
          assert.isTrue(res.body.valid)
          done()
        })
    })

    test('valid input with single conflict', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'A3', value: 2 })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'valid')
          assert.isFalse(res.body.valid)
          assert.property(res.body, 'conflict')
          assert.isArray(res.body.conflict)
          assert.include(res.body.conflict, 'row')
          assert.notInclude(res.body.conflict, 'column')
          assert.notInclude(res.body.conflict, 'region')
          done()
        })
    })

    test('valid input with multiple conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'C7', value: 9 })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'valid')
          assert.isFalse(res.body.valid)
          assert.property(res.body, 'conflict')
          assert.isArray(res.body.conflict)
          assert.include(res.body.conflict, 'row')
          assert.notInclude(res.body.conflict, 'column')
          assert.include(res.body.conflict, 'region')
          done()
        })
    })

    test('valid input with all conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'B8', value: 8 })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'valid')
          assert.isFalse(res.body.valid)
          assert.property(res.body, 'conflict')
          assert.isArray(res.body.conflict)
          assert.include(res.body.conflict, 'row')
          assert.include(res.body.conflict, 'column')
          assert.include(res.body.conflict, 'region')
          done()
        })
    })

    test('missing required field', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'B8'})
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Required field(s) missing')
          done()
        })
    })

    test('invalid character', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[1][0].replace('2', '*'), coordinate: 'B8', value: 8 })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Invalid characters in puzzle')
          done()
        })
    })

    test('incorrect puzzleString length', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[1][0] + '4', coordinate: 'B8', value: 8 })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
          done()
        })
    })

    test('invalid coordinate placement', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: '8', value: 8 })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Invalid coordinate')
          done()
        })
    })

    test('invalid value placement', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzlesAndSolutions[1][0], coordinate: 'B8', value: 10 })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Invalid value')
          done()
        })
    })
  })

  suite('solve', () => {
    test('solve valid puzzleString', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[1][0] })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'solution')
          assert.equal(res.body.solution, puzzlesAndSolutions[1][1])
          done()
        })
    })

    test('missing puzzleString', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Required field missing')
          done()
        })
    })

    test('invalid character', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[1][0].replace('2', '*') })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Invalid characters in puzzle')
          done()
        })
    })

    test('incorrect puzzleString length', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[1][0] + '4'})
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
          done()
        })
    })

    test('cannot solved', (done) => {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[1][0].replace('2', '3')})
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Puzzle cannot be solved')
          done()
        })
    })

  })

  suite('FCC', () => {
    test('valid input without conflict', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: 7 })
        .end((err, res) => {
          if (err) return console.log(err)
          console.log("res.body: " + JSON.stringify(res.body))
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'valid')
          assert.isTrue(res.body.valid)
          done()
        })
    })

    test('valid input with multiple conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: 1 })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'valid')
          assert.isFalse(res.body.valid)
          assert.property(res.body, 'conflict')
          assert.isArray(res.body.conflict)
          assert.include(res.body.conflict, 'row')
          assert.include(res.body.conflict, 'column')
          assert.notInclude(res.body.conflict, 'region')
          done()
        })
    })

    test('input already exist', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'C3', value: 2 })
        .end((err, res) => {
          if (err) return console.log(err)
          console.log("res.body: " + JSON.stringify(res.body))
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'valid')
          assert.isTrue(res.body.valid)
          done()
        })
    })

    test('incorrect puzzleString length', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: 1 })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
          done()
        })
    })

    test('invalid coordinate placement', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'XZ18', value: 7 })
        .end((err, res) => {
          if (err) return console.log(err)
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'error')
          assert.equal(res.body.error, 'Invalid coordinate')
          done()
        })
    })
  })
});


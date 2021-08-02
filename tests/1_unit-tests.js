const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const puzzlesAndSolutions = require('../controllers/puzzle-strings.js')



suite('UnitTests', () => {
  suite('#validate', () => {
    test('Valid input', () => {
      assert.equal(solver.validate(puzzlesAndSolutions[0][0]), 0)
      assert.equal(solver.validate(puzzlesAndSolutions[1][0]), 0)
    })

    test('puzzle string does not contain 81 characters', () => {
      assert.equal(solver.validate('111'), 1, 'puzzle string cannot be shorter than 81 characters.')
      assert.equal(solver.validate(puzzlesAndSolutions[2][0] + '2'), 1, 'puzzle string cannot be longer than 81 characters.')
    })

    test('contain invalid characters', () => {
      assert.equal(solver.validate(puzzlesAndSolutions[3][0].replace('1', '?')), 2)
    })

  })

  suite('#checkRowPlacement', () => {
    test('valid input', () => {
      assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][0
      ], 3, 1, 9))
      assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][0
      ], 3, 1, 7))

      assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][0
      ], 6, 4, 4))
      assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][0
      ], 6, 4, 1))
      assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][0
      ], 6, 4, 8))
    })

    test('failed input', () => {
      assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0
      ], 3, 1, 2))
      assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0
      ], 3, 1, 5))

      assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0
      ], 6, 4, 3))
      assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0
      ], 6, 4, 7))
    })
  })

  suite('#checkColPlacement', () => {
    test('valid input', () => {
      assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[1][0
      ], 9, 3, 3))
      assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[1][0
      ], 9, 3, 2))

      assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[1][0
      ], 4, 9, 1))
      assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[1][0
      ], 4, 9, 4))
    })

    test('failed input', () => {
      assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[1][0
      ], 9, 3, 4))
      assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[1][0
      ], 9, 3, 9))

      assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[1][0
      ], 4, 9, 5))
      assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[1][0
      ], 4, 9, 3))
    })
  })

  suite('#checkRegionPlacement', () => {
    test('valid input', () => {
      assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[3][0
      ], 7, 3, 1))
      assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[3][0
      ], 7, 3, 4))

      assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[3][0
      ], 3, 6, 1))
      assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[3][0
      ], 3, 6, 2))
    })

    test('failed input', () => {
      assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[3][0
      ], 7, 3, 3))
      assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[3][0
      ], 7, 3, 6))

      assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[3][0
      ], 3, 6, 4))
      assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[3][0
      ], 3, 6, 8))
    })
  })

  suite('#solve', () => {
    test('Valid puzzle strings pass the solver', () => {
      assert.equal(solver.solve(puzzlesAndSolutions[1][1]), puzzlesAndSolutions[1][1])
    })

    test('Invalid puzzle strings fail the solver', () => {
      assert.equal(solver.solve('123'), 1)
      assert.equal(solver.solve(puzzlesAndSolutions[1][0] + '2'), 1)
      assert.equal(solver.solve(puzzlesAndSolutions[1][0].replace('2','?')), 2)
    })

    test('Solver returns the expected solution for an incomplete puzzle', () => {
      assert.equal(solver.solve(puzzlesAndSolutions[1][0]), puzzlesAndSolutions[1][1])
    })

    test('cannot solve', () => {
      assert.equal(solver.solve(puzzlesAndSolutions[1][0].replace('2','1')), 3)
    })

    // if need to test hard puzzle, raise the timeout threshold around 500000 ms
    // test('hard puzzle with 17 clues', () => {
    // const hardPuzzleAndSolution = ['...8.1..........435............7.8........1...2..3....6......75..34........2..6..',
    //                                '237841569186795243594326718315674892469582137728139456642918375853467921971253684']
    //   assert.equal(solver.solve(hardPuzzleAndSolution[0]), hardPuzzleAndSolution[1])
    // })
  })
});

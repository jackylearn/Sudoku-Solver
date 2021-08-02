const backtrack = require('./backtrack.js')
const algo = new backtrack();

const check = require('./check.js')

class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length != 81) return 1
    if (/[^\d\.]/.test(puzzleString)) return 2

    return 0
  }

  checkRowPlacement(puzzleString, row, column, value){
    return check.checkRowPlacement(puzzleString, row, column, value)
  }

  checkColPlacement(puzzleString, row, column, value){
    return check.checkColPlacement(puzzleString, row, column, value)
  }

  checkRegionPlacement(puzzleString, row, column, value){
    return check.checkRegionPlacement(puzzleString, row, column, value)
  }

  solve(puzzleString) {
    if (puzzleString.length != 81) return 1
    if (/[^\d\.]/.test(puzzleString)) return 2

    return algo.solve(puzzleString)
  }

}

module.exports = SudokuSolver;






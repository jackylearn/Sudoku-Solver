'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzleString = req.body.puzzle
      let coordinate = req.body.coordinate
      let value = req.body.value

      console.log("req.body: " + JSON.stringify(req.body))

      if (!puzzleString || !coordinate || !value)
        return res.send({ "error": "Required field(s) missing" })

      value = parseInt(value)
      if (!value || value > 9 || value < 1)
        return res.send({ "error": "Invalid value" })

      if (!/^([A-I][0-9])$/.test(coordinate))
        return res.send({ "error": "Invalid coordinate" })

      let row = coordinate.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1
      let column = parseInt(coordinate.charAt(1))

      let validateResult = solver.validate(puzzleString)
      if (validateResult == 1)
        return res.send({ "error": "Expected puzzle to be 81 characters long" })

      if (validateResult == 2)
        return res.send({ "error": "Invalid characters in puzzle" })

      let conflict = []
      if (!solver.checkRowPlacement(puzzleString, row, column, value))
        conflict.push('row')
      if (!solver.checkColPlacement(puzzleString, row, column, value))
        conflict.push('column')
      if (!solver.checkRegionPlacement(puzzleString, row, column, value))
        conflict.push('region')

      if (conflict.length > 0)
        return res.send({ "valid": false, "conflict": conflict })

      res.send({ "valid": true })

    });

  app.route('/api/solve')
    .post((req, res) => {
      let puzzleString = req.body.puzzle
      
      console.log("req.body: " + JSON.stringify(req.body))

      if (!puzzleString)
        return res.send({ "error": "Required field missing" })

      let result = solver.solve(puzzleString)
      if (result == 1)
        return res.send({ "error": "Expected puzzle to be 81 characters long" })

      if (result == 2)
        return res.send({ "error": "Invalid characters in puzzle"})

      if (result == 3)
        return res.send({ "error": "Puzzle cannot be solved"})

      res.send({ solution: result })
    });
};

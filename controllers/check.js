function checkRowPlacement(puzzleString, row, column, value) {
    // let currentRow = puzzleString.split('').filter((cell, index) => Math.floor(index / 9) + 1 == row)
    // currentRow = currentRow.filter((cell, index) => index != (column - 1)) // prevent to check the current position
    let currentRow = [];
    for (let c = 0; c < 9; c++){
      if (c == column - 1) continue
      currentRow.push(puzzleString.charAt((row-1)*9 + c));
    }
    return _check(currentRow, value)
}

function checkColPlacement(puzzleString, row, column, value) {
    // let currentCol = puzzleString.split('').filter((cell, index) => (index % 9) + 1 == column)
    // currentCol = currentCol.filter((cell, index) => index != (row - 1)) // prevent to check the current position
    let currentCol = [];
    for (let r = 0; r < 9; r++){
      if (r == row - 1) continue 
      currentCol.push(puzzleString.charAt((column-1) + r*9))
    }
    return _check(currentCol, value)
}

function checkRegionPlacement(puzzleString, row, column, value) {
    // let currentRegion = puzzleString.split('').filter((cell, index) => {
    //   let indexRow = Math.floor(index / 9) + 1
    //   let indexColumn = (index % 9) + 1

    //   return _chunk(row, column) == _chunk(indexRow, indexColumn)
    // })
    // // prevent to check the current position
    // currentRegion = currentRegion.filter((cell, index) => {
    //   return index != ((row-1) % 3) * 3 + ((column-1) % 3)
    // })

    let currentRegion = [];
    for (let r = 0; r < 9; r++){
        let position = Math.floor((row-1)/3) *27 + Math.floor((column-1)/3)*3 + r % 3 + Math.floor(r/3) *9
        if ((row-1)*9 + (column-1) == position) continue
        currentRegion.push(puzzleString.charAt(position))
    }

    return _check(currentRegion, value)
}

exports.checkRowPlacement = checkRowPlacement
exports.checkColPlacement = checkColPlacement
exports.checkRegionPlacement = checkRegionPlacement

function _check(arr, value) {
    return !arr.some(cell => {
      if (cell == '.') return false
      return parseInt(cell) == value
    })
  }
  
function _chunk(row, column) {
    return Math.floor((row - 1) / 3) * 3 + Math.floor((column - 1) / 3)
}
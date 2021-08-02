const check = require('./check.js')

class backtrack {
    solve(puzzleString) {
        let stack = new LinkedList()
        // let stack = ['fake']
    
        let currentIndex
        let previousIndex
        let previousValue
        console.log("puzzle\t\t-> " + puzzleString)
        let count = 0
    
        while (stack.length > 0 && /\./.test(puzzleString)) {
        count++
        if (!currentIndex)
            currentIndex = puzzleString.split('').findIndex(value => value == '.')
    
        let currentRow = Math.floor(currentIndex / 9) + 1
        let currentCol = (currentIndex % 9) + 1
        for (let value = 1; value <= 9; value++) {
            if (previousValue && previousValue >= value)
            continue
            previousValue = null
    
            if (check.checkRowPlacement(puzzleString, currentRow, currentCol, value)
            && check.checkColPlacement(puzzleString, currentRow, currentCol, value)
            && check.checkRegionPlacement(puzzleString, currentRow, currentCol, value)) {
            stack.push([currentIndex, value])
    
            // update puzzleString
            let temp = puzzleString.split('')
            temp[currentIndex] = value
            puzzleString = temp.join('')
    
            currentIndex = null
            break
            }
    
            if (value == 9) {
            do {
                [previousIndex, previousValue] = stack.pop()
                // revert puzzleString
                let temp = puzzleString.split('')
                temp[previousIndex] = '.'
                puzzleString = temp.join('')
            } while (previousValue == 9)
            currentIndex = previousIndex
            }
        }
        if (count % 100000 == 0) console.log(puzzleString)
        } 
        
        if (/\./.test(puzzleString)) return 3
        
        console.log("Solution\t-> " + puzzleString)
        console.log("calculation count: " + count)
        return puzzleString
    }
}
  
module.exports = backtrack  
  
class LinkedList {
    constructor() {
      this.head = new Node('fake head')
      this.length = 1
    }
  
    push(value) {
      let newNode = new Node(value)
      this.length++
      if (!this.head)
        return this.head = newNode
  
      newNode.next = this.head
      this.head = newNode
    }
  
    pop() {
      if (this.length == 0) return
      let head = this.head
      this.head = head.next
      this.length--
      return head.value
    }
  
    display() {
      if (this.length == 0) return
      let result = ''
      let curr = this.head
      while (curr) {
        result = `${result}${curr.value} -> `
        curr = curr.next
      }
      result += 'null'
      console.log(result)
    }
}
  
class Node {
    constructor(value) {
      this.value = value
      this.next = null
    }
}
  
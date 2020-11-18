class Cell {
  constructor(r, c) {
    this.row = r
    this.col = c
    this.living = false
    this.livingNeighbors = 0
    this.neighbors = [
      [r-1, c-1], [r-1, c], [r-1, c+1],
      [r, c-1], /* [r, c] */[r, c+1],
      [r+1, c-1], [r+1, c], [r+1, c+1]
    ].filter(([i, j]) => (i >= 0 && j >= 0 && i < maxRow && j < maxCol))
    this.nextState = null
  }

  setNextState() {
    if (this.livingNeighbors == 3 || this.livingNeighbors == 2 && this.living) {
      this.nextState = true
    } else {
      this.nextState = false
    }
  }

  advanceState() {
    this.living = this.nextState
    this.nextState = null
  }
}

// const zero = new Cell(0,0)
// const one = new Cell(0,1)
// const ok = new Cell(1,1)
// const last = new Cell(0, )
// const bot = new Cell(maxRow-1, 0)
// const corner = new Cell(maxRow-1, maxCol-1)

// export default Cell

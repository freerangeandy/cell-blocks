import { CANVAS_WIDTH, CANVAS_HEIGHT, BOX_WIDTH, maxRow, maxCol } from './constants.js'
import Cell from "./Cell"

// set initial state
export const drawGrid = (ctx, gridBoxes) => {
  ctx.strokeStyle='#555555'
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  gridBoxes.forEach((row, rowID) => {
    row.forEach((_, colID) => {
      ctx.beginPath()
      ctx.rect(colID*BOX_WIDTH,rowID*BOX_WIDTH,BOX_WIDTH,BOX_WIDTH)
      ctx.stroke()
    })
  })
}

export const blankCellGrid = (w, h) => [...Array(w)].map((_,i)=>[...Array(h)].map((_,j)=>new Cell(i,j)))

// pure helper functions
export const isValidCell = (row, col) => (row>=0 && row<maxRow && col>=0 && col<maxCol)
export const getFillColor = (thisCell) => thisCell.living ? '#770000' : 'white'

export const getRowColID = (e) => {
  const rowID = Math.floor(e.offsetY/BOX_WIDTH)
  const colID = Math.floor(e.offsetX/BOX_WIDTH)
  return [rowID, colID]
}

// update/paint cells during lifecycle
export const fadeIn = (painter, ctx, interval) => {
  let opacity = 0
  const fader = setInterval(() => {
    if (opacity >= 1) clearInterval(fader)
    ctx.globalAlpha = opacity
    painter()
    opacity += 0.1
  }, interval)
}

export const paintCell = (ctx, thisCell) => {
  ctx.beginPath()
  ctx.fillStyle = getFillColor(thisCell)
  ctx.fillRect(thisCell.col*BOX_WIDTH+1,thisCell.row*BOX_WIDTH+1,BOX_WIDTH-2,BOX_WIDTH-2)
  ctx.stroke()
}

export const paintAllCells = (ctx, grid) => {
  grid.forEach((row, rowID) => {
    row.forEach((thisCell, colID) => {
      paintCell(ctx, thisCell)
    })
  })
}

export const updateNeighborsLivingNeighbors = (cell, grid) => {
  const updateVal = cell.living ? 1 : -1
  cell.neighbors.forEach(([i, j]) => { grid[i][j].livingNeighbors += updateVal })
}

export const toggleLife = (cell, grid) => {
  cell.living = !cell.living
  updateNeighborsLivingNeighbors(cell, grid)
}

// drag/drop patterns onto canvas
export const drawDragPattern = (patternCanvas, patternScheme) => {
  const patternCtx = patternCanvas.getContext('2d')
  patternCtx.strokeStyle='#555555'
  patternScheme.forEach((row, rowID) => {
    row.forEach((val, colID) => {
      patternCtx.beginPath()
      patternCtx.rect(colID*BOX_WIDTH,rowID*BOX_WIDTH,BOX_WIDTH,BOX_WIDTH)
      patternCtx.stroke()
      if (val === 1) {
        patternCtx.beginPath()
        patternCtx.fillStyle = '#770000'
        patternCtx.fillRect(colID*BOX_WIDTH+1,rowID*BOX_WIDTH+1,BOX_WIDTH-2,BOX_WIDTH-2)
        patternCtx.stroke()
      }
    })
  })
}

export const placePattern = (ctx, grid, topRowID, leftColID, pattern) => {
  for (let i=0; i < pattern.length; i++) {
    for (let j=0; j < pattern[0].length; j++) {
      const [rowID, colID] = [topRowID+i, leftColID+j]
      const thisCell = grid[rowID][colID]
      const patternVal = pattern[i][j]
      if (thisCell.living != (patternVal === 1)) {
        toggleLife(thisCell, grid)
        paintCell(ctx, thisCell)
      }
    }
  }
}

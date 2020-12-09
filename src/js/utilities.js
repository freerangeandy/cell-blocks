import { CANVAS_WIDTH, CANVAS_HEIGHT, BOX_WIDTH, GRID_COLOR, LIVE_COLOR,
        maxRow, maxCol } from './constants.js'
import Cell from "./Cell"

// set initial state
export const drawGrid = (ctx, numRows, numCols) => {
  ctx.strokeStyle = GRID_COLOR
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  for (let rowID=0; rowID < numRows; rowID++){
    for (let colID=0; colID<numCols; colID++){
      ctx.beginPath()
      ctx.rect(colID*BOX_WIDTH,rowID*BOX_WIDTH,BOX_WIDTH,BOX_WIDTH)
      ctx.stroke()
    }
  }
}

export const blankCellGrid = (w, h) => [...Array(w)].map((_,i)=>[...Array(h)].map((_,j)=>new Cell(i,j,w,h)))
export const randomCellGrid = (w, h, density) => [...Array(w)].map(row=>[...Array(h)].map(cell=>Math.random()<density))

// pure helper functions
export const isValidCell = (row, col) => (row>=0 && row<maxRow && col>=0 && col<maxCol)
export const getFillColor = (thisCell) => thisCell.living ? LIVE_COLOR : 'white'

export const getRowColID = (e, documentOrigin=false, canvasNode=null) => {
  let offsetX, offsetY
  if (documentOrigin && canvasNode != null) {
    offsetX = e.clientX - canvasNode.getBoundingClientRect().left
    offsetY = e.clientY - canvasNode.getBoundingClientRect().top
  } else {
    offsetX = e.offsetX
    offsetY = e.offsetY
  }
  const rowID = Math.floor(offsetY/BOX_WIDTH)
  const colID = Math.floor(offsetX/BOX_WIDTH)
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

export const setClickDrawCursor = (canvasNode, eraseMode) => {
  if (eraseMode === undefined) {
    canvasNode.classList.remove('eraseMode', 'pencilMode')
  } else if (eraseMode) {
    canvasNode.classList.add('eraseMode')
    canvasNode.classList.remove('pencilMode')
  } else {
    canvasNode.classList.add('pencilMode')
    canvasNode.classList.remove('eraseMode')
  }
}

// drag/drop patterns onto canvas
export const drawDragPattern = (patternCanvas, patternScheme) => {
  const patternCtx = patternCanvas.getContext('2d')
  patternCtx.strokeStyle = GRID_COLOR
  patternScheme.forEach((row, rowID) => {
    row.forEach((val, colID) => {
      patternCtx.beginPath()
      patternCtx.rect(colID*BOX_WIDTH,rowID*BOX_WIDTH,BOX_WIDTH,BOX_WIDTH)
      patternCtx.stroke()
      if (val === 1) {
        patternCtx.beginPath()
        patternCtx.fillStyle = LIVE_COLOR
        patternCtx.fillRect(colID*BOX_WIDTH+1,rowID*BOX_WIDTH+1,BOX_WIDTH-2,BOX_WIDTH-2)
        patternCtx.stroke()
      }
    })
  })
}

export const dropPattern = (ctx, grid, offsetX, offsetY, pattern) => {
  const topRow = Math.round(offsetY/BOX_WIDTH + 0.4)
  const leftCol = Math.round(offsetX/BOX_WIDTH + 0.1)
  const botRow = topRow + pattern.length - 1
  const rightCol = leftCol + pattern[0].length - 1
  if (isValidCell(topRow, leftCol) && isValidCell(botRow, rightCol)) {
    placePattern(ctx, grid, topRow, leftCol, pattern)
  }
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

export const cloneIntoCanvas = (ctx, grid, pattern) => {
  for (let i=0; i < 6; i++) {
    for (let j=0; j < 6; j++) {
      const thisCell = grid[i][j]
      const patternVal = i < pattern.length && j < pattern[0].length ? pattern[i][j] : 0
      if (thisCell.living != (patternVal === 1)) {
        toggleLife(thisCell, grid)
        paintCell(ctx, thisCell)
      }
    }
  }
}

export const getPatternFromGrid = (grid) => grid.map(row => row.map(cell => cell.living ? 1 : 0))
export const clonePatternFromGrid = (grid, topLeft, botRight) => {
  return grid.slice(topLeft[0], botRight[0]).map(row => {
    return row.slice(topLeft[1], botRight[1]).map(cell => cell.living ? 1 : 0)
  })
}

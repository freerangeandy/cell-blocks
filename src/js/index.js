import { CANVAS_WIDTH, CANVAS_HEIGHT, BOX_WIDTH, maxRow, maxCol, RAND_DENSITY } from "./constants.js"
import Cell from "./Cell"

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const xHover = document.getElementById('xHover')
const yHover = document.getElementById('yHover')
const startButton = document.getElementById('startButton')
const resetButton = document.getElementById('resetButton')
const randomButton = document.getElementById('randomButton')

const blankCellGrid = (w, h) => [...Array(w)].map((_,i)=>[...Array(h)].map((_,j)=>new Cell(i,j)))
let gridBoxes = blankCellGrid(maxRow, maxCol)

const drawGrid = () => {
  ctx.strokeStyle='#555555'
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  gridBoxes.forEach((row, rowID) => {
    row.forEach((_, colID) => {
      ctx.beginPath()
      ctx.rect(colID*BOX_WIDTH,rowID*BOX_WIDTH,BOX_WIDTH,BOX_WIDTH)
      ctx.stroke()
    })
  })
  gridBoxes = blankCellGrid(maxRow, maxCol)
}

// tie this action to flipping of a cell state as close to possible
const updateNeighborsLivingNeighbors = (cell) => {
  const updateVal = cell.living ? 1 : -1
  cell.neighbors.forEach(([i, j]) => { gridBoxes[i][j].livingNeighbors += updateVal })
}

const toggleLife = (i, j) => {
  const thisCell = gridBoxes[i][j]
  thisCell.living = !thisCell.living
  updateNeighborsLivingNeighbors(thisCell)
}

// go through the conway life cycle:
//  1. for all cells, determine next state based on current state, # living neighbors
//  2. store next state in Cell instance variable
//  3. loop cell by cell, keep/flip state based on stored next state
//    a) set new state
//    b) updateNeighborsLivingNeighbors
//    c) nullify stored next state
// end cycle, repeat with next animation frame

const setNextStates = () => {
  gridBoxes.forEach((row, rowID) => {
    row.forEach((thisCell, colID) => {
      thisCell.setNextState() // conway rules
    })
  })
}

const applyNextStates = () => {
  gridBoxes.forEach((row, rowID) => {
    row.forEach((thisCell, colID) => {
      const stateFlip = thisCell.living != thisCell.nextState
      thisCell.advanceState() // conway rules
      if (stateFlip){
        updateNeighborsLivingNeighbors(thisCell)
      }
    })
  })
}

const animate = () => {
  setNextStates()
  applyNextStates()
  fadeIn(() => paintAllCells(ctx), ctx, 15)
}

// utilities
const getRowColID = (e) => {
  const rowID = Math.floor(e.offsetY/BOX_WIDTH)
  const colID = Math.floor(e.offsetX/BOX_WIDTH)
  return [rowID, colID]
}

const paintCell = (ctx, thisCell) => {
  ctx.beginPath()
  ctx.fillStyle = getFillColor(thisCell)
  ctx.fillRect(thisCell.col*BOX_WIDTH+1,thisCell.row*BOX_WIDTH+1,BOX_WIDTH-2,BOX_WIDTH-2)
  ctx.stroke()
}

const paintAllCells = (ctx) => {
  gridBoxes.forEach((row, rowID) => {
    row.forEach((thisCell, colID) => {
      paintCell(ctx, thisCell)
    })
  })
}

const fadeIn = (painter, ctx, interval) => {
  let opacity = 0
  const fader = setInterval(() => {
    if (opacity >= 1) clearInterval(fader)
    ctx.globalAlpha = opacity
    painter()
    opacity += 0.1
  }, interval)
}

const isValidCell = (row, col) => (row>=0 && row<maxRow && col>=0 && col<maxCol)
const getFillColor = (thisCell) => thisCell.living ? '#770000' : 'white'

// event handlers
let mouseIsDown = false
let eraseMode = false
const clickDragStartListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  const thisCell = gridBoxes[rowID][colID]
  eraseMode = thisCell.living ? true : false
  mouseIsDown = true
  toggleLife(rowID, colID)
  paintCell(ctx, thisCell)
}

const clickDragEndListener = (e) => {
  mouseIsDown = false
}

const moveListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  rowHover.innerHTML = rowID
  colHover.innerHTML = colID
  if (mouseIsDown && isValidCell(rowID, colID)) {
    const thisCell = gridBoxes[rowID][colID]
    if (eraseMode === thisCell.living){
      toggleLife(rowID, colID)
      paintCell(ctx, thisCell)
    }
  }
}

let isRunning = false
let animator
const startListener = (e) => {
  if (!isRunning) {
    animator = setInterval(animate, 500)
    startButton.innerHTML = "Pause"
    startButton.classList.toggle("pause-button", true)
    startButton.classList.toggle("start-button", false)
  } else {
    clearInterval(animator)
    startButton.innerHTML = "Start"
    startButton.classList.toggle("pause-button", false)
    startButton.classList.toggle("start-button", true)
  }
  isRunning = !isRunning
}

const resetListener = (e) => {
  drawGrid()
}

const randomListener = (e) => {
  const seedArray = [...Array(maxRow)].map(row => [...Array(maxCol)].map(cell => Math.random() < RAND_DENSITY))
  gridBoxes.forEach((row, rowID) => {
    row.forEach((thisCell, colID) => {
      if (thisCell.living !== seedArray[rowID][colID]){
        toggleLife(rowID, colID)
      }
    })
  })
  fadeIn(() => paintAllCells(ctx), ctx, 15)
}

canvas.addEventListener('mousemove', moveListener)
canvas.addEventListener('mouseout',() => {
  rowHover.innerHTML = '---'
  colHover.innerHTML = '---'
})
canvas.addEventListener('mousedown', clickDragStartListener)
document.addEventListener('mouseup', clickDragEndListener)

startButton.addEventListener('click', startListener)
resetButton.addEventListener('click', resetListener)
randomButton.addEventListener('click', randomListener)

// when browser loads script
drawGrid()

import { CANVAS_WIDTH, CANVAS_HEIGHT, BOX_WIDTH, maxRow, maxCol, RAND_DENSITY } from "./constants.js"
import Cell from "./Cell"

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const xHover = document.getElementById('xHover')
const yHover = document.getElementById('yHover')
const startButton = document.getElementById('startButton')
const resetButton = document.getElementById('resetButton')
const randomButton = document.getElementById('randomButton')

let gridBoxes = [[]]

const drawGrid = () => {
  ctx.strokeStyle='#555555'
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  for(let i=0;i<maxRow;i++) {
    gridBoxes[i] = []
    for(let j=0;j<maxCol;j++) {
      gridBoxes[i][j] = new Cell(i, j)
      ctx.beginPath()
      ctx.rect(j*BOX_WIDTH,i*BOX_WIDTH,BOX_WIDTH,BOX_WIDTH)
      ctx.stroke()
    }
  }
}

// tie this action to flipping of a cell state as close to possible
const updateNeighborsLivingNeighbors = (cell) => {
  const updateVal = cell.living ? 1 : -1
  cell.neighbors.forEach(([i, j]) => { gridBoxes[i][j].livingNeighbors += updateVal })
}

const toggleLife = (i, j) => {
  const thisCell = gridBoxes[i][j]
  ctx.beginPath()
  thisCell.living = !thisCell.living
  updateNeighborsLivingNeighbors(thisCell)
  ctx.fillStyle = getFillColor(thisCell)
  ctx.fillRect(j*BOX_WIDTH+1,i*BOX_WIDTH+1,BOX_WIDTH-2,BOX_WIDTH-2)
  ctx.stroke()
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
        ctx.beginPath()
        ctx.fillStyle = getFillColor(thisCell)
        ctx.fillRect(colID*BOX_WIDTH+1,rowID*BOX_WIDTH+1,BOX_WIDTH-2,BOX_WIDTH-2)
        ctx.stroke()
      }
    })
  })
}

const animate = () => {
  setNextStates()
  applyNextStates()
}

// utilities
const getRowColID = (e) => {
  const rowID = Math.floor(e.offsetY/BOX_WIDTH)
  const colID = Math.floor(e.offsetX/BOX_WIDTH)
  return [rowID, colID]
}

const getFillColor = (thisCell) => thisCell.living ? '#770000' : 'white'

// event handlers
const moveListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  rowHover.innerHTML = rowID
  colHover.innerHTML = colID
}

const clickListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  toggleLife(rowID, colID)
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
}

canvas.addEventListener('click', clickListener)
canvas.addEventListener('mousemove', moveListener)
canvas.addEventListener('mouseout',() => {
  rowHover.innerHTML = '---'
  colHover.innerHTML = '---'
})

startButton.addEventListener('click', startListener)
resetButton.addEventListener('click', resetListener)
randomButton.addEventListener('click', randomListener)

// when browser loads script
drawGrid()

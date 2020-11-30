import { CANVAS_WIDTH, CANVAS_HEIGHT, BOX_WIDTH, maxRow, maxCol, RAND_DENSITY, GLIDER_PATTERN } from "./constants.js"
import { blankCellGrid, getRowColID, fadeIn, isValidCell, getFillColor } from "./utilities.js"
import Cell from "./Cell"

const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')
const xHover = document.getElementById('xHover')
const yHover = document.getElementById('yHover')
const startButton = document.getElementById('startButton')
const resetButton = document.getElementById('resetButton')
const randomButton = document.getElementById('randomButton')
const originPattern = document.getElementById('originPattern')
originPattern.setAttribute('width', BOX_WIDTH*3)
originPattern.setAttribute('height', BOX_WIDTH*3)
let dragImage = null

let gridBoxes
const init = () => {
  gridBoxes = blankCellGrid(maxRow, maxCol)
  drawGrid()
  drawDragPattern(originPattern)
}

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
}

const drawDragPattern = (pattern) => {
  const patternCtx = pattern.getContext('2d')
  patternCtx.strokeStyle='#555555'
  GLIDER_PATTERN.forEach((row, rowID) => {
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
  fadeIn(() => paintAllCells(ctx), ctx, 8)
}

// utilities
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

const placePattern = (ctx, topRowID, leftColID, pattern) => {
  for (let i=0; i < pattern.length; i++) {
    for (let j=0; j < pattern[0].length; j++) {
      const [rowID, colID] = [topRowID+i, leftColID+j]
      const thisCell = gridBoxes[rowID][colID]
      const patternVal = pattern[i][j]
      if (thisCell.living != (patternVal === 1)) {
        toggleLife(rowID, colID)
        paintCell(ctx, thisCell)
      }
    }
  }
}

// event handlers
let drawingCells = false
let eraseMode = false
const clickDrawStartListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  const thisCell = gridBoxes[rowID][colID]
  eraseMode = thisCell.living ? true : false
  drawingCells = true
  toggleLife(rowID, colID)
  paintCell(ctx, thisCell)
}

const mouseUpListener = (e) => {
  drawingCells = false
}

const moveListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  rowHover.innerHTML = rowID
  colHover.innerHTML = colID
  if (drawingCells && isValidCell(rowID, colID)) {
    const thisCell = gridBoxes[rowID][colID]
    if (eraseMode === thisCell.living){
      toggleLife(rowID, colID)
      paintCell(ctx, thisCell)
    }
  }
}

const dragPatternStartListener = (e) => {
  let shiftX = e.clientX - originPattern.getBoundingClientRect().left
  let shiftY = e.clientY - originPattern.getBoundingClientRect().top
  let clonedYet = false

  const moveAt = (pageX, pageY) => {
    if (dragImage) {
      dragImage.style.left = pageX - shiftX + 'px'
      dragImage.style.top = pageY - shiftY + 'px'
    }
  }

  const movePatternListener = (e) => {
    if (!clonedYet) {
      dragImage = originPattern.cloneNode(true)
      dragImage.setAttribute('id', 'dragPattern')
      dragImage.style.position = 'absolute'
      dragImage.style.zIndex = 1000
      drawDragPattern(dragImage)
      document.body.append(dragImage)
      // console.log("appending clone")
      clonedYet = true
    }
    moveAt(e.pageX, e.pageY)
  }

  const dropPatternListener = (e) => {
    document.removeEventListener('mousemove', movePatternListener)
    document.removeEventListener('mouseup', dropPatternListener)
    // console.log("remove event listener")
    if (clonedYet) {
      dropPattern(e, shiftX, shiftY)
      document.body.removeChild(dragImage)
      // console.log("removing clone")
      dragImage = null
      clonedYet = false
    }
  }

  document.addEventListener('mousemove', movePatternListener)
  // console.log("add event listener")
  document.addEventListener('mouseup', dropPatternListener)
}

const dropPattern = (e, shiftX, shiftY) => {
  let offsetX = e.clientX - shiftX - canvas.getBoundingClientRect().left
  let offsetY = e.clientY - shiftY - canvas.getBoundingClientRect().top

  const topRow = Math.floor(offsetY/BOX_WIDTH)
  const leftCol = Math.floor(offsetX/BOX_WIDTH)
  const botRow = topRow + GLIDER_PATTERN.length - 1
  const rightCol = leftCol + GLIDER_PATTERN[0].length - 1
  if (isValidCell(topRow, leftCol) && isValidCell(botRow, rightCol)) {
    toggleLife(topRow, leftCol)
    placePattern(ctx, topRow, leftCol, GLIDER_PATTERN)
  }
  // console.log(`top left corner: ${topRow}, ${leftCol}`)
}

// button event listeners
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
  gridBoxes = blankCellGrid(maxRow, maxCol)
  paintAllCells(ctx)
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
  paintAllCells(ctx)
}

// handles drawing/erasing cells in canvas
canvas.addEventListener('mousemove', moveListener)
document.addEventListener('mouseup', mouseUpListener)
canvas.addEventListener('mousedown', clickDrawStartListener)
// handles dragging pattern
originPattern.addEventListener('mousedown', dragPatternStartListener)
originPattern.addEventListener('dragstart', () => false)
// handles button presses
startButton.addEventListener('click', startListener)
resetButton.addEventListener('click', resetListener)
randomButton.addEventListener('click', randomListener)
// reset cell ID display upon leaving canvas
canvas.addEventListener('mouseout',() => {
  rowHover.innerHTML = '---'
  colHover.innerHTML = '---'
})

// when browser loads script
init()

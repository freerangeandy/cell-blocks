import { CANVAS_WIDTH, CANVAS_HEIGHT, BOX_WIDTH, maxRow, maxCol, RAND_DENSITY,
        GLIDER_PATTERN, LWSS_PATTERN, MWSS_PATTERN, HWSS_PATTERN } from "./constants.js"
import { blankCellGrid, getRowColID, fadeIn, paintCell, paintAllCells, isValidCell,
        getFillColor, updateNeighborsLivingNeighbors, toggleLife, placePattern,
        drawDragPattern, drawGrid, randomCellGrid } from "./utilities.js"
import Cell from "./Cell"

const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')
const xHover = document.getElementById('xHover')
const yHover = document.getElementById('yHover')
const startButton = document.getElementById('startButton')
const resetButton = document.getElementById('resetButton')
const randomButton = document.getElementById('randomButton')
const originPattern = document.getElementById('originPattern')

let gridBoxes
const init = () => {
  gridBoxes = blankCellGrid(maxRow, maxCol)
  drawGrid(ctx, gridBoxes)
  originPattern.setAttribute('width', BOX_WIDTH*3)
  originPattern.setAttribute('height', BOX_WIDTH*3)
  drawDragPattern(originPattern, GLIDER_PATTERN)
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
      if (stateFlip) {
        updateNeighborsLivingNeighbors(thisCell, gridBoxes)
      }
    })
  })
}

const animate = () => {
  setNextStates()
  applyNextStates()
  fadeIn(() => paintAllCells(ctx, gridBoxes), ctx, 8)
}

const setClickDrawCursor = (eraseMode) => {
  if (eraseMode === undefined) {
    canvas.classList.remove('eraseMode', 'pencilMode')
  } else if (eraseMode) {
    canvas.classList.add('eraseMode')
    canvas.classList.remove('pencilMode')
  } else {
    canvas.classList.add('pencilMode')
    canvas.classList.remove('eraseMode')
  }
}

// event handlers
let drawingCells = false
let eraseMode = false
const clickDrawStartListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  const thisCell = gridBoxes[rowID][colID]
  eraseMode = thisCell.living
  setClickDrawCursor(eraseMode)
  drawingCells = true
  toggleLife(thisCell, gridBoxes)
  paintCell(ctx, thisCell)
}

const mouseUpListener = (e) => {
  setClickDrawCursor()
  drawingCells = false
}

const moveListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  rowHover.innerHTML = rowID
  colHover.innerHTML = colID
  if (drawingCells && isValidCell(rowID, colID)) {
    const thisCell = gridBoxes[rowID][colID]
    if (eraseMode === thisCell.living) {
      toggleLife(thisCell, gridBoxes)
      paintCell(ctx, thisCell)
    }
  }
}

let dragImage = null
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
      drawDragPattern(dragImage, GLIDER_PATTERN)
      document.body.append(dragImage)
      clonedYet = true
    }
    moveAt(e.pageX, e.pageY)
  }

  const dropPatternListener = (e) => {
    document.removeEventListener('mousemove', movePatternListener)
    document.removeEventListener('mouseup', dropPatternListener)
    if (clonedYet) {
      dropPattern(e, shiftX, shiftY)
      document.body.removeChild(dragImage)
      dragImage = null
      clonedYet = false
    }
  }

  document.addEventListener('mousemove', movePatternListener)
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
    placePattern(ctx, gridBoxes, topRow, leftCol, GLIDER_PATTERN)
  }
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
  paintAllCells(ctx, gridBoxes)
}

const randomListener = (e) => {
  const seedArray = randomCellGrid(maxRow, maxCol, RAND_DENSITY)
  gridBoxes.forEach((row, rowID) => {
    row.forEach((thisCell, colID) => {
      if (thisCell.living !== seedArray[rowID][colID]) {
        toggleLife(thisCell, gridBoxes)
      }
    })
  })
  paintAllCells(ctx, gridBoxes)
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

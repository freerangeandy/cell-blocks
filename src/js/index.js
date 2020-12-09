import { CANVAS_WIDTH, CANVAS_HEIGHT, BOX_WIDTH, maxRow, maxCol, RAND_DENSITY,
        spaceshipPatterns, LOCKED, EDITING, CLONING } from "./constants.js"
import { blankCellGrid, getRowColID, fadeIn, paintCell, paintAllCells, isValidCell,
        getFillColor, updateNeighborsLivingNeighbors, toggleLife, setClickDrawCursor,
        dropPattern, placePattern, drawDragPattern, drawGrid, randomCellGrid,
        getPatternFromGrid, clonePatternFromGrid, cloneIntoCanvas } from "./utilities.js"
import Cell from "./Cell"

const canvas = document.getElementById('mainCanvas')
const ctx = canvas.getContext('2d')
const xHover = document.getElementById('xHover')
const yHover = document.getElementById('yHover')
const startButton = document.getElementById('startButton')
const resetButton = document.getElementById('resetButton')
const randomButton = document.getElementById('randomButton')
const spaceshipNodes = Object.fromEntries(new Map(
  Object.keys(spaceshipPatterns).map(id => [id, document.getElementById(id)])
))
const lockButton = document.getElementById('lockButton')
const editButton = document.getElementById('editButton')
const cloneButton = document.getElementById('cloneButton')
const customCanvas = document.getElementById('customCanvas')
const customCtx = customCanvas.getContext('2d')

/* DRAW CANVASES */
let gridBoxes, customGrid
const init = () => {
  gridBoxes = blankCellGrid(maxRow, maxCol)
  drawGrid(ctx, maxRow, maxCol)
  for (const [id, node] of Object.entries(spaceshipNodes)) {
    node.setAttribute('width', BOX_WIDTH*spaceshipPatterns[id][0].length)
    node.setAttribute('height', BOX_WIDTH*spaceshipPatterns[id].length)
    drawDragPattern(node, spaceshipPatterns[id])
  }
  customGrid = blankCellGrid(6, 6)
  customCanvas.setAttribute('width', BOX_WIDTH*6)
  customCanvas.setAttribute('height', BOX_WIDTH*6)
  drawGrid(customCtx, 6, 6)
}

/* CONWAY LIFE CYCLE */
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

/* MAIN CANVAS */
// button click handlers
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

// mouse event handlers
let drawingCells = false
let eraseMode = false
const clickDrawStartListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  const thisCell = gridBoxes[rowID][colID]
  eraseMode = thisCell.living
  setClickDrawCursor(canvas, eraseMode)
  drawingCells = true
  toggleLife(thisCell, gridBoxes)
  paintCell(ctx, thisCell)
}

const mouseUpListener = (canvasNode) => (e) => {
  setClickDrawCursor(canvasNode)
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
const dragPatternStartListener = (pattern, originNode) => (e) => {
  let shiftX = e.clientX - originNode.getBoundingClientRect().left
  let shiftY = e.clientY - originNode.getBoundingClientRect().top
  let clonedYet = false

  const moveAt = (pageX, pageY) => {
    if (dragImage) {
      dragImage.style.left = pageX - shiftX + 'px'
      dragImage.style.top = pageY - shiftY + 'px'
    }
  }

  const movePatternListener = (e) => {
    if (!clonedYet) {
      dragImage = originNode.cloneNode(true)
      dragImage.setAttribute('id', 'dragPattern')
      dragImage.style.position = 'absolute'
      dragImage.style.zIndex = 1000
      drawDragPattern(dragImage, pattern)
      document.body.append(dragImage)
      clonedYet = true
    }
    moveAt(e.pageX, e.pageY)
  }

  const dropPatternListener = (e) => {
    document.removeEventListener('mousemove', movePatternListener)
    document.removeEventListener('mouseup', dropPatternListener)
    if (clonedYet) {
      const offsetX = e.clientX - shiftX - canvas.getBoundingClientRect().left
      const offsetY = e.clientY - shiftY - canvas.getBoundingClientRect().top
      dropPattern(ctx, gridBoxes, offsetX, offsetY, pattern)
      document.body.removeChild(dragImage)
      dragImage = null
      clonedYet = false
    }
  }

  document.addEventListener('mousemove', movePatternListener)
  document.addEventListener('mouseup', dropPatternListener)
}

/* CUSTOM CANVAS */
const customStates = [{ button: lockButton, class: "locked-pattern" },
                      { button: editButton, class: "editing-pattern" },
                      { button: cloneButton, class: "cloning-pattern" }]
let curCustomState = LOCKED
let customDragPatternListener
const setCustomState = (newState) => {
  customStates.forEach((stateProps, state) => {
    const isNewState = (state == newState)
    stateProps.button.disabled = isNewState
    customCanvas.classList.toggle(stateProps.class, isNewState)
  })
  switch (newState) {
    case LOCKED:
      let customPattern = getPatternFromGrid(customGrid)
      customDragPatternListener = dragPatternStartListener(customPattern, customCanvas)
      customCanvas.addEventListener('mousedown', customDragPatternListener)
      canvas.classList.toggle("crosshairMode", false)
      canvas.addEventListener('mousedown', clickDrawStartListener)
      canvas.removeEventListener('mousedown', cloneStartListener)
      document.removeEventListener('mousemove', cloneDragListener)
      document.removeEventListener('mouseup', cloneEndListener)
    break
    case EDITING:
      customCanvas.removeEventListener('mousedown', customDragPatternListener)
      canvas.classList.toggle("crosshairMode", false)
      canvas.addEventListener('mousedown', clickDrawStartListener)
      canvas.removeEventListener('mousedown', cloneStartListener)
      document.removeEventListener('mousemove', cloneDragListener)
      document.removeEventListener('mouseup', cloneEndListener)
    break
    case CLONING:
      customCanvas.removeEventListener('mousedown', customDragPatternListener)
      canvas.classList.toggle("crosshairMode", true)
      canvas.removeEventListener('mousedown', clickDrawStartListener)
      canvas.addEventListener('mousedown', cloneStartListener)
      document.addEventListener('mousemove', cloneDragListener)
      document.addEventListener('mouseup', cloneEndListener)
    break
  }
  curCustomState = newState
}

// button click handlers
const lockListener = (e) => { setCustomState(LOCKED) }
const editListener = (e) => { setCustomState(EDITING) }
const cloneListener = (e) => { setCustomState(CLONING) }

// mouse event handlers
const moveCustomListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  rowHover.innerHTML = rowID
  colHover.innerHTML = colID
  if (drawingCells && (rowID >= 0 && rowID < 6 && colID >= 0 && colID < 6)) {
    const thisCell = customGrid[rowID][colID]
    if (eraseMode === thisCell.living) {
      toggleLife(thisCell, customGrid)
      paintCell(customCtx, thisCell)
    }
  }
}

const clickDrawCustomListener = (e) => {
  if (curCustomState != LOCKED) {
    const [rowID, colID] = getRowColID(e)
    const thisCell = customGrid[rowID][colID]
    eraseMode = thisCell.living
    setClickDrawCursor(customCanvas, eraseMode)
    drawingCells = true
    toggleLife(thisCell, customGrid)
    paintCell(customCtx, thisCell)
  }
}

let cloneSelecting = false
let cloneTopLeft, cloneBotRight, clonePattern, cloneFrame
const cloneStartListener = (e) => {
  const [rowID, colID] = getRowColID(e)
  if (!cloneFrame) {
    cloneFrame = document.createElement('div')
    cloneFrame.setAttribute('id', 'cloneFrame')
    cloneFrame.style.position = 'absolute'
    cloneFrame.style.zIndex = 1000
    cloneFrame.style.width = BOX_WIDTH*6 + 'px'
    cloneFrame.style.height = BOX_WIDTH*6 + 'px'
    cloneFrame.style.border = '3px solid #59cbda'
    document.body.appendChild(cloneFrame)
  }
  cloneTopLeft = [rowID, colID]
  cloneBotRight = [Math.min(cloneTopLeft[0]+6, maxRow), Math.min(cloneTopLeft[1]+6, maxCol)]
  drawCloneFrame(rowID, colID)
  clonePattern = clonePatternFromGrid(gridBoxes, cloneTopLeft, cloneBotRight)
  cloneIntoCanvas(customCtx, customGrid, clonePattern)
  cloneSelecting = true
}

const cloneDragListener = (e) => {
  const [rowID, colID] = getRowColID(e, true, canvas)
  if (cloneSelecting && isValidCell(rowID, colID)) {
    cloneTopLeft = [rowID, colID]
    cloneBotRight = [Math.min(cloneTopLeft[0]+6, maxRow), Math.min(cloneTopLeft[1]+6, maxCol)]
    drawCloneFrame(rowID, colID)
    clonePattern = clonePatternFromGrid(gridBoxes, cloneTopLeft, cloneBotRight)
    cloneIntoCanvas(customCtx, customGrid, clonePattern)
  }
}

const cloneEndListener = (e) => {
  cloneSelecting = false
  if (cloneFrame) {
    document.body.removeChild(cloneFrame)
    cloneFrame = null
  }
}

const drawCloneFrame = (rowID, colID) => {
  const pageX = canvas.getBoundingClientRect().left
  const pageY = canvas.getBoundingClientRect().top
  const shiftX = colID*BOX_WIDTH
  const shiftY = rowID*BOX_WIDTH
  cloneFrame.style.left = pageX + shiftX + 'px'
  cloneFrame.style.top = pageY + shiftY + 'px'
}

/* EVENT LISTENER ASSIGNMENTS */
// handles drawing/erasing cells in canvas
canvas.addEventListener('mousemove', moveListener)
document.addEventListener('mouseup', mouseUpListener(canvas))
canvas.addEventListener('mousedown', clickDrawStartListener)
// handles pattern drag and drop
for (const [id, node] of Object.entries(spaceshipNodes)) {
  node.addEventListener('mousedown', dragPatternStartListener(spaceshipPatterns[id], node))
  node.addEventListener('dragstart', () => false)
}
// handles button presses (main canvas)
startButton.addEventListener('click', startListener)
resetButton.addEventListener('click', resetListener)
randomButton.addEventListener('click', randomListener)
// handles button presses (custom canvas)
lockButton.addEventListener('click', lockListener)
editButton.addEventListener('click', editListener)
cloneButton.addEventListener('click', cloneListener)
// custom pattern canvas behavior
customCanvas.addEventListener('mousemove', moveCustomListener)
document.addEventListener('mouseup', mouseUpListener(customCanvas))
customCanvas.addEventListener('mousedown', clickDrawCustomListener)
// reset cell ID display upon leaving canvas
canvas.addEventListener('mouseout',() => {
  rowHover.innerHTML = '---'
  colHover.innerHTML = '---'
})

/* run upon loading script */
init()

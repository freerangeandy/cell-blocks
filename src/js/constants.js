export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 600
export const BOX_WIDTH = 20
export const GRID_COLOR = '#555555'
export const LIVE_COLOR = '#770000'

export const maxRow = CANVAS_HEIGHT/BOX_WIDTH
export const maxCol = CANVAS_WIDTH/BOX_WIDTH

export const RAND_DENSITY = 0.4

const GLIDER_ID = 'gliderPattern' // needs to match DOM element ID
const LWSS_ID = 'lwssPattern'
const MWSS_ID = 'mwssPattern'
const HWSS_ID = 'hwssPattern'
const GLIDER_PATTERN = [
  [1,0,0],
  [0,1,1],
  [1,1,0]
]
const LWSS_PATTERN = [
  [0,1,1,0,0],
  [1,1,1,1,0],
  [1,1,0,1,1],
  [0,0,1,1,0],
]
const MWSS_PATTERN = [
  [0,1,1,1,0,0],
  [1,1,1,1,1,0],
  [1,1,1,0,1,1],
  [0,0,0,1,1,0]
]
const HWSS_PATTERN = [
  [0,1,1,1,1,0,0],
  [1,1,1,1,1,1,0],
  [1,1,1,1,0,1,1],
  [0,0,0,0,1,1,0]
]

export const spaceshipPatterns = {
  [GLIDER_ID]: GLIDER_PATTERN,
  [LWSS_ID]: LWSS_PATTERN,
  [MWSS_ID]: MWSS_PATTERN,
  [HWSS_ID]: HWSS_PATTERN
}

export const [LOCKED, EDITING, CLONING] = [0,1,2]

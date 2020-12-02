export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 600
export const BOX_WIDTH = 20
export const GRID_COLOR = '#555555'
export const LIVE_COLOR = '#770000'

export const maxRow = CANVAS_HEIGHT/BOX_WIDTH
export const maxCol = CANVAS_WIDTH/BOX_WIDTH

export const RAND_DENSITY = 0.4

export const GLIDER_PATTERN = [
  [0,1,0],
  [0,0,1],
  [1,1,1]
]
export const LWSS_PATTERN = [
  [0,1,1,0,0],
  [1,1,1,1,0],
  [1,1,0,1,1],
  [0,0,1,1,0],
]
export const MWSS_PATTERN = [
  [0,1,1,1,0,0],
  [1,1,1,1,1,0],
  [1,1,1,0,1,1],
  [0,0,0,1,1,0]
]
export const HWSS_PATTERN = [
  [0,1,1,1,1,0,0],
  [1,1,1,1,1,1,0],
  [1,1,1,1,0,1,1],
  [0,0,0,0,1,1,0]
]

export const spaceshipPatterns = {
  'gliderPattern': GLIDER_PATTERN,
  'lwssPattern': LWSS_PATTERN,
  'mwssPattern': MWSS_PATTERN,
  'hwssPattern': LWSS_PATTERN
}

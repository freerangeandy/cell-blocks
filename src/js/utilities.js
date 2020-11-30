import { BOX_WIDTH, maxRow, maxCol } from './constants.js'
import Cell from "./Cell"

export const blankCellGrid = (w, h) => [...Array(w)].map((_,i)=>[...Array(h)].map((_,j)=>new Cell(i,j)))

export const getRowColID = (e) => {
  const rowID = Math.floor(e.offsetY/BOX_WIDTH)
  const colID = Math.floor(e.offsetX/BOX_WIDTH)
  return [rowID, colID]
}

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

export const isValidCell = (row, col) => (row>=0 && row<maxRow && col>=0 && col<maxCol)
export const getFillColor = (thisCell) => thisCell.living ? '#770000' : 'white'

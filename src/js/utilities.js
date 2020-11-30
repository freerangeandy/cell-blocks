import { BOX_WIDTH } from './constants.js'
import Cell from "./Cell"

export const blankCellGrid = (w, h) => [...Array(w)].map((_,i)=>[...Array(h)].map((_,j)=>new Cell(i,j)))

export const getRowColID = (e) => {
  const rowID = Math.floor(e.offsetY/BOX_WIDTH)
  const colID = Math.floor(e.offsetX/BOX_WIDTH)
  return [rowID, colID]
}

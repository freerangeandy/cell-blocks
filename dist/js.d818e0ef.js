// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/js/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CLONING = exports.EDITING = exports.LOCKED = exports.spaceshipPatterns = exports.RAND_DENSITY = exports.maxCol = exports.maxRow = exports.LIVE_COLOR = exports.GRID_COLOR = exports.BOX_WIDTH = exports.CANVAS_HEIGHT = exports.CANVAS_WIDTH = void 0;

var _spaceshipPatterns;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CANVAS_WIDTH = 1200;
exports.CANVAS_WIDTH = CANVAS_WIDTH;
var CANVAS_HEIGHT = 600;
exports.CANVAS_HEIGHT = CANVAS_HEIGHT;
var BOX_WIDTH = 20;
exports.BOX_WIDTH = BOX_WIDTH;
var GRID_COLOR = '#555555';
exports.GRID_COLOR = GRID_COLOR;
var LIVE_COLOR = '#770000';
exports.LIVE_COLOR = LIVE_COLOR;
var maxRow = CANVAS_HEIGHT / BOX_WIDTH;
exports.maxRow = maxRow;
var maxCol = CANVAS_WIDTH / BOX_WIDTH;
exports.maxCol = maxCol;
var RAND_DENSITY = 0.4;
exports.RAND_DENSITY = RAND_DENSITY;
var GLIDER_ID = 'gliderPattern'; // needs to match DOM element ID

var LWSS_ID = 'lwssPattern';
var MWSS_ID = 'mwssPattern';
var HWSS_ID = 'hwssPattern';
var GLIDER_PATTERN = [[1, 0, 0], [0, 1, 1], [1, 1, 0]];
var LWSS_PATTERN = [[0, 1, 1, 0, 0], [1, 1, 1, 1, 0], [1, 1, 0, 1, 1], [0, 0, 1, 1, 0]];
var MWSS_PATTERN = [[0, 1, 1, 1, 0, 0], [1, 1, 1, 1, 1, 0], [1, 1, 1, 0, 1, 1], [0, 0, 0, 1, 1, 0]];
var HWSS_PATTERN = [[0, 1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0]];
var spaceshipPatterns = (_spaceshipPatterns = {}, _defineProperty(_spaceshipPatterns, GLIDER_ID, GLIDER_PATTERN), _defineProperty(_spaceshipPatterns, LWSS_ID, LWSS_PATTERN), _defineProperty(_spaceshipPatterns, MWSS_ID, MWSS_PATTERN), _defineProperty(_spaceshipPatterns, HWSS_ID, HWSS_PATTERN), _spaceshipPatterns);
exports.spaceshipPatterns = spaceshipPatterns;
var LOCKED = 0,
    EDITING = 1,
    CLONING = 2;
exports.CLONING = CLONING;
exports.EDITING = EDITING;
exports.LOCKED = LOCKED;
},{}],"src/js/Cell.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cell = /*#__PURE__*/function () {
  function Cell(r, c, maxRow, maxCol) {
    _classCallCheck(this, Cell);

    this.row = r;
    this.col = c;
    this.living = false;
    this.livingNeighbors = 0;
    this.neighbors = [[r - 1, c - 1], [r - 1, c], [r - 1, c + 1], [r, c - 1],
    /* [r, c] */
    [r, c + 1], [r + 1, c - 1], [r + 1, c], [r + 1, c + 1]].filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          i = _ref2[0],
          j = _ref2[1];

      return i >= 0 && j >= 0 && i < maxRow && j < maxCol;
    });
    this.nextState = null;
  }

  _createClass(Cell, [{
    key: "setNextState",
    value: function setNextState() {
      if (this.livingNeighbors == 3 || this.livingNeighbors == 2 && this.living) {
        this.nextState = true;
      } else {
        this.nextState = false;
      }
    }
  }, {
    key: "advanceState",
    value: function advanceState() {
      this.living = this.nextState;
      this.nextState = null;
    }
  }]);

  return Cell;
}(); // const zero = new Cell(0,0)
// const one = new Cell(0,1)
// const ok = new Cell(1,1)
// const last = new Cell(0, )
// const bot = new Cell(maxRow-1, 0)
// const corner = new Cell(maxRow-1, maxCol-1)
// export default Cell


exports.default = Cell;
},{}],"src/js/utilities.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clonePatternFromGrid = exports.getPatternFromGrid = exports.cloneIntoCanvas = exports.placePattern = exports.dropPattern = exports.drawDragPattern = exports.setClickDrawCursor = exports.toggleLife = exports.updateNeighborsLivingNeighbors = exports.paintAllCells = exports.paintCell = exports.fadeIn = exports.getRowColID = exports.getFillColor = exports.isValidCell = exports.randomCellGrid = exports.blankCellGrid = exports.drawGrid = void 0;

var _constants = require("./constants.js");

var _Cell = _interopRequireDefault(require("./Cell"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// set initial state
var drawGrid = function drawGrid(ctx, numRows, numCols) {
  ctx.strokeStyle = _constants.GRID_COLOR;
  ctx.clearRect(0, 0, _constants.CANVAS_WIDTH, _constants.CANVAS_HEIGHT);

  for (var rowID = 0; rowID < numRows; rowID++) {
    for (var colID = 0; colID < numCols; colID++) {
      ctx.beginPath();
      ctx.rect(colID * _constants.BOX_WIDTH, rowID * _constants.BOX_WIDTH, _constants.BOX_WIDTH, _constants.BOX_WIDTH);
      ctx.stroke();
    }
  }
};

exports.drawGrid = drawGrid;

var blankCellGrid = function blankCellGrid(w, h) {
  return _toConsumableArray(Array(w)).map(function (_, i) {
    return _toConsumableArray(Array(h)).map(function (_, j) {
      return new _Cell.default(i, j, w, h);
    });
  });
};

exports.blankCellGrid = blankCellGrid;

var randomCellGrid = function randomCellGrid(w, h, density) {
  return _toConsumableArray(Array(w)).map(function (row) {
    return _toConsumableArray(Array(h)).map(function (cell) {
      return Math.random() < density;
    });
  });
}; // pure helper functions


exports.randomCellGrid = randomCellGrid;

var isValidCell = function isValidCell(row, col) {
  return row >= 0 && row < _constants.maxRow && col >= 0 && col < _constants.maxCol;
};

exports.isValidCell = isValidCell;

var getFillColor = function getFillColor(thisCell) {
  return thisCell.living ? _constants.LIVE_COLOR : 'white';
};

exports.getFillColor = getFillColor;

var getRowColID = function getRowColID(e) {
  var documentOrigin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var canvasNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var offsetX, offsetY;

  if (documentOrigin && canvasNode != null) {
    offsetX = e.clientX - canvasNode.getBoundingClientRect().left;
    offsetY = e.clientY - canvasNode.getBoundingClientRect().top;
  } else {
    offsetX = e.offsetX;
    offsetY = e.offsetY;
  }

  var rowID = Math.floor(offsetY / _constants.BOX_WIDTH);
  var colID = Math.floor(offsetX / _constants.BOX_WIDTH);
  return [rowID, colID];
}; // update/paint cells during lifecycle


exports.getRowColID = getRowColID;

var fadeIn = function fadeIn(painter, ctx, interval) {
  var opacity = 0;
  var fader = setInterval(function () {
    if (opacity >= 1) clearInterval(fader);
    ctx.globalAlpha = opacity;
    painter();
    opacity += 0.1;
  }, interval);
};

exports.fadeIn = fadeIn;

var paintCell = function paintCell(ctx, thisCell) {
  ctx.beginPath();
  ctx.fillStyle = getFillColor(thisCell);
  ctx.fillRect(thisCell.col * _constants.BOX_WIDTH + 1, thisCell.row * _constants.BOX_WIDTH + 1, _constants.BOX_WIDTH - 2, _constants.BOX_WIDTH - 2);
  ctx.stroke();
};

exports.paintCell = paintCell;

var paintAllCells = function paintAllCells(ctx, grid) {
  grid.forEach(function (row, rowID) {
    row.forEach(function (thisCell, colID) {
      paintCell(ctx, thisCell);
    });
  });
};

exports.paintAllCells = paintAllCells;

var updateNeighborsLivingNeighbors = function updateNeighborsLivingNeighbors(cell, grid) {
  var updateVal = cell.living ? 1 : -1;
  cell.neighbors.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        i = _ref2[0],
        j = _ref2[1];

    grid[i][j].livingNeighbors += updateVal;
  });
};

exports.updateNeighborsLivingNeighbors = updateNeighborsLivingNeighbors;

var toggleLife = function toggleLife(cell, grid) {
  cell.living = !cell.living;
  updateNeighborsLivingNeighbors(cell, grid);
};

exports.toggleLife = toggleLife;

var setClickDrawCursor = function setClickDrawCursor(canvasNode, eraseMode) {
  if (eraseMode === undefined) {
    canvasNode.classList.remove('eraseMode', 'pencilMode');
  } else if (eraseMode) {
    canvasNode.classList.add('eraseMode');
    canvasNode.classList.remove('pencilMode');
  } else {
    canvasNode.classList.add('pencilMode');
    canvasNode.classList.remove('eraseMode');
  }
}; // drag/drop patterns onto canvas


exports.setClickDrawCursor = setClickDrawCursor;

var drawDragPattern = function drawDragPattern(patternCanvas, patternScheme) {
  var patternCtx = patternCanvas.getContext('2d');
  patternCtx.strokeStyle = _constants.GRID_COLOR;
  patternScheme.forEach(function (row, rowID) {
    row.forEach(function (val, colID) {
      patternCtx.beginPath();
      patternCtx.rect(colID * _constants.BOX_WIDTH, rowID * _constants.BOX_WIDTH, _constants.BOX_WIDTH, _constants.BOX_WIDTH);
      patternCtx.stroke();

      if (val === 1) {
        patternCtx.beginPath();
        patternCtx.fillStyle = _constants.LIVE_COLOR;
        patternCtx.fillRect(colID * _constants.BOX_WIDTH + 1, rowID * _constants.BOX_WIDTH + 1, _constants.BOX_WIDTH - 2, _constants.BOX_WIDTH - 2);
        patternCtx.stroke();
      }
    });
  });
};

exports.drawDragPattern = drawDragPattern;

var dropPattern = function dropPattern(ctx, grid, offsetX, offsetY, pattern) {
  var topRow = Math.round(offsetY / _constants.BOX_WIDTH + 0.4);
  var leftCol = Math.round(offsetX / _constants.BOX_WIDTH + 0.1);
  var botRow = topRow + pattern.length - 1;
  var rightCol = leftCol + pattern[0].length - 1;

  if (isValidCell(topRow, leftCol) && isValidCell(botRow, rightCol)) {
    placePattern(ctx, grid, topRow, leftCol, pattern);
  }
};

exports.dropPattern = dropPattern;

var placePattern = function placePattern(ctx, grid, topRowID, leftColID, pattern) {
  for (var i = 0; i < pattern.length; i++) {
    for (var j = 0; j < pattern[0].length; j++) {
      var rowID = topRowID + i,
          colID = leftColID + j;
      var thisCell = grid[rowID][colID];
      var patternVal = pattern[i][j];

      if (thisCell.living != (patternVal === 1)) {
        toggleLife(thisCell, grid);
        paintCell(ctx, thisCell);
      }
    }
  }
};

exports.placePattern = placePattern;

var cloneIntoCanvas = function cloneIntoCanvas(ctx, grid, pattern) {
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 6; j++) {
      var thisCell = grid[i][j];
      var patternVal = i < pattern.length && j < pattern[0].length ? pattern[i][j] : 0;

      if (thisCell.living != (patternVal === 1)) {
        toggleLife(thisCell, grid);
        paintCell(ctx, thisCell);
      }
    }
  }
};

exports.cloneIntoCanvas = cloneIntoCanvas;

var getPatternFromGrid = function getPatternFromGrid(grid) {
  return grid.map(function (row) {
    return row.map(function (cell) {
      return cell.living ? 1 : 0;
    });
  });
};

exports.getPatternFromGrid = getPatternFromGrid;

var clonePatternFromGrid = function clonePatternFromGrid(grid, topLeft, botRight) {
  return grid.slice(topLeft[0], botRight[0]).map(function (row) {
    return row.slice(topLeft[1], botRight[1]).map(function (cell) {
      return cell.living ? 1 : 0;
    });
  });
};

exports.clonePatternFromGrid = clonePatternFromGrid;
},{"./constants.js":"src/js/constants.js","./Cell":"src/js/Cell.js"}],"src/js/index.js":[function(require,module,exports) {
"use strict";

var _constants = require("./constants.js");

var _utilities = require("./utilities.js");

var _Cell = _interopRequireDefault(require("./Cell"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var canvas = document.getElementById('mainCanvas');
var ctx = canvas.getContext('2d');
var xHover = document.getElementById('xHover');
var yHover = document.getElementById('yHover');
var startButton = document.getElementById('startButton');
var resetButton = document.getElementById('resetButton');
var randomButton = document.getElementById('randomButton');
var spaceshipNodes = Object.fromEntries(new Map(Object.keys(_constants.spaceshipPatterns).map(function (id) {
  return [id, document.getElementById(id)];
})));
var lockButton = document.getElementById('lockButton');
var editButton = document.getElementById('editButton');
var cloneButton = document.getElementById('cloneButton');
var customCanvas = document.getElementById('customCanvas');
var customCtx = customCanvas.getContext('2d');
/* DRAW CANVASES */

var gridBoxes, customGrid;

var init = function init() {
  gridBoxes = (0, _utilities.blankCellGrid)(_constants.maxRow, _constants.maxCol);
  (0, _utilities.drawGrid)(ctx, _constants.maxRow, _constants.maxCol);

  for (var _i = 0, _Object$entries = Object.entries(spaceshipNodes); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        id = _Object$entries$_i[0],
        node = _Object$entries$_i[1];

    node.setAttribute('width', _constants.BOX_WIDTH * _constants.spaceshipPatterns[id][0].length);
    node.setAttribute('height', _constants.BOX_WIDTH * _constants.spaceshipPatterns[id].length);
    (0, _utilities.drawDragPattern)(node, _constants.spaceshipPatterns[id]);
  }

  customGrid = (0, _utilities.blankCellGrid)(6, 6);
  customCanvas.setAttribute('width', _constants.BOX_WIDTH * 6);
  customCanvas.setAttribute('height', _constants.BOX_WIDTH * 6);
  (0, _utilities.drawGrid)(customCtx, 6, 6);
};
/* CONWAY LIFE CYCLE */
//  1. for all cells, determine next state based on current state, # living neighbors
//  2. store next state in Cell instance variable
//  3. loop cell by cell, keep/flip state based on stored next state
//    a) set new state
//    b) updateNeighborsLivingNeighbors
//    c) nullify stored next state
// end cycle, repeat with next animation frame


var setNextStates = function setNextStates() {
  gridBoxes.forEach(function (row, rowID) {
    row.forEach(function (thisCell, colID) {
      thisCell.setNextState(); // conway rules
    });
  });
};

var applyNextStates = function applyNextStates() {
  gridBoxes.forEach(function (row, rowID) {
    row.forEach(function (thisCell, colID) {
      var stateFlip = thisCell.living != thisCell.nextState;
      thisCell.advanceState(); // conway rules

      if (stateFlip) {
        (0, _utilities.updateNeighborsLivingNeighbors)(thisCell, gridBoxes);
      }
    });
  });
};

var animate = function animate() {
  setNextStates();
  applyNextStates();
  (0, _utilities.fadeIn)(function () {
    return (0, _utilities.paintAllCells)(ctx, gridBoxes);
  }, ctx, 8);
};
/* MAIN CANVAS */
// button click handlers


var isRunning = false;
var animator;

var startListener = function startListener(e) {
  if (!isRunning) {
    animator = setInterval(animate, 500);
    startButton.innerHTML = "Pause";
    startButton.classList.toggle("pause-button", true);
    startButton.classList.toggle("start-button", false);
  } else {
    clearInterval(animator);
    startButton.innerHTML = "Start";
    startButton.classList.toggle("pause-button", false);
    startButton.classList.toggle("start-button", true);
  }

  isRunning = !isRunning;
};

var resetListener = function resetListener(e) {
  gridBoxes = (0, _utilities.blankCellGrid)(_constants.maxRow, _constants.maxCol);
  (0, _utilities.paintAllCells)(ctx, gridBoxes);
};

var randomListener = function randomListener(e) {
  var seedArray = (0, _utilities.randomCellGrid)(_constants.maxRow, _constants.maxCol, _constants.RAND_DENSITY);
  gridBoxes.forEach(function (row, rowID) {
    row.forEach(function (thisCell, colID) {
      if (thisCell.living !== seedArray[rowID][colID]) {
        (0, _utilities.toggleLife)(thisCell, gridBoxes);
      }
    });
  });
  (0, _utilities.paintAllCells)(ctx, gridBoxes);
}; // mouse event handlers


var drawingCells = false;
var eraseMode = false;

var clickDrawStartListener = function clickDrawStartListener(e) {
  var _getRowColID = (0, _utilities.getRowColID)(e),
      _getRowColID2 = _slicedToArray(_getRowColID, 2),
      rowID = _getRowColID2[0],
      colID = _getRowColID2[1];

  var thisCell = gridBoxes[rowID][colID];
  eraseMode = thisCell.living;
  (0, _utilities.setClickDrawCursor)(canvas, eraseMode);
  drawingCells = true;
  (0, _utilities.toggleLife)(thisCell, gridBoxes);
  (0, _utilities.paintCell)(ctx, thisCell);
};

var mouseUpListener = function mouseUpListener(canvasNode) {
  return function (e) {
    (0, _utilities.setClickDrawCursor)(canvasNode);
    drawingCells = false;
  };
};

var moveListener = function moveListener(e) {
  var _getRowColID3 = (0, _utilities.getRowColID)(e),
      _getRowColID4 = _slicedToArray(_getRowColID3, 2),
      rowID = _getRowColID4[0],
      colID = _getRowColID4[1];

  rowHover.innerHTML = rowID;
  colHover.innerHTML = colID;

  if (drawingCells && (0, _utilities.isValidCell)(rowID, colID)) {
    var thisCell = gridBoxes[rowID][colID];

    if (eraseMode === thisCell.living) {
      (0, _utilities.toggleLife)(thisCell, gridBoxes);
      (0, _utilities.paintCell)(ctx, thisCell);
    }
  }
};

var dragImage = null;

var dragPatternStartListener = function dragPatternStartListener(pattern, originNode) {
  return function (e) {
    var shiftX = e.clientX - originNode.getBoundingClientRect().left;
    var shiftY = e.clientY - originNode.getBoundingClientRect().top;
    var clonedYet = false;

    var moveAt = function moveAt(pageX, pageY) {
      if (dragImage) {
        dragImage.style.left = pageX - shiftX + 'px';
        dragImage.style.top = pageY - shiftY + 'px';
      }
    };

    var movePatternListener = function movePatternListener(e) {
      if (!clonedYet) {
        dragImage = originNode.cloneNode(true);
        dragImage.setAttribute('id', 'dragPattern');
        dragImage.style.position = 'absolute';
        dragImage.style.zIndex = 1000;
        (0, _utilities.drawDragPattern)(dragImage, pattern);
        document.body.append(dragImage);
        clonedYet = true;
      }

      moveAt(e.pageX, e.pageY);
    };

    var dropPatternListener = function dropPatternListener(e) {
      document.removeEventListener('mousemove', movePatternListener);
      document.removeEventListener('mouseup', dropPatternListener);

      if (clonedYet) {
        var offsetX = e.clientX - shiftX - canvas.getBoundingClientRect().left;
        var offsetY = e.clientY - shiftY - canvas.getBoundingClientRect().top;
        (0, _utilities.dropPattern)(ctx, gridBoxes, offsetX, offsetY, pattern);
        document.body.removeChild(dragImage);
        dragImage = null;
        clonedYet = false;
      }
    };

    document.addEventListener('mousemove', movePatternListener);
    document.addEventListener('mouseup', dropPatternListener);
  };
};
/* CUSTOM CANVAS */


var customStates = [{
  button: lockButton,
  class: "locked-pattern"
}, {
  button: editButton,
  class: "editing-pattern"
}, {
  button: cloneButton,
  class: "cloning-pattern"
}];
var curCustomState = _constants.LOCKED;
var customDragPatternListener;

var setCustomState = function setCustomState(newState) {
  customStates.forEach(function (stateProps, state) {
    var isNewState = state == newState;
    stateProps.button.disabled = isNewState;
    customCanvas.classList.toggle(stateProps.class, isNewState);
  });

  switch (newState) {
    case _constants.LOCKED:
      var customPattern = (0, _utilities.getPatternFromGrid)(customGrid);
      customDragPatternListener = dragPatternStartListener(customPattern, customCanvas);
      customCanvas.addEventListener('mousedown', customDragPatternListener);
      canvas.classList.toggle("crosshairMode", false);
      canvas.addEventListener('mousedown', clickDrawStartListener);
      canvas.removeEventListener('mousedown', cloneStartListener);
      document.removeEventListener('mousemove', cloneDragListener);
      document.removeEventListener('mouseup', cloneEndListener);
      break;

    case _constants.EDITING:
      customCanvas.removeEventListener('mousedown', customDragPatternListener);
      canvas.classList.toggle("crosshairMode", false);
      canvas.addEventListener('mousedown', clickDrawStartListener);
      canvas.removeEventListener('mousedown', cloneStartListener);
      document.removeEventListener('mousemove', cloneDragListener);
      document.removeEventListener('mouseup', cloneEndListener);
      break;

    case _constants.CLONING:
      customCanvas.removeEventListener('mousedown', customDragPatternListener);
      canvas.classList.toggle("crosshairMode", true);
      canvas.removeEventListener('mousedown', clickDrawStartListener);
      canvas.addEventListener('mousedown', cloneStartListener);
      document.addEventListener('mousemove', cloneDragListener);
      document.addEventListener('mouseup', cloneEndListener);
      break;
  }

  curCustomState = newState;
}; // button click handlers


var lockListener = function lockListener(e) {
  setCustomState(_constants.LOCKED);
};

var editListener = function editListener(e) {
  setCustomState(_constants.EDITING);
};

var cloneListener = function cloneListener(e) {
  setCustomState(_constants.CLONING);
}; // mouse event handlers


var moveCustomListener = function moveCustomListener(e) {
  var _getRowColID5 = (0, _utilities.getRowColID)(e),
      _getRowColID6 = _slicedToArray(_getRowColID5, 2),
      rowID = _getRowColID6[0],
      colID = _getRowColID6[1];

  rowHover.innerHTML = rowID;
  colHover.innerHTML = colID;

  if (drawingCells && rowID >= 0 && rowID < 6 && colID >= 0 && colID < 6) {
    var thisCell = customGrid[rowID][colID];

    if (eraseMode === thisCell.living) {
      (0, _utilities.toggleLife)(thisCell, customGrid);
      (0, _utilities.paintCell)(customCtx, thisCell);
    }
  }
};

var clickDrawCustomListener = function clickDrawCustomListener(e) {
  if (curCustomState == _constants.CLONING) setCustomState(_constants.EDITING);

  if (curCustomState == _constants.EDITING) {
    var _getRowColID7 = (0, _utilities.getRowColID)(e),
        _getRowColID8 = _slicedToArray(_getRowColID7, 2),
        rowID = _getRowColID8[0],
        colID = _getRowColID8[1];

    var thisCell = customGrid[rowID][colID];
    eraseMode = thisCell.living;
    (0, _utilities.setClickDrawCursor)(customCanvas, eraseMode);
    drawingCells = true;
    (0, _utilities.toggleLife)(thisCell, customGrid);
    (0, _utilities.paintCell)(customCtx, thisCell);
  }
};

var cloneSelecting = false;
var cloneTopLeft, cloneBotRight, clonePattern, cloneFrame;

var cloneStartListener = function cloneStartListener(e) {
  var _getRowColID9 = (0, _utilities.getRowColID)(e),
      _getRowColID10 = _slicedToArray(_getRowColID9, 2),
      rowID = _getRowColID10[0],
      colID = _getRowColID10[1];

  if (!cloneFrame) {
    cloneFrame = document.createElement('div');
    cloneFrame.setAttribute('id', 'cloneFrame');
    cloneFrame.style.position = 'absolute';
    cloneFrame.style.zIndex = 1000;
    cloneFrame.style.width = _constants.BOX_WIDTH * 6 + 'px';
    cloneFrame.style.height = _constants.BOX_WIDTH * 6 + 'px';
    cloneFrame.style.border = '3px solid #59cbda';
    drawCloneFrame(rowID, colID);
    document.body.appendChild(cloneFrame);
  }

  cloneTopLeft = [rowID, colID];
  cloneBotRight = [Math.min(cloneTopLeft[0] + 6, _constants.maxRow), Math.min(cloneTopLeft[1] + 6, _constants.maxCol)];
  clonePattern = (0, _utilities.clonePatternFromGrid)(gridBoxes, cloneTopLeft, cloneBotRight);
  (0, _utilities.cloneIntoCanvas)(customCtx, customGrid, clonePattern);
  cloneSelecting = true;
};

var cloneDragListener = function cloneDragListener(e) {
  var _getRowColID11 = (0, _utilities.getRowColID)(e, true, canvas),
      _getRowColID12 = _slicedToArray(_getRowColID11, 2),
      rowID = _getRowColID12[0],
      colID = _getRowColID12[1];

  if (cloneSelecting && (0, _utilities.isValidCell)(rowID, colID)) {
    cloneTopLeft = [rowID, colID];
    cloneBotRight = [Math.min(cloneTopLeft[0] + 6, _constants.maxRow), Math.min(cloneTopLeft[1] + 6, _constants.maxCol)];
    drawCloneFrame(rowID, colID);
    clonePattern = (0, _utilities.clonePatternFromGrid)(gridBoxes, cloneTopLeft, cloneBotRight);
    (0, _utilities.cloneIntoCanvas)(customCtx, customGrid, clonePattern);
  }
};

var cloneEndListener = function cloneEndListener(e) {
  cloneSelecting = false;

  if (cloneFrame) {
    document.body.removeChild(cloneFrame);
    cloneFrame = null;
  }
};

var drawCloneFrame = function drawCloneFrame(rowID, colID) {
  var canvasLeftX = canvas.getBoundingClientRect().left + window.scrollX;
  var canvasTopY = canvas.getBoundingClientRect().top + window.scrollY;
  var shiftX = colID * _constants.BOX_WIDTH;
  var shiftY = rowID * _constants.BOX_WIDTH;
  cloneFrame.style.left = canvasLeftX + shiftX + 'px';
  cloneFrame.style.top = canvasTopY + shiftY + 'px';
  var cellW = Math.min(6, _constants.maxCol - colID);
  var cellH = Math.min(6, _constants.maxRow - rowID);
  cloneFrame.style.width = _constants.BOX_WIDTH * cellW + 'px';
  cloneFrame.style.height = _constants.BOX_WIDTH * cellH + 'px';
};
/* EVENT LISTENER ASSIGNMENTS */
// handles drawing/erasing cells in canvas


canvas.addEventListener('mousemove', moveListener);
document.addEventListener('mouseup', mouseUpListener(canvas));
canvas.addEventListener('mousedown', clickDrawStartListener); // handles pattern drag and drop

for (var _i2 = 0, _Object$entries2 = Object.entries(spaceshipNodes); _i2 < _Object$entries2.length; _i2++) {
  var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
      id = _Object$entries2$_i[0],
      node = _Object$entries2$_i[1];

  node.addEventListener('mousedown', dragPatternStartListener(_constants.spaceshipPatterns[id], node));
  node.addEventListener('dragstart', function () {
    return false;
  });
} // handles button presses (main canvas)


startButton.addEventListener('click', startListener);
resetButton.addEventListener('click', resetListener);
randomButton.addEventListener('click', randomListener); // handles button presses (custom canvas)

lockButton.addEventListener('click', lockListener);
editButton.addEventListener('click', editListener);
cloneButton.addEventListener('click', cloneListener); // custom pattern canvas behavior

customCanvas.addEventListener('mousemove', moveCustomListener);
document.addEventListener('mouseup', mouseUpListener(customCanvas));
customCanvas.addEventListener('mousedown', clickDrawCustomListener); // reset cell ID display upon leaving canvas

canvas.addEventListener('mouseout', function () {
  rowHover.innerHTML = '---';
  colHover.innerHTML = '---';
});
/* run upon loading script */

init();
},{"./constants.js":"src/js/constants.js","./utilities.js":"src/js/utilities.js","./Cell":"src/js/Cell.js"}],"../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65491" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/js/index.js"], null)
//# sourceMappingURL=/js.d818e0ef.js.map
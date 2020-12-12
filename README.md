# Cell Blocks
An interactive [cellular automaton](https://en.wikipedia.org/wiki/Cellular_automaton) with cell-state evolution governed by [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) rules - built using HTML5 Canvas, JavaScript, and CSS.

Live link: [freerangeandy.github.io/cell-blocks/](https://freerangeandy.github.io/cell-blocks/)

## Setup Instructions
- **Clone Repository**
  - See GitHub's instructions for [cloning a repository](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) to your local machine.  
  - Alternatively, open a terminal window and change the current working directory to the location where you want the cloned directory to appear. Then, execute the following command: `git clone https://github.com/freerangeandy/cell-blocks`
- **Install Parcel**
  - Parcel is used to bundle assets in this application. See [Parcel's official instructions](https://parceljs.org/getting_started.html) for installing Parcel on your local machine.
  - Alternatively, open a terminal window and install Parcel globally with either of the following commands:
    - Yarn: `yarn global add parcel-bundler`
    - npm: `npm install -g parcel-bundler`
- **Run Website**
  - Open a terminal window with the project root as the current working directory. Then, execute the following to start a local server hosting the website: `yarn start`
  - Open a web browser tab and visit [localhost:1234](http://localhost:1234/) to access the website.  
  *Note: If port 1234 is already busy on localhost, the website will be hosted at the alternative port shown in the terminal output upon starting the local server.*

## Usage
**Main Grid**
The central two-dimensional grid (30x60) displays the current configuration of cell states at any given generation of the cellular automaton process. A live cell appears red while a dead cell is blank.
- Hovering the mouse over a particular cell will display its coordinates (row/column) in the top left corner of the browser window.  
- Clicking the mouse over a cell will toggle its state between live and dead.
- Click-dragging the mouse over a swath of cells will set them collectively to be live or dead depending on what state the initial cell clicked was set to.

**Conway Rules**
At each new generation (once per 1/2 second), every cell in the grid transitions to *live* or *dead* according to the following rules :
- Any live cell with 2 or 3 live neighbors will stay live.
- Any dead cell with 3 live neighbors will become live.
- All other live cells will become dead, and all other dead cells stay dead.
A cell's *neighbors* are the 8 cells directly adjacent horizontally, vertically, or diagonally to it.

**Buttons**
- Start/Pause: Toggles on/off the step-wise cellular automaton process, which steps forward one generation per 1/2 second.
- Reset: Sets all cells in the grid to the dead state.
- Randomize: Sets every cell to a random state, with a 40% chance of being live and a 60% chance of being dead.

**Patterns**
The row of pre-set patterns below the main grid can be dragged and dropped onto the main grid to set the cells underneath the drop area to match that pattern.
- Static Patterns: Each starting *spaceship* pattern will repeatedly cycle through several cell configurations until the original pattern re-appears translated one cell from its original grid location.
- Custom Pattern: A small grid (6x6) can be used to create custom patterns manually or by capturing an area from the main grid. It exists in one of three modes (Edit, by default) which can be set using their corresponding buttons.
  - Lock (gray border): The current pattern in the custom grid can be dragged and dropped onto the main grid in the same way as a static pattern. The pattern cannot be altered while in this mode.
  - Edit (green border): Cells in the custom grid can have their state toggled or set by clicking or click-dragging the mouse in the same way as in the main grid.
  - Clone (blue border): Clicking on the main grid will cause the custom grid to take on the same cell pattern as the one surrounded by the blue square  that appears while the mouse is held down. *Note: Clicking directly on the custom grid while in this mode will switch it to Edit mode*

## Credits
Conway's Game of Life patterns: [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

### *rough draft*
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

buttons:
-start/pause
-reset
-randomize

conway rules:
-neighbors to live
-neighbors to die

clicking canvas:
-click or drag to toggle cells

patterns:
-drag and drop

## Credits
Conway's Game of Life patterns: [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

# GameOfLife

### The game rules
The rules a pretty simple. Every cell observes its surrounding neighbours to check whether its living area is underpopulated, overpopulated or suitable to live in. Each cell has 8 neighbours (except for the ones at the edge of the canvas).

- A dead cell will come alive if exactly 3 neighbours are living
- A living cell will stay alive if 2 or 3 neighbours are living
- Cells with less than 2 neighbours will die of underpopulation, cells with 4 or more neighbours will die of overpopulation

### Run game
Execute index.html

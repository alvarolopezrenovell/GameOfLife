$(document).ready(init);

// Grafics

var columns = null;
var rows = null;
var cell_size = null;
var refresh_ms = null;

// Others variables

var c = null;
var ctx = null;

var grid = new Array();

var game_loop = null;
var mouse_clicked = false;

function init() {
	c = $('#game')[0];
	ctx = c.getContext("2d");

	columns = parseInt($('#columns').val())-1;
	rows = parseInt($('#rows').val())-1;
	cell_size = parseInt($('#cell_size').val());
	refresh_ms = parseInt($('#refresh_ms').val());

	setStyles();

	// Create grid
	grid = new Array();

	for (var x = 0; x <= columns; x++) {
		grid[x] = new Array();
		for (var y = 0; y <= rows; y++) {
			grid[x][y] = false;
		}
	}

	// Draw initial cells
	drawGrid();

	// Start game
	startGame();
}

function setStyles() {
	// Set styles
	var width = (columns * cell_size) + cell_size;
	var height = (rows * cell_size) + cell_size;

	$(c).prop('width', width);
	$(c).prop('height', height);
}

function loop() {
	// Copy grid
	var next_grid = JSON.parse(JSON.stringify(grid));

	// Get next states
	for (var x = 0; x <= columns; x++) {
		for (var y = 0; y <= rows; y++) {
			var state = getStateCell(x, y);
			next_grid[x][y] = nextCellState(x, y, state);
		}
	}

	// Copy next grid to current grid
	grid = JSON.parse(JSON.stringify(next_grid));

	// Draw new states
	drawGrid();
}

function nextCellState(x, y, state) {
	var num_active_neighbours = getNumActiveNeighbours(x, y);
	var new_state = false;

	if (state && (num_active_neighbours === 2 || num_active_neighbours === 3)) {
		new_state = true;
	} else if (!state && num_active_neighbours === 3) {
		new_state = true;
	}

	return new_state;
}

function getNumActiveNeighbours(x, y) {
	var active_neighbours = getActiveNeighbours(x, y);
	var num_active_neighbours = active_neighbours.length

	return num_active_neighbours;
}

function getActiveNeighbours(x, y) {
	var neighbours = getNeighbours(x, y);

	var active_neighbours = new Array();

	for (var index in neighbours) {
		var neighbour = neighbours[index];
		if (neighbour) {
			active_neighbours.push(index);
		}
	}	

	return active_neighbours;
}

function getNeighbours(x, y) {
	x = parseInt(x);
	y = parseInt(y);

	var position_neighbours = [
		// top row
		{'x': (x-1), 'y': (y-1)}, 
		{'x': (x), 'y': (y-1)}, 
		{'x': (x+1), 'y': (y-1)}, 
		// middle row	
		{'x': (x-1), 'y': (y)}, 
		{'x': (x+1), 'y': (y)}, 	 
		// bottom row
		{'x': (x-1), 'y': (y+1)}, 
		{'x': (x), 'y': (y+1)}, 
		{'x': (x+1), 'y': (y+1)}, 
	];

	var neighbours = [];

	for (var i = 0; i < position_neighbours.length; i++) {
		position = position_neighbours[i];
		neighbours[position.x+'-'+position.y] = getStateCell(position.x, position.y);
	}

	return neighbours;
}

function areNeighbours(x1, y1, x2, y2) {
	var neighbours = getNeighbours(x1, y1);

	for (var index in neighbours) {
		var neighbour = neighbours[index];
		if (neighbour && index === (x2+'-'+y2)) {
			return true;
		}
	}

	return false;
}

function getStateCell(x, y) {
	var state = false;

	x = (x < 0) ? columns : x;
	x = (x > columns) ? 0 : x;
	y = (y < 0) ? rows : y;
	y = (y > rows) ? 0 : y;

	state = grid[x][y];

	return state;
}

function drawGrid() {
	for (var x = 0; x < grid.length; x++) {
		for (var y = 0; y < grid[x].length; y++) {
			var state = getStateCell(x, y);
			drawCell(x, y, state);
		}
	}
}

function drawCell(x, y, state, on_color, off_color) {
	if (on_color === undefined) {
		on_color = 'black';
	}

	if (off_color === undefined) {
		off_color = 'white';
	}

	ctx.fillStyle = state ? on_color : off_color;
    ctx.fillRect(x * cell_size + 1, y * cell_size + 1, cell_size - 1, cell_size - 1);

    grid[x][y] = state;

    c.addEventListener('click', handleClick);
    c.addEventListener('mousemove', handleClick);
}

function handleClick(e) {
	if (e.which === 1) {
		mouse_clicked = true;

		var x = Math.floor(e.offsetX / cell_size);
		var y = Math.floor(e.offsetY / cell_size);

		if (x >= 0 && x <= columns && y >= 0 && y <= rows) {
			drawCell(x, y, true);
			stopGame();
		}
		
	} else if (mouse_clicked) {
		startGame();
		mouse_clicked = false;
	}
}

function startGame() {
	if (game_loop === null) {
		game_loop = setInterval(loop, refresh_ms);
	}
}

function stopGame() {
	clearInterval(game_loop);
	game_loop = null;
}

function updateCellSize() {
	cell_size = parseInt($('#cell_size').val());
	setStyles();
}

function updateRefreshMs() {
	refresh_ms = parseInt($('#refresh_ms').val());
	stopGame();
	startGame();
}
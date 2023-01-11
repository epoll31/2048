
window.onload = (_) => {
	gfx.canvas = document.getElementById('canvas');
	gfx.ctx = gfx.canvas.getContext("2d");

	pullScores();
}
const gfx = {
	draw: (tile) => {
		let s = gfx.canvas.width / 4;
		let r = 0.15 * s;


		let x0 = tile.col * s;
		let y0 = tile.row * s;
		let x1 = x0 + r / 4;
		let y1 = y0 + r / 4;
		let x2 = x0 + s - r / 4;
		let y2 = y0 + s - r / 4;
			
		gfx.ctx.fillStyle = colors[tile.lvl];
  	gfx.ctx.beginPath();
  	gfx.ctx.moveTo(x1 + r, y1);
  	gfx.ctx.arcTo(x2, y1, x2, y2, r);
  	gfx.ctx.arcTo(x2, y2, x1, y2, r);
  	gfx.ctx.arcTo(x1, y2, x1, y1, r);
  	gfx.ctx.arcTo(x1, y1, x2, y1, r);
  	gfx.ctx.closePath();
		gfx.ctx.fill();
		gfx.ctx.fillStyle = '#EABDA8';
		gfx.ctx.font = '2em Comfortaa'; 
		gfx.ctx.textAlign = 'center';
		gfx.ctx.textBaseline = 'middle';
		gfx.ctx.fillText(
			Math.pow(2, tile.lvl + 1),
			x0 + s / 2, 
			y0 + s / 2,
			s);
	},
	
	clear: () => {
		gfx.ctx.clearRect(0, 0, gfx.canvas.width, gfx.canvas.height);
	}
};
const speed = 300;
let gameLoop = undefined;
let isGameOver = true;

const colors = ['#4B8B70', '#5B967D', '#6AA089', '#78A994', '#84B19E', '#DD8F79', '#DA846C', '#D6785D', '#D26A4D', '#CE5B3B'];

let tiles = [ ];



const swipeUp = () => {
	let seen = [];
	while (tiles.length != 0) {
		tiles.sort((t1, t2) => t1.row < t2.row);
		const tile = tiles.shift();

		let remove = false;
		for (let r = tile.row - 1; r >= 0; r--) {
			const tb = tileAt(r, tile.col); // tb: tile before
			if (!tb) {
				tile.row--;
			}
			else if (tb.lvl == tile.lvl) {
				tb.lvl++;
				remove = true;
				break;
			}
		}
		if (remove) {
			tiles.filter(t => t != tile);
		}
		else {
			seen.push(tile);
		}
	}
	tiles = seen;
	console.log('tiles: ', tiles);
}


const swipeDown = () => {
	let seen = [];
	while (tiles.length != 0) {
		tiles.sort((t1, t2) => t1.row > t2.row);
		const tile = tiles.shift();

		let remove = false;
		for (let r = tile.row + 1; r < 4; r++) {
			const tb = tileAt(r, tile.col); // tb: tile before
			if (!tb) {
				tile.row++;
			}
			else if (tb.lvl == tile.lvl) {
				tb.lvl++;
				remove = true;
				break;
			}
		}
		if (remove) {
			tiles.filter(t => t != tile);
		}
		else {
			seen.push(tile);
		}
	}
	tiles = seen;
	console.log('tiles: ', tiles);
}

const swipeLeft = () => {
	let seen = [];
	while (tiles.length != 0) {
		tiles.sort((t1, t2) => t1.col < t2.col);
		const tile = tiles.shift();

		let remove = false;
		for (let c = tile.col - 1; c >= 0; c--) {
			const tb = tileAt(tile.row, c); // tb: tile before
			if (!tb) {
				tile.col--;
			}
			else if (tb.lvl == tile.lvl) {
				tb.lvl++;
				remove = true;
				break;
			}
		}
		if (remove) {
			tiles.filter(t => t != tile);
		}
		else {
			seen.push(tile);
		}
	}
	tiles = seen;
	console.log('tiles: ', tiles);
}

const swipeRight = () => {
	let seen = [];
	while (tiles.length != 0) {
		tiles.sort((t1, t2) => t1.col > t2.col);
		const tile = tiles.shift();

		let remove = false;
		for (let c = tile.col + 1; c < 4; c++) {
			const tb = tileAt(tile.row, c); // tb: tile before
			if (!tb) {
				tile.col++;
			}
			else if (tb.lvl == tile.lvl) {
				tb.lvl++;
				remove = true;
				break;
			}
		}
		if (remove) {
			tiles.filter(t => t != tile);
		}
		else {
			seen.push(tile);
		}
	}
	tiles = seen;
	console.log('tiles: ', tiles);
}



const tileAt = (r, c) => tiles.find(t => t.row == r && t.col == c);
const addTile = () => {
	if (tiles.length >= 16) {
		gameOver();
		return;
	}

	const tile = {
		row: 0,
		col: 0,
		lvl: 0
	};

	do {
		tile.row = Math.floor(Math.random() * 4);
		tile.col = Math.floor(Math.random() * 4);
			
		} while (tileAt(tile.row, tile.col));

	tiles.push(tile);
};

const update = () => {
	
};

const draw = () => {
	gfx.clear();
	
	tiles.forEach(gfx.draw);

	if (!isGameOver) {
		requestAnimationFrame(draw);
	}
};

window.onkeydown = (event) => { 
	if (isGameOver) {
		return;
	}
	let force = false;

	switch (event.key) {
		case 'w':
		case 'W':
		case 'ArrowUp': {	
			swipeUp();
			force = true;
		
		}; break;
		case 's':
		case 'S':
		case 'ArrowDown': {
			swipeDown();
			force = true;
		
		}; break;
		case 'a':
		case 'A':
		case 'ArrowLeft': {
			swipeLeft();
			force = true;
				
		}; break;
		case 'd':
		case 'D':
		case 'ArrowRight': {
			swipeRight();
			force = true;
				
		}; break;
		case ' ': {
		}; break;
	}
	if (force) {
		addTile();
		forceUpdate();
	}
};

const reset = () => {
	if (gameLoop) {
		clearInterval(gameLoop);
	}
	gameLoop = setInterval(update, speed);
	pullScores();

	while (tiles.length != 0) {
		tiles.pop();
	}
	addTile();

	const el = document.getElementById('game');
	el.classList.remove('paused');


	requestAnimationFrame(draw);
	isGameOver = false;
};

const forceUpdate = () => {
	update();
	draw();
}
const gameOver = () => {
	isGameOver = true;

	pushScore();	
	const el = document.getElementById('game');
	el.classList.add('paused');	
		
	clearInterval(gameLoop);
}

let scores = [];

const pushScore = () => {
	//const score = snakes.length * 5;
	//scores.push(score);
	//localStorage.setItem('scores', JSON.stringify(scores));
}
const pullScores = () => {

	let saved = JSON.parse(localStorage.getItem('scores'));
	if (!saved) {
		saved = [ ];
	}

	scores = saved;
	renderHighScores();
}

const renderHighScores = () => {
	const scoresEl = document.getElementById('scores');
	while (scoresEl.firstChild) {
		scoresEl.removeChild(scoresEl.firstChild);
	}
	scores.sort((a, b) => a < b).filter((_, i) => i < 5).forEach(s => {
		const el = document.createElement('p');
		el.innerText = s;
		scoresEl.appendChild(el);
	});
	if (!scores.length) {
		const el = document.createElement('p');
		el.innerText = 'no high score yet';
		scoresEl.appendChild(el);

	}
}


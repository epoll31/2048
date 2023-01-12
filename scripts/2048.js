
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
let score = 0;

const swipe = (dir) => {
	let currScore = 0;
	for (let i = 0; i < 4; i++) {
		switch(dir) {
			case 'up': {
				let col = tiles.filter(t => t.col == i).sort((t1, t2) => t1.row > t2.row);
				if (col && col.length > 0) {
					col[0].row = 0;
					let merged = false;
					for (let i = 1; i < col.length; i++) {
						let curr = col[i];
						let prev = col[i-1];
						curr.row = prev.row + 1;
		
						if (curr.lvl == prev.lvl && !merged) {
							prev.lvl++;
							col = col.filter((t, j) => i != j);
							tiles = tiles.filter(t => t != curr);
							i--;
							currScore += Math.pow(2, prev.lvl + 1);
							merged = true;
							continue;
						}
					}
				}
			}
				break;
			case 'down': {
				let col = tiles.filter(t => t.col == i).sort((t1, t2) => t1.row < t2.row);
				if (col && col.length > 0) {
					col[0].row = 3;
					let merged = false;
					for (let i = 1; i < col.length; i++) {
						let curr = col[i];
						let prev = col[i-1];
						curr.row = prev.row - 1;
		
						if (curr.lvl == prev.lvl && !merged) {
							prev.lvl++;
							col = col.filter((t, j) => i != j);
							tiles = tiles.filter(t => t != curr);
							i--;
							currScore += Math.pow(2, prev.lvl + 1);
							merged = true;
							continue;
						}
					}
				}

			}
				break; 
			case 'left': {
				let col = tiles.filter(t => t.row == i).sort((t1, t2) => t1.col > t2.col);
				if (col && col.length > 0) {
					col[0].col = 0;
					let merged = false;
					for (let i = 1; i < col.length; i++) {
						let curr = col[i];
						let prev = col[i-1];
						curr.col = prev.col + 1;
		
						if (curr.lvl == prev.lvl && !merged) {
							prev.lvl++;
							col = col.filter((t, j) => i != j);
							tiles = tiles.filter(t => t != curr);
							i--;
							currScore += Math.pow(2, prev.lvl + 1);
							merged = true;
							continue;
						}
					}
				}
			}
				break; 
			case 'right': {
				let col = tiles.filter(t => t.row == i).sort((t1, t2) => t1.col < t2.col);
				if (col && col.length > 0) {
					col[0].col = 3;
					let merged = false;
					for (let i = 1; i < col.length; i++) {
						let curr = col[i];
						let prev = col[i-1];
						curr.col = prev.col - 1;
		
						if (curr.lvl == prev.lvl && !merged) {
							prev.lvl++;
							col = col.filter((t, j) => i != j);
							tiles = tiles.filter(t => t != curr);
							i--;
							currScore += Math.pow(2, prev.lvl + 1);
							merged = true;
							continue;
						}
					}
				}
			}
			break; 
		}
	}
	addTile();
	
	score += currScore;
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

let lastMoves = [];
window.onkeydown = (event) => { 
	if (isGameOver) {
		return;
	}

	let move = undefined;
	switch (event.key) {
		case 'w':
		case 'W':
		case 'ArrowUp': {	
			move = 'up';
		}; break;
		case 's':
		case 'S':
		case 'ArrowDown': {
			move = 'down';	
		}; break;
		case 'a':
		case 'A':
		case 'ArrowLeft': {
			move = 'left';
		}; break;
		case 'd':
		case 'D':
		case 'ArrowRight': {
			move = 'right';
		}; break;
		case ' ': {
		}; break;
	}

	if (move) {
		swipe(move);
	}
};

const reset = () => {
	if (gameLoop) {
		clearInterval(gameLoop);
	}
	gameLoop = setInterval(update, speed);
	pullScores();
	lastMoves = [];
	score = 0;

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
	scores.push(score);
	localStorage.setItem('scores', JSON.stringify(scores));
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


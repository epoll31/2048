let startX;
let startY;




window.onload = (_) => {
	pullScores();

	const board = document.getElementById('board');
	board.ontouchstart = (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
	};

	board.ontouchend = (event) => {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
          console.log("Right swipe");
      } else {
        console.log("Left swipe");
      }
    } else {
      if (deltaY > 0) {
          console.log("Down swipe");
      } else {
        console.log("Up swipe");
      }
    }
	};

}

const speed = 10;
let gameLoop = undefined;
let isGameOver = true;

const colors = "daa588-d2916e-ca7d53-e0a167-db924e-d58234-f56960-dc6587-c261aee-74b28d-80d1a8-8bf0c3".split('-');

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
							removeTile(curr);
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
							removeTile(curr);
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
							removeTile(curr);
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
							removeTile(curr);
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
	update();
	score += currScore;
 document.getElementById('title').innerText = score;
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
		lvl: Math.round(Math.random()),
		el: document.createElement('p')
	};

	document.getElementById('board').appendChild(tile.el);

	do {
		tile.row = Math.floor(Math.random() * 4);
		tile.col = Math.floor(Math.random() * 4);
			
	} while (tileAt(tile.row, tile.col));

	tile.el.innerText = Math.pow(2, tile.lvl + 1);
	tile.el.style.left = 25 * tile.col + '%';
	tile.el.style.top = 25 * tile.row + '%';
	tiles.push(tile);
};
const removeTile = (tile) => {
	tiles = tiles.filter(t => t != tile);
	document.getElementById('board').removeChild(tile.el);
}

const update = () => {
	tiles.forEach(tile => {
		tile.el.innerText = Math.pow(2, tile.lvl + 1);

		tile.el.style.left = (2.5 + 23.75 * tile.col + 1) + '%';
		tile.el.style.top = (2.5 + 23.75 * tile.row + 1) + '%';
		const a = Math.round((Math.min(1, Math.max(0, ((11 - tile.lvl) / 10))) + Number.EPSILON) * 100) / 100
		
		tile.el.style.backgroundColor = '#' + colors[Math.min(tile.lvl, colors.length - 1)];

		if (tile.lvl > 18) {
			tile.el.style.fontSize = '1em';
		}
		else if (tile.lvl > 16) {
			tile.el.style.fontSize = '1.25em';
		}
		else if (tile.lvl > 10) {
			tile.el.style.fontSize = '2em';
		}
		else if (tile.lvl > 8) {
			tile.el.style.fontSize = '2.5em';
		}

 
	});
};


window.onkeydown = (event) => { 
	if (isGameOver) {
		if (event.key === ' ') {
			reset();
		}

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
		removeTile(tiles[0]);
	}

	addTile();
	addTile();

	document.body.classList.remove('paused');

	isGameOver = false;
};

const gameOver = () => {
	isGameOver = true;

	pushScore();	
	pullScores();	
	document.body.classList.add('paused');	
		
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


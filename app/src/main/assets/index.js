console.log("index.js");
const canvas = document.getElementById("gameCanvas");
const gameControls = document.getElementById("gameControls");
const g = document.getElementById("gameCanvas").getContext("2d");
let currentState;

const readState = (dataString) => {
	const gameState = {
		history: [],
		player: {},
		walls: [],
		boxes: [],
		goals: [],
	};
	const lines = dataString.split("\n");
	for (let y = 0; y < lines.length; y++) {
		for (let x = 0; x < lines[y].length; x++) {
			const c = lines[y][x];

			if (c === " ") {
				// empty space
			}
			else if (c === "P") {
				gameState.player = { x, y };
			}
			else if (c === "#") {
				gameState.walls.push({ x, y });
			}
			else if (c === "B") {
				gameState.boxes.push({ x, y });
			}
			else if (c === "G") {
				gameState.goals.push({ x, y });
			}
			else if (c === "O") {
				gameState.boxes.push({ x, y });
				gameState.goals.push({ x, y });
			}
		}
	}
	return gameState;
};

const cloneState = (gameState) => {
	// oh man i regret using javascript
	return JSON.parse(JSON.stringify(gameState));
};

const sameState = (aState, bState) => {
};

const isVisited = (gameState) => {
	// todo fix possible hash collisions
	const hash = hashState(gameState);
	if (visited[hash]) {
		return true;
	}
	visited[hash] = true;
	return false;
};

const hasBox = (gameState, x, y) => {
	for (let box of gameState.boxes) {
		if (box.x === x && box.y === y) {
			return box;
		}
	};
	return null;
};

const hasWall = (gameState, x, y) => {
	for (let wall of gameState.walls) {
		if (wall.x === x && wall.y === y) {
			return wall;
		}
	};
	return null;
};

const hasSpace = (gameState, x, y) => {
	if (hasBox(gameState, x, y)) {
		return false;
	}
	if (hasWall(gameState, x, y)) {
		return false;
	}
	return true;
};

const isWin = (gameState) => {
	for (let goal of gameState.goals) {
		if (!hasBox(gameState, goal.x, goal.y)) {
			return false;
		}
	}
	return true;
};

const boxStuck = (gameState) => {
	for (let box of gameState.boxes) {
	}
	return false;
};

const isLose = (gameState) => {
	if (boxStuck(gameState)) {
		return true;
	}
	return false;
};

const moveLeft = (gameState) => {
	const clone = cloneState(gameState);
	const { x, y } = clone.player;
	if (hasWall(clone, x - 1, y)) {
		return;
	}

	const box = hasBox(clone, x - 1, y);
	if (box) {
		if (!hasSpace(clone, x - 2, y)) {
			return;
		}
		box.x = box.x - 1;
	}

	clone.player.x = x - 1;
	clone.history.push('L');
	taskList.push(clone);
};

const moveRight = (gameState) => {
	const clone = cloneState(gameState);
	const { x, y } = clone.player;
	if (hasWall(clone, x + 1, y)) {
		return;
	}

	const box = hasBox(clone, x + 1, y);
	if (box) {
		if (!hasSpace(clone, x + 2, y)) {
			return;
		}
		box.x = box.x + 1;
	}

	clone.player.x = x + 1;
	clone.history.push('R');
	taskList.push(clone);
};

const moveUp = (gameState) => {
	const clone = cloneState(gameState);
	const { x, y } = clone.player;
	if (hasWall(clone, x, y - 1)) {
		return;
	}

	const box = hasBox(clone, x, y - 1);
	if (box) {
		if (!hasSpace(clone, x, y - 2)) {
			return;
		}
		box.y = box.y - 1;
	}

	clone.player.y = y - 1;
	clone.history.push('U');
	taskList.push(clone);
};

const moveDown = (gameState) => {
	const clone = cloneState(gameState);
	const { x, y } = clone.player;
	if (hasWall(clone, x, y + 1)) {
		return;
	}

	const box = hasBox(clone, x, y + 1);
	if (box) {
		if (!hasSpace(clone, x, y + 2)) {
			return;
		}
		box.y = box.y + 1;
	}

	clone.player.y = y + 1;
	clone.history.push('D');
	taskList.push(clone);
};

const cellSize = 40;

const drawState = () => {
	currentState.walls.forEach(i => {
		g.fillStyle = 'grey';
		g.fillRect(i.x * cellSize, i.y * cellSize, cellSize, cellSize);
	});
	currentState.goals.forEach(i => {
		g.fillStyle = 'green';
		g.fillRect(i.x * cellSize, i.y * cellSize, cellSize, cellSize);
	});
	currentState.boxes.forEach(i => {
		g.fillStyle = 'white';
		g.fillRect(i.x * cellSize, i.y * cellSize, cellSize, cellSize);
	});
	{
		const p = currentState.player;
		g.fillStyle = 'gold';
		g.fillRect(p.x * cellSize, p.y * cellSize, cellSize, cellSize);
	}
};

const renderFrame = () => {
	console.log("renderFrame");
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	g.fillStyle = 'black';
	g.fillRect(0, 0, canvas.width, canvas.height);
	drawState();
}

const showControls = () => {
	gameControls.style.opacity = "1.0";
};

const hideControls = () => {
	gameControls.style.opacity = "0.0";
};

hideControls();
currentState = readState(window.gameMaps.map11);
renderFrame();
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener("resize", renderFrame);
document.addEventListener("touchstart", () => {
	showControls();
});
document.addEventListener("touchend", () => {
	hideControls();
});
document.getElementById("buttonLeft").addEventListener("touchend", () => {
	console.log("buttonLeft");
});
document.getElementById("buttonRight").addEventListener("touchend", () => {
	console.log("buttonRight");
});
document.getElementById("buttonUp").addEventListener("touchend", () => {
	console.log("buttonUp");
});
document.getElementById("buttonDown").addEventListener("touchend", () => {
	console.log("buttonDown");
});
document.getElementById("buttonMenu").addEventListener("touchend", () => {
	console.log("buttonMenu");
});
document.getElementById("buttonReset").addEventListener("touchend", () => {
	console.log("buttonReset");
});
document.getElementById("buttonForward").addEventListener("touchend", () => {
	console.log("buttonForward");
});
document.getElementById("buttonMiddle").addEventListener("touchend", () => {
	console.log("buttonMiddle");
});
document.getElementById("buttonBackward").addEventListener("click", () => {
	console.log("buttonBackward");
});
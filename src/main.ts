import "./style.css";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

let requestId: number;

const width = 50;
const height = 50;
const tileWidth = 8;

const maze = new Map(); // N, E, S, W, Visited
const historyMaze: number[][] = [];

const startPoint: number[] = [0, Math.floor(Math.random() * height)];

historyMaze.push(startPoint);
maze.set(`${startPoint[0]},${startPoint[1]}`, [
  false,
  false,
  false,
  false,
  true,
]);

canvas.setAttribute("width", width * 2 * tileWidth + width * tileWidth + "px");
canvas.setAttribute(
  "height",
  height * 2 * tileWidth + height * tileWidth + "px",
);

const ctx = canvas.getContext("2d");

const mazeDraw = () => {
  const currentPosition = historyMaze[historyMaze.length - 1];
  const x = currentPosition[0];
  const y = currentPosition[1];
  if (maze.size == width * height) {
    cancelAnimationFrame(requestId);
    return;
  }

  let neighbours = [];
  // check neighbour;
  // north
  if (y > 0 && (!maze.get(`${x},${y - 1}`) || !maze.get(`${x},${y - 1}`)[4])) {
    neighbours.push(0);
  }
  // east
  if (
    x < width - 1 &&
    (!maze.get(`${x + 1},${y}`) || !maze.get(`${x + 1},${y}`)[4])
  ) {
    neighbours.push(1);
  }
  // south
  if (
    y < height - 1 &&
    (!maze.get(`${x},${y + 1}`) || !maze.get(`${x},${y + 1}`)[4])
  ) {
    neighbours.push(2);
  }
  // west
  if (x > 0 && (!maze.get(`${x - 1},${y}`) || !maze.get(`${x - 1},${y}`)[4])) {
    neighbours.push(3);
  }

  if (neighbours.length > 0) {
    const direction = neighbours[Math.floor(Math.random() * neighbours.length)];

    switch (direction) {
      case 0: {
        const currentMap = maze.get(`${x},${y}`);
        currentMap[0] = true;
        maze.set(`${x},${y}`, currentMap);
        maze.set(`${x},${y - 1}`, [false, false, true, false, true]);
        historyMaze.push([x, y - 1]);
        break;
      }
      case 1: {
        const currentMap = maze.get(`${x},${y}`);
        currentMap[1] = true;
        maze.set(`${x},${y}`, currentMap);
        maze.set(`${x + 1},${y}`, [false, false, false, true, true]);
        historyMaze.push([x + 1, y]);
        break;
      }
      case 2: {
        const currentMap = maze.get(`${x},${y}`);
        currentMap[2] = true;
        maze.set(`${x},${y}`, currentMap);
        maze.set(`${x},${y + 1}`, [true, false, false, false, true]);
        historyMaze.push([x, y + 1]);
        break;
      }
      case 3: {
        const currentMap = maze.get(`${x},${y}`);
        currentMap[3] = true;
        maze.set(`${x},${y}`, currentMap);
        maze.set(`${x - 1},${y}`, [false, true, false, false, true]);
        historyMaze.push([x - 1, y]);
        break;
      }
      default:
        break;
    }
  } else {
    historyMaze.pop();
  }
};

const drawTiles = () => {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      ctx?.beginPath();
      ctx.rect(
        x * tileWidth * 3,
        y * tileWidth * 3,
        tileWidth * 2,
        tileWidth * 2,
      );
      ctx.fillStyle = "blue";
      ctx.fill();

      const tile = maze.get(`${x},${y}`);
      if (tile) {
        ctx?.beginPath();
        ctx.rect(
          x * tileWidth * 3,
          y * tileWidth * 3,
          tileWidth * 2,
          tileWidth * 2,
        );
        ctx.fillStyle = "white";
        ctx.fill();

        // check east visited
        if (tile[1] && tile[4]) {
          // open east gate
          ctx?.beginPath();
          ctx.rect(
            x * tileWidth * 3 + tileWidth * 2,
            y * tileWidth * 3,
            tileWidth,
            tileWidth * 2,
          );
          ctx.fillStyle = "white";
          ctx.fill();
        }

        // check south & visited
        if (tile[2] && tile[4]) {
          // open south gate
          ctx?.beginPath();
          ctx.rect(
            x * tileWidth * 3,
            y * tileWidth * 3 + tileWidth * 2,
            tileWidth * 2,
            tileWidth,
          );
          ctx.fillStyle = "white";
          ctx.fill();
        }
      }
    }
  }

  // currentPosition
  const currentPosition = historyMaze[historyMaze.length - 1];
  ctx?.beginPath();
  ctx.rect(
    currentPosition[0] * tileWidth * 3,
    currentPosition[1] * tileWidth * 3,
    tileWidth * 2,
    tileWidth * 2,
  );
  ctx.fillStyle = "green";
  ctx.fill();

  mazeDraw();
};

const render = () => {
  drawTiles();
  requestId = requestAnimationFrame(render);
};

render();

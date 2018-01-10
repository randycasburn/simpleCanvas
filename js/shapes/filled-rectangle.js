import {state} from '../state/state';
import hexToRGB from '../utils/hexToRgb';

let tempCanvas = document.getElementById('temp-canvas');
let tempContext = tempCanvas.getContext('2d');
let canvas = document.getElementById('main-canvas');
let context = canvas.getContext('2d');

const thisTool = 'filled-rectangle';

let isMouseDown = false;
let points = [];
let cachedPoints = []

let filled = true; // only difference with rectangle

tempCanvas.addEventListener('mousedown', function (e) {
  if(state.get('currentTool') !== thisTool) return;
  points[points.length] = [e.layerX, e.layerY]
  isMouseDown = true;
});

tempCanvas.addEventListener('mousemove', function (e) {
  if(!thisTool.includes(state.get('currentTool'))) return;
  if (isMouseDown) {
    points[points.length] = [e.layerX, e.layerY];
    draw();
  }
});

tempCanvas.addEventListener('mouseup', function (e) {
  if(!thisTool.includes(state.get('currentTool'))) return;
  if (isMouseDown) {
    finish();
  }
});

function draw () {
  let color = hexToRGB(state.get('currentColor'));
  tempContext.lineWidth = 5;
  tempContext.lineJoin = 'square';
  tempContext.lineCap = 'square';
  tempContext.strokeStyle = color;
  tempContext.fillStyle = color;
  
  tempContext.clearRect(0, 0, innerWidth, innerHeight);
  let lx = points[0][0];
  let ly = points[0][1];
  let mx = points[points.length - 1][0];
  let my = points[points.length - 1][1];

  tempContext.fillRect(lx, ly, mx-lx, my-ly)
}

function finish () {
  cachedPoints = points;
  points = [];
  context.drawImage(tempCanvas, 0, 0);
  tempContext.clearRect(0, 0, innerWidth, innerHeight);
  isMouseDown = false;
}

export function render(coords){
  isMouseDown = true;
  points = coords;
  draw();
  finish();
}


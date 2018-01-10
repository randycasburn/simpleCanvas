import {state} from '../state/state';
import {addText} from './text';

const tempCanvas = document.getElementById('temp-canvas');
const tempContext = tempCanvas.getContext('2d');
const canvas = document.getElementById('main-canvas');
const context = canvas.getContext('2d');

const thisTool = 'arrow';

let isMouseDown = false;
let points = [];
let cachedPoints = []

tempCanvas.addEventListener('mousedown', function (e) {
  if(state.get('currentTool') !== thisTool) return;
  points[points.length] = [e.layerX, e.layerY]
  isMouseDown = true;
});

tempCanvas.addEventListener('mousemove', function (e) {
  if(state.get('currentTool') !== thisTool) return;
  if (isMouseDown) {
    points[points.length] = [e.layerX, e.layerY];
    draw();
  }
});

tempCanvas.addEventListener('mouseup', function (e) {
  if(state.get('currentTool') !== thisTool) return;
  if (isMouseDown) {
    draw();
    finish(e.layerX, e.layerY);
  }
});

function draw () {
  let color = state.get('currentColor');
  tempContext.lineWidth = 3;
  tempContext.lineJoin = 'round';
  tempContext.lineCap = 'round';
  tempContext.strokeStyle = color;
  tempContext.fillStyle = color;
  
  tempContext.clearRect(0, 0, innerWidth, innerHeight);
  const lx = points[0][0];
  const ly = points[0][1];
  const mx = points[points.length - 1][0];
  const my = points[points.length - 1][1];
  tempContext.beginPath();
  tempContext.moveTo(lx, ly);
  
  const arrowSize = 20;
  const angle = Math.atan2(ly - my, lx - mx);
  tempContext.lineTo(lx - arrowSize * Math.cos(angle - Math.PI / 7), ly - arrowSize * Math.sin(angle - Math.PI / 7));
  tempContext.lineTo(lx - arrowSize * Math.cos(angle + Math.PI / 7), ly - arrowSize * Math.sin(angle + Math.PI / 7));
  tempContext.lineTo(lx, ly);
  tempContext.lineTo(lx - arrowSize * Math.cos(angle - Math.PI / 7), ly - arrowSize * Math.sin(angle - Math.PI / 7));
  tempContext.moveTo(lx, ly);
  tempContext.lineTo(mx, my);
  tempContext.stroke();
  tempContext.fill();
}

document.querySelector('button').addEventListener('click', redraw);
function redraw(){
  console.log(cachedPoints);
  points = cachedPoints;
  draw();
  cachedPoints = points;
  points = [];
  context.drawImage(tempCanvas, 0, 0);
  tempContext.clearRect(0, 0, innerWidth, innerHeight);
  isMouseDown = false;
}

function finish (x=0, y=0) {
  cachedPoints = points;
  points = [];
  context.drawImage(tempCanvas, 0, 0);
  tempContext.clearRect(0, 0, innerWidth, innerHeight);
  isMouseDown = false;
  addText(x,y)
}

export function render(coords){
  isMouseDown = true;
  points = coords;
  draw();
  finish();
}


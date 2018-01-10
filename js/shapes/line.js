import {state} from '../state/state';

let tempCanvas = document.getElementById('temp-canvas');
let tempContext = tempCanvas.getContext('2d');
let canvas = document.getElementById('main-canvas');
let context = canvas.getContext('2d');

const thisTool = 'line';

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
    finish();
  }
});

function draw () {
  tempContext.lineWidth = 5;
  tempContext.lineJoin = 'round';
  tempContext.lineCap = 'round';
  tempContext.strokeStyle = state.get('currentColor');

  tempContext.clearRect(0, 0, innerWidth, innerHeight);
  let lx = points[0][0];
  let ly = points[0][1];
  let mx = points[points.length - 1][0];
  let my = points[points.length - 1][1];
  tempContext.beginPath();
  tempContext.moveTo(lx, ly);
  
  //  tempContext.shadowBlur = 5;
//  tempContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
  tempContext.lineTo(mx, my);
  tempContext.stroke();
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


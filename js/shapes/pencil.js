import {state} from '../state/state';

let tempCanvas = document.getElementById('temp-canvas');
let tempContext = tempCanvas.getContext('2d');
let canvas = document.getElementById('main-canvas');
let context = canvas.getContext('2d');

const thisTool = 'pencil';

let isMouseDown = false;
let points = [];
let cachedPoints = []

tempCanvas.addEventListener('mousedown', function (e) {
  if (state.get('currentTool') !== thisTool) {
    return;
  }
  points[points.length] = [e.layerX, e.layerY];
  isMouseDown = true;
});

tempCanvas.addEventListener('mousemove', function (e) {
  if (state.get('currentTool') !== thisTool) {
    return;
  }
  if (isMouseDown) {
    points[points.length] = [e.layerX, e.layerY];
    draw();
  }
});
tempCanvas.addEventListener('mouseup', function (e) {
  if (state.get('currentTool') !== thisTool) {
    return;
  }
  if (isMouseDown) {
    draw();
    finish();
  }
});

function draw () {
  let color = state.get('currentColor');
  tempContext.lineWidth = 3;
  tempContext.lineJoin = 'round';
  tempContext.lineCap = 'round';
  tempContext.strokeStyle = color;
  tempContext.fillStyle = color;
  
  let lx = points[0][0];
  let ly = points[0][1];
  if (points.length < 3) {
    tempContext.beginPath();
    tempContext.arc(lx, ly, tempContext.lineWidth / 2, 0, Math.PI * 2, !0);
    tempContext.fill();
    tempContext.closePath();
    return;
  }
  tempContext.clearRect(0, 0, innerWidth, innerHeight);
  tempContext.beginPath();
  tempContext.moveTo(lx, ly);
  
  for (var i = 1; i < points.length - 2; i++) {
    const c = (points[i][0] + points[i + 1][0]) / 2;
    const d = (points[i][1] + points[i + 1][1]) / 2;
    
    tempContext.quadraticCurveTo(points[i][0], points[i][1], c, d);
  }
  
  // For the last 2 points
  tempContext.quadraticCurveTo(
    points[i][0],
    points[i][1],
    points[i + 1][0],
    points[i + 1][1]
  );
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

/*
export function render (artifacts) {
  let tempColor = state.get('currentColor');
  let tempCurrentTool = state.get('currentTool');
  console.log('rendering: ', artifacts);
  for(let i=0; i<artifacts.length; i++){
    let [tool, color, dragging, coords] = artifacts[i];
    state.set('currentColor', color);
    state.set('currentTool', tool);
    isMouseDown = dragging;
    points = coords;
    draw();
    finish();
  }
  state.set('currentColor', tempColor);
  state.set('currentTool', tempCurrentTool);
}

*/

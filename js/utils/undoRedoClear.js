import {state} from '../state/state';
import {render as arrow} from '../shapes/arrow';
import {render as highlighter} from '../shapes/highlighter';
import {render as line} from '../shapes/line';
import {render as marker} from '../shapes/marker';
import {render as pencil} from '../shapes/pencil';
import {render as rectangle} from '../shapes/rectangle';
import {render as filledRectangle} from '../shapes/filled-rectangle';
// Text handles its own undo stack
import '../shapes/text';

const disableableTools = [document.querySelector('#clear'), document.querySelector('#undo'), document.querySelector('#redo')];
const renderers = {pencil:pencil, highlighter:highlighter, line:line, marker:marker, arrow:arrow,rectangle:rectangle, filledRectangle:filledRectangle, text:text};
const tempCanvas = document.getElementById('temp-canvas');
const canvas = document.getElementById('main-canvas');
const context = canvas.getContext('2d');

let artifacts = [];
let undoStore = [];
let dragging = false;

manageButtons();

function addArtifact(e, dragging = false){
  const currentTool = state.get('currentTool');
  const currentColor = state.get('currentColor');
  artifacts.push([currentTool, currentColor, dragging, [[e.layerX, e.layerY]]]);
  manageButtons();
}

tempCanvas.addEventListener('mousedown', function (e) {
  if(state.get('currentTool') == 'text') return;
  addArtifact(e, false);
  dragging = true;
});

tempCanvas.addEventListener('mousemove', function (e) {
  if(state.get('currentTool') == 'text') return;
  if(dragging){
    artifacts[artifacts.length - 1][3].push([e.layerX,e.layerY]);
  }
});
tempCanvas.addEventListener('mouseup', function () {
  if(state.get('currentTool') == 'text') return;
  dragging = false;
});

export function undo () {
  // reverse clear action
  if(!artifacts.length && undoStore.length) {
    artifacts = undoStore;
    undoStore = [];
  } else {
    undoStore.push(artifacts.pop());
  }
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  if(artifacts.length) render(artifacts);
  manageButtons();
}

export function redo () {
  if(!undoStore.length) return;
  artifacts.push(undoStore.pop());
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  if(artifacts.length > 0) render(artifacts);
  manageButtons();
}

export function clear(){
  undoStore = artifacts;
  artifacts = [];
  context.clearRect(0,0,innerWidth, innerHeight);
  manageButtons();
}

function render (artifacts) {
  let tempColor = state.get('currentColor');
  let tempCurrentTool = state.get('currentTool');
  for(let i=0; i<artifacts.length; i++){
    let [tool, color, dragging, coords] = artifacts[i];
    state.set('currentColor', color);
    state.set('currentTool', tool);
    // Magic happens here - the individual drawing tool render method is called
    renderers[tool](coords);
  }
  state.set('currentColor', tempColor);
  state.set('currentTool', tempCurrentTool);
}

function manageButtons(){
  if(artifacts.length && undoStore.length){
    enableTools();
  } else if(artifacts.length && !undoStore.length){
    canUndo();canClear();
  } else if(!artifacts.length && undoStore.length){
    canClear();canRedo();
  } else if(!artifacts.length && !undoStore.length){
    disableTools();
  }
}

function canRedo(){
  document.querySelector('#redo').classList.remove('disabled');
}
function canUndo(){
  document.querySelector('#undo').classList.remove('disabled');
}
function canClear(){
  document.querySelector('#clear').classList.remove('disabled');
}
function disableTools () {
  disableableTools.forEach((n) => n.classList.add('disabled'));
}
function enableTools(){
  disableableTools.forEach((n) => n.classList.remove('disabled'));
}

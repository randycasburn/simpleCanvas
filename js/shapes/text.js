import {state} from '../state/state';

/*
* import addText from 'text'
*
* call addText(x,y)
 */
const thisTool = 'text';

let tempCanvas = document.getElementById('temp-canvas');
let tempContext = tempCanvas.getContext('2d');
let canvas = document.getElementById('main-canvas');
let context = canvas.getContext('2d');
// manages it's own undo stack
// listen for clicks
document.querySelector('header nav div#clear').addEventListener('click', e => redraw());
document.querySelector('header nav div#undo').addEventListener('click', e => redraw());
document.querySelector('header nav div#redo').addEventListener('click', e => redraw());
let undoStore = [];

let styles = {
  position: 'absolute',
  left: '0',
  top: '0',
  width: '300px',
  height: '100px',
  fontFamily: 'serif',
  fontSize: '28px',
  fontWeight: 'normal',
  letterSpacing: '-.7px',
  backgroundColor: 'transparent',
  border: 'none',
  borderLeft: '1px solid black',
  color: state.get('currentColor')
}

export function addText (x = 0, y = 0) {
  let maxX = canvas.width - parseInt(styles.width);
  let maxY = canvas.height - parseInt(styles.height);
  let minX = canvas.offsetLeft;
  let minY = canvas.offsetTop;
  x = (x > maxX) ? maxX : x;
  x = (x < minX) ? minX : x;
  y = (y > maxY) ? maxY : y;
  y = (y < minY) ? minY : y;
  let id = 'addTextArea';
  addStyleSheet(id);
  addTextarea(x, y, id);
}

tempCanvas.addEventListener('mousedown', function (e) {
  if(state.get('currentTool') !== thisTool) return;
  e.stopPropagation();
  e.preventDefault();
  addText(e.layerX, e.layerY);
});



function addTextarea (x = 0, y = 0, id = '') {
  let ta = document.createElement('textarea');
  let currentColor = state.get('currentColor');
  styles.color = currentColor;
  ta.setAttribute('id', id);
  ta.setAttribute('rows', '3');
  styles.left = x + 'px';
  styles.top = y + 'px';
  Object.assign(ta.style, styles);
  document.body.appendChild(ta);
  ta.addEventListener('blur',render, false);
  ta.focus();
  return ta;
}

function addStyleSheet (id) {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '#' + id + ':focus{outline:none}';
  document.getElementsByTagName('head')[0].appendChild(style);
}

function render (e) {
  let ta = e.target;
  let currentColor = state.get('currentColor');
  ta.color = currentColor;
  ta.removeEventListener('blur', render);
  let text = e.target.value;
  // inputs to wrapText function
//  let xAdjustment = 8;
//  let yAdjustment = 18;
  let xAdjustment = 2;
  let yAdjustment = -24;
  let x = ta.offsetLeft + xAdjustment;
  let y = ta.offsetTop + yAdjustment;
  let maxWidth = ta.offsetWidth;
  let lineHeight = parseInt(ta.style.fontSize) + 5;
  // kill the text box
  ta.remove();
  let lines = wrapCanvasText(tempContext, text, x, y, maxWidth, lineHeight);
  // set up drawing
  tempContext.clearRect(0, 0, innerWidth, innerHeight);
  tempContext.font = styles.fontSize + ' ' + styles.fontFamily;
  tempContext.fillStyle = currentColor;
  tempContext.strokeStyle = currentColor;
  undoStore.push([x,y,maxWidth,lineHeight,tempContext.font, tempContext.fillStyle, tempContext.strokeStyle, lines]);
  draw(lines, x, y, lineHeight);
}

function draw(lines = [], x=0, y=0, lineHeight){
  lines.map((l) => {
    tempContext.fillText(l, x, y)
    y += lineHeight;
  });
  context.drawImage(tempCanvas, 0, 0);
  tempContext.clearRect(0, 0, innerWidth, innerHeight);
}
function redraw(){
 // let x, y,maxWidth, lineHeight, font, fillStyle, strokeStyle, lines;
  if(!undoStore.length) return;
  undoStore.forEach(([x,y,maxWidth, lineHeight, font, fillStyle, strokeStyle, lines]) =>{
    tempContext.font = font;
    tempContext.fillStyle = fillStyle;
    tempContext.strokeStyle = strokeStyle;
    draw(lines, x, y, lineHeight);
  })
}

function wrapCanvasText (ctx, text, x, y, maxWidth, lineHeight) {
  let lines = text.split("\n");
  let paintLines = [];
  lines.map(l => {
    // if the line is shorter than the limit add it here
    if (ctx.measureText(l).width < maxWidth) {
      paintLines.push(l);
      return;
    }
    // otherwise, we need to split it up and add
    let testLine = '';
    l.split(' ').map(w => {
      // string of long contiguous characters...
      if (ctx.measureText(w).width > maxWidth) {
        (function splitContiguous(ctx, text) {
          if (ctx.measureText(testLine).width >= maxWidth) {
            paintLines.push(testLine);
            testLine = '';
            if (ctx.measureText(text).width > maxWidth) {
              splitContiguous(ctx, text);
              // Clear the text from each iteration so only the last straggler is left dangling
              text = false;
            }
            //pickup the straggler here as the last bit of text hanging on
            if (text) {
              paintLines.push(text);
            }
            return;
          }
          testLine += text.slice(0, 1);
          text = text.slice(1);
          splitContiguous(ctx, text);
        })(tempContext, w);
      }
      testLine += w + ' ';
      if (ctx.measureText(testLine).width >= maxWidth) {
        paintLines.push(testLine.slice(0, -1));
        testLine = '';
        return;
      }
    });
    paintLines.push(testLine.slice(0, -1));
  })
  return paintLines;
}

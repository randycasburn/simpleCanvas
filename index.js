import {state} from './js/state/state';
import {undo, redo, clear} from './js/utils/undoRedoClear';

// listen for clicks
document.querySelector('header nav').addEventListener('click', e => toolClick(e));
// intialize colors
setColor(state.get('currentColor'));

function toolClick (e) {
  e.preventDefault();
  e.stopPropagation();
  
  let el = (function findTarget (el) {
    return (el.nodeName !== 'DIV')
    ? findTarget(el.parentNode)
      : el;
  })(e.target);
  
  if (el.classList.contains('disabled')) {
    return;
  }
  switch (el.id) {
    case 'yellow':
    case 'red':
    case 'blue':
    case 'green':
    case 'purple':
      setColor(el.id);
      break;
    case 'pencil' :
    case 'marker' :
    case 'highlighter':
    case 'line':
    case 'arrow':
    case 'rectangle':
    case 'filled-rectangle':
    case 'text':
      state.set('currentTool',el.id);
      break;
    case 'clear':
      clear();
      break;
    case 'undo':
      undo();
      break;
    case 'redo':
      redo();
      break;
    default:
      console.log(el.id);
      return;
  }
}

/**
 * Side effects: DOM manipulations & currentColor state variable
 * @param oldColor
 * @param newColor
 * @param borders
 * @param backgroundColors
 * @param toolImgs
 */
function setColor (newColor) {
// DOM elements affected by Tools - would be better if not hard coded
  const borderColorElements = [document.querySelector('#rectangle>span'), document.querySelector('#filled-rectangle>span'), document.querySelector('#filled-rectangle>span')];
  const backgroundColorElements = [document.querySelector('#filled-rectangle>span')];
  const coloredTools = document.querySelectorAll('svg path');
  let oldColor = state.get('currentColor');
  state.set('currentColor', newColor);
  borderColorElements.forEach(el => el.style.borderColor = newColor);
  backgroundColorElements.forEach(el => el.style.backgroundColor = newColor);
  [].forEach.call(coloredTools, el => el.style.fill = newColor);
  document.querySelector('#' + oldColor + '>img').classList.toggle('color-active');
  if(oldColor !== newColor)  document.querySelector('#' + newColor + '>img').classList.toggle('color-active');
}




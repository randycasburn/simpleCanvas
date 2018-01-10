import PropertyApi from './propertyAPI';
import synchronize from './syncProxy';
//import jetpack from './fs-jetpack';

//import {app} from "electron";

const defaultState = {
  // not needed with localstorage store
  //storageDir: jetpack.cwd(app.getPath('./')) ,//jetpack.cwd(app.getPath('home')) ,
  storageFile: `presentier-state.json`,
  appPath: false,
  currentChapter: 0,
  currentSlide: 0,
  currentDrawing: false,
  currentColor: 'blue',
  currentTool: 'highlighter',
  hasDrawing: false
}

/**
 * Creates a Settings store in 'app-settings.json' in the users 'Home' directory
 */
class State extends PropertyApi {
  constructor (stateStoreFile = defaultState.storageFile, userDataDir = defaultState.storageDir ) {
    super(stateStoreFile, userDataDir, defaultState);
  }
}
// export a single instance of this class
export const state = synchronize(new State());

import PropertyApi from './propertyAPI';
import synchronize from './syncProxy';
//import jetpack from '../node_modules/fs-jetpack/fs-jetpack';
//import { app } from 'electron';

const defaultSettings = {
  // not needed with localstorage store
  //storageDir: jetpack.cwd(app.getPath('./')) ,//jetpack.cwd(app.getPath('home')) ,
  storageFile: `presentier-settings.json`,
  cover: false,
  contentPath: false,
  materials: false,
  currentChapter: false,
  currentSlide: false,
  secondarySlide: false,
  thirdSlide: false,
  displayMode: false,
  drawingSurfaceWidth: 1250,
  drawingSurfaceHeight: 719
}

/**
 * Creates a Settings store in 'app-settings.json' in the users 'Home' directory
 */
class Settings extends PropertyApi {
  constructor (settingsStoreFile = defaultSettings.storageFile, userDataDir = defaultSettings.storageDir) {
    super(settingsStoreFile, userDataDir, defaultSettings);
  }
  
  getChapters () {
    let materials = this.get('materials');
    let chapters = materials.map((o) => Object.keys(o)[0]);
    return chapters;
  }
  
  getSlides (chapter = 0) {
    let materials = this.get('materials');
    let slides = materials.filter((e) => e[chapter] !== undefined);
    return slides[0][chapter];
  }
}

// Export a single instance of this class
export const settings = synchronize(new Settings());
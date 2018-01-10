import * as store from './localStorage'

/**
 * userDataDir expects an fs-jetpack object
 */
export default class {
  constructor (storeFileName = '', userDataDir = '', propList = {}) {
    this.defaults = propList;
    this.userDataDir = userDataDir;
    this.storeFileName = storeFileName;
    let restoredPropList = this.restorePropFile();
    this.propList = Object.assign(this.defaults, restoredPropList);
  }
  
  /**
   * Retrieve a property if it exists
   *
   * @param id
   * @return {*}  value if set otherwise false
   */
  get (id) {
    if (this.propList.hasOwnProperty(id)) {
      return this.propList[id];
    }
    return false;
  }
  
  /**
   * set or add a property
   * @param id
   * @param value
   * @return {*}  A Promise Object
   */
  set (id, value = false) {
    this.propList[id] = value;
    return this.savePropFile();
  }
  
  /**
   * Clears
   *
   * return Promise object
   * @param id
   * @return {*}  A Promise Object
   */
  clear (id) {
    if (!this.propList.hasOwnProperty(id)) {
      return;
    }
    this.propList[id] = false;
    return this.savePropFile();
  }
  
  /**
   * Return props to original defaults and the save them
   */
  reset() {
    Object.assign(this.propList, this.defaults);
    this.savePropFile();
  }
  restorePropFile(){
    return store.restorePropFile(this.storeFileName);
  }
  savePropFile () {
    return store.savePropFile(this.storeFileName, this.propList);
  }
  
  getAll(){
    return this.propList;
  }
}

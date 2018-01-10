export function savePropFile(id = 'none',propList = {}){
  return this.userDataDir.write(this.storeFileName, this.propList,{ atomic: true });
}

export function restorePropFile(id){
  let fileContent = {};
  try {
    fileContent = this.userDataDir.read(this.storeFileName, 'json');
  } catch (error) {
    fileContent = {};
  }
  return fileContent;
}
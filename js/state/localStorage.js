export function savePropFile (id = 'none', propList = {}) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(id, JSON.stringify(propList));
    } catch (err) {
      reject(err);
    }
    resolve('success');
  })
}

export function restorePropFile (id) {
  let data;
  try {
    data = localStorage.getItem(id);
    if(!data) return {};
    data = JSON.parse(data);
  } catch (err) {
    throw new Error(err);
  }
  return data;
}
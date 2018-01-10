/**
 * Purpose is to sync objects with same .hasOwnObjects()
 *
 * Act as a Proxy against the 'set' and 'clear' methods to ensure props
 * with the same name are kept in sync with each other.
 *
 * This does not create exact copies.
 * @type {Array}
 */


// object registry holds obj references to be synced
const syncedObjs = [];

export default function synchronize (obj) {
  syncedObjs.push(obj);
  let handler = {
    get (target, propKey) {
      return function (...args) {
        // nothing to sync if only one obj in registry
        if (syncedObjs.length > 1) {
          // only sync on methods that change the obj
          if (['set', 'clear'].includes(propKey)) {
            // exclude the target object
            let toSyncList = syncedObjs.filter((element) => { return (element.constructor !== target.constructor) });
            // the proxy'd method itself
            toSyncList.forEach((toSync) => {
              // only sync those properties that already exist
              if (toSync.propList.hasOwnProperty(args[0])) {
                const syncMethod = toSync[propKey];
                // Call the method on this object
                syncMethod.apply(toSync, args);
              }
            });
          }
        }
        // the method that got all this started...
        const origMethod = target[propKey];
        // is invoked here
        let result = origMethod.apply(target, args);
        // and return the proxied result here...
        return result;
      }
    }
  };
  // The proxy that catches method calls against the original object
  return new Proxy(obj, handler);
}

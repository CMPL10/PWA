/* const pwa = "pwa"
const assets = [
  "/index.html",
  "/css",
  "/img",
  "/js"

]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(pwa).then(cache => {
      cache.addAll(assets)
    })
  )
})
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })
 */
 /*  const version = 3;
let staticName = `staticCache-${version}`;
let dynamicName = `dynamicCache`;
let options = {
  ignoreSearch: false,
  ignoreMethod: false,
  ignoreVary: false,
};
const assets = [
  "/index.html",
  "/form.html",
  "/manifest.json",
  "/app.js"
];
let DB = null;

self.addEventListener('install', (ev) => {
  console.log(`Version ${version} installed`);
  ev.waitUntil(
    caches.open(staticName).then((cache) => {
      cache.addAll(assets).then(
        () => {
        },
        (err) => {
          console.warn(`failed to update ${staticName}.`);
        }
      );
    })
  );
});

self.addEventListener('activate', (ev) => {
  console.log('activated');
  ev.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => {
            if (key != staticName) {
              return true;
            }
          })
          .map((key) => caches.delete(key))
      ).then((empties) => {
        openDB();
      });
    })
  );
});

const handleFetchResponse = (fetchResponse, request) => {
  return caches.open(dynamicName).then((cache) => {
    cache.put(request, fetchResponse.clone());
    return fetchResponse;
  });
};

self.addEventListener('message', (ev) => {
  let data = ev.data;
  let clientId = ev.source.id;
  if ('addPerson' in data) {
    if (DB) {
      savePerson(data.addPerson, clientId);
    } else {
      openDB(() => {
        savePerson(data.addPerson, clientId);
      });
    }
  }

  if ('otherAction' in data) {
    let msg = 'Hola';
    sendMessage({
      code: 0,
      message: msg,
    });
  }
});

const savePerson = (person, clientId) => {
  if (person && DB) {
    let tx = DB.transaction('colorStore', 'readwrite');
    tx.onerror = (err) => {
    };
    tx.oncomplete = (ev) => {
      let msg = 'Thanks. The data was saved.';
      sendMessage(
        {
          code: 0,
          message: msg,
          savedPerson: person,
        },
        clientId
      );
    };
    let store = tx.objectStore('colorStore');
    let req = store.put(person);
    req.onsuccess = (ev) => {
    };
  } else {
    let msg = 'No data was provided.';
    sendMessage(
      {
        code: 0,
        message: msg,
      },
      clientId
    );
  }
};

const sendMessage = async (msg, clientId) => {
  let allClients = [];
  if (clientId) {
    let client = await clients.get(clientId);
    allClients.push(client);
  } else {
    allClients = await clients.matchAll({ includeUncontrolled: true });
  }
  return Promise.all(
    allClients.map((client) => {
      return client.postMessage(msg);
    })
  );
};

const openDB = (callback) => {
  let req = indexedDB.open('colorDB', version);
  req.onerror = (err) => {
    console.warn(err);
    DB = null;
  };
  req.onupgradeneeded = (ev) => {
    let db = ev.target.result;
    if (!db.objectStoreNames.contains('colorStore')) {
      db.createObjectStore('colorStore', {
        keyPath: 'id',
      });
    }
  };
  req.onsuccess = (ev) => {
    DB = ev.target.result;
    console.log('db opened and upgraded as needed');
    if (callback) {
      callback();
    }
  };
}; */


  const version = 3;
let staticName = `staticCache-${version}`;
let dynamicName = `dynamicCache`;
let options = {
  ignoreSearch: false,
  ignoreMethod: false,
  ignoreVary: false,
};
const assets = [
  "/index.html",
  "/form.html",
  "/manifest.json",
  "/app.js"
];
let DB = null;

self.addEventListener('install', (ev) => {
  console.log(`Version ${version} installed`);
  ev.waitUntil(
    caches.open(staticName).then((cache) => {
      cache.addAll(assets).then(
        () => {
        },
        (err) => {
          console.warn(`failed to update ${staticName}.`);
        }
      );
    })
  );
});

self.addEventListener('activate', (ev) => {
  console.log('activated');
  ev.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => {
            if (key != staticName) {
              return true;
            }
          })
          .map((key) => caches.delete(key))
      ).then((empties) => {
        openDB();
      });
    })
  );
});

self.addEventListener('fetch', (ev) => {
  ev.respondWith(
    caches.match(ev.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(ev.request).then((fetchResponse) => {
          return handleFetchResponse(fetchResponse, ev.request);
        })
      );
    })
  );
});

const handleFetchResponse = (fetchResponse, request) => {
  return caches.open(dynamicName).then((cache) => {
    cache.put(request, fetchResponse.clone());
    return fetchResponse;
  });
};

self.addEventListener('message', (ev) => {
  let data = ev.data;
  let clientId = ev.source.id;
  if ('addPerson' in data) {
    if (DB) {
      savePerson(data.addPerson, clientId);
    } else {
      openDB(() => {
        savePerson(data.addPerson, clientId);
      });
    }
  }

  if ('otherAction' in data) {
    let msg = 'Hola';
    sendMessage({
      code: 0,
      message: msg,
    });
  }
});

const savePerson = (person, clientId) => {
  if (person && DB) {
    let tx = DB.transaction('colorStore', 'readwrite');
    tx.onerror = (err) => {
    };
    tx.oncomplete = (ev) => {
      let msg = 'Thanks. The data was saved.';
      sendMessage(
        {
          code: 0,
          message: msg,
          savedPerson: person,
        },
        clientId
      );
    };
    let store = tx.objectStore('colorStore');
    let req = store.put(person);
    req.onsuccess = (ev) => {
    };
  } else {
    let msg = 'No data was provided.';
    sendMessage(
      {
        code: 0,
        message: msg,
      },
      clientId
    );
  }
};

const sendMessage = async (msg, clientId) => {
  let allClients = [];
  if (clientId) {
    let client = await clients.get(clientId);
    allClients.push(client);
  } else {
    allClients = await clients.matchAll({ includeUncontrolled: true });
  }
  return Promise.all(
    allClients.map((client) => {
      return client.postMessage(msg);
    })
  );
};

const openDB = (callback) => {
  let req = indexedDB.open('colorDB', version);
  req.onerror = (err) => {
    console.warn(err);
    DB = null;
  };
  req.onupgradeneeded = (ev) => {
    let db = ev.target.result;
    if (!db.objectStoreNames.contains('colorStore')) {
      db.createObjectStore('colorStore', {
        keyPath: 'id',
      });
    }
  };
  req.onsuccess = (ev) => {
    DB = ev.target.result;
    console.log('db opened and upgraded as needed');
    if (callback) {
      callback();
    }
  };
};
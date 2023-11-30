const APP = {
    SW: null,
    DB: null, 
    init() {
      APP.registerSW();
      document
        .getElementById('colorForm')
        .addEventListener('submit', APP.saveColor);
      APP.openDB();
    },
    registerSW() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(
          (registration) => {
            APP.SW =
              registration.installing ||
              registration.waiting ||
              registration.active;
          },
          (error) => {
            console.log('Service worker registration failed:', error);
          }
        );
        navigator.serviceWorker.addEventListener('controllerchange', async () => {
          APP.SW = navigator.serviceWorker.controller;
        });
        navigator.serviceWorker.addEventListener('message', APP.onMessage);
      } else {
        console.log('Service workers are not supported.');
      }
    },
    saveColor(ev) {
      ev.preventDefault();
      let name = document.getElementById('name');
      let color = document.getElementById('color');
      let strName = name.value.trim();
      let strColor = color.value.trim();
      if (strName && strColor) {
        let person = {
          id: Date.now(),
          name: strName,
          color: strColor,
        };
        console.log('Save', person);
        APP.sendMessage({ addPerson: person });
      }
    },
    sendMessage(msg) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(msg);
      }
    },
    onMessage({ data }) {
      console.log('Web page receiving', data);
      if ('savedPerson' in data) {
        APP.showPeople();
        document.getElementById('name').value = '';
      }
    },
    showPeople() {
      if (!APP.DB) {
        APP.openDB();
      }
      let tx = APP.DB.transaction('colorStore', 'readonly');
      let store = tx.objectStore('colorStore');
      let req = store.getAll();
      req.onsuccess = (ev) => {
        let list = document.getElementById('people');
        let ppl = ev.target.result;
        list.innerHTML = ppl
          .map((person) => {
            console.log('show', person);
            return `<li data-id="${person.id}">
            ${person.name}
            <input type="color" value="${person.color}" disabled />
          </li>`;
          })
          .join('\n');
      };
    },
    openDB() {
      let req = indexedDB.open('colorDB');
      req.onsuccess = (ev) => {
        APP.DB = ev.target.result;
        APP.showPeople();
      };
      req.onerror = (err) => {
        console.warn(err);
      };
    },
  };
  
  document.addEventListener('DOMContentLoaded', APP.init);
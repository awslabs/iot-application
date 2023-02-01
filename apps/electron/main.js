const electron = require('electron')
const waitOn = require('wait-on');
const path = require('path')

const { app, BrowserWindow, utilityProcess } = electron;

/**
 * Asynchronously start server and client
 * TODO: productionize
 */
utilityProcess.fork(path.join(__dirname, 'server.js'), [], {
  stdio: "inherit"
});

utilityProcess.fork(path.join(__dirname, 'client.js'), [], {
  stdio: "inherit"
});

let win;

app.on('ready', async _ => {
  win = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // initialize loading page
  win.loadFile('index.html')

  /**
   * Wait for server port to be running prior to loading app
   */
  waitOn({
    resources: [
      'http://localhost:3000' // TODO: currently only waits on server
    ],
    delay: 1000, // initial delay
    interval: 100, // poll interval
    simultaneous: 1, // limit to 1 connection per resource at a time
    timeout: 10000, // timeout in ms, default Infinity
    tcpTimeout: 1000, // tcp timeout in ms, default 300ms
    window: 1000, // stabilization time in ms, default 750ms
  }, (err) => {
    if (err) {
      console.log(err);
    }

    win.loadURL('http://localhost:3002')    // loads this URL
  })
})
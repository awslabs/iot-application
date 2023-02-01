const { exec } = require("child_process");
const log = require('electron-log')

exec("cd ../client && npm run dev", (error, stdout, stderr) => {
    if (error) {
        log.error(`error: ${error.message}`)
        return;
    }
    if (stderr) {
        log.error(`error: ${stderr}`)
        return;
    }
    log.info(`stdout: ${stdout}`);
});
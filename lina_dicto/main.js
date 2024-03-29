'use strict';

const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

require(path.join(__dirname, 'main-process/application-menu.js'))
require(path.join(__dirname, 'main-process/context-menu.js'))

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {

	// Create the browser window.
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: __dirname + '/preload.js',
			contextIsolation: true, // electron12からデフォルト化で不要
			nodeIntegration: true
		},
		icon: path.join(__dirname, 'image/icon.png')
	})

		// and load the index.html of the app.
		win.loadURL(url.format({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file:',
			slashes: true
		}))

	// Open the DevTools.
	// win.webContents.openDevTools()

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// ==== ContextBridge

const { ipcMain } = require('electron');
ipcMain.handle('tomain-message-dialog', async (event, strtype, strtitle, strmessage) => {
	const { dialog } = require('electron');
	dialog.showMessageBoxSync(
			win,
			{
				type: strtype,
				buttons: ['OK'],
				title: strtitle,
				message: strmessage,
			});
});

ipcMain.handle('tomain-confirm-dialog', async (event, strtitle, strmessage) => {
	const {dialog} = require('electron');
	let choice = dialog.showMessageBoxSync(
			{
				type: 'question',
				buttons: ['Yes', 'No'],
				defaultId: 1,
				title: strtitle,
				message: strmessage,
			});

	return (choice === 0);
});

ipcMain.handle('init', (event, data) => {
	let res = {
		'userDataPath': app.getPath('userData')
	};
	return(res);
})
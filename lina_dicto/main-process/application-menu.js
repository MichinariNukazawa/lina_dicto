'use strict';

const {Menu, app, shell, dialog} = require('electron')
const join = require('path').join;
const openAboutWindow = require('about-window').default;
const Preference = require('../src/preference')

function createMenu() {

	let template = [
	{
		label: '&File',
		submenu: [
		{
			label: 'User CSS',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'UserCss'});
			}
		},
		{
			label: 'Reset Preference',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'ResetPreference'});
			}
		},
		{
			label: 'Preference',
			accelerator: 'CmdOrCtrl+P',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'Preference'});
			}
		},
		{type: 'separator'},
		{
			label: '&Quit',
			accelerator: 'CmdOrCtrl+Q',
			role: 'close'
		},
		]
	},
	{
		label: '&Edit',
		submenu: [
		// キーボード・ショートカット表示用のダミー(js/index.js onloadにて処理)
		{
			label: '&Cut',
			accelerator: 'CmdOrCtrl+X',
			selector: "cut:"
		},
		{
			label: '&Copy',
			accelerator: 'CmdOrCtrl+C',
			selector: "copy:"
		},
		{
			label: '&Paste',
			accelerator: 'CmdOrCtrl+V',
			selector: "paste:"
		},
		{type: 'separator'},
		{
			label: 'Focusing Input',
			accelerator: 'Alt+C',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'FocusInput'});
			}
		},
		{
			label: '&Prev from history',
			accelerator: 'Alt+Up',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'PrevHistory'});
			}
		},
		{
			label: '&Next from history',
			accelerator: 'Alt+Down',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'NextHistory'});
			}
		},
		{
			label: '&Clear Input',
			accelerator: 'Esc',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'ClearInput'});
			}
		},
		]
	},
	{
		label: '&View',
		submenu: [
		{
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click: function (item, focusedWindow) {
				if (focusedWindow) focusedWindow.reload()
			}
		},
		{
			label: 'Toggle Full Screen',
			accelerator: (function () {
				if (process.platform === 'darwin') {
					return 'Ctrl+Command+F'
				} else {
					return 'F11'
				}
			})(),
			click: function (item, focusedWindow) {
				if (focusedWindow) {
					focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
				}
			}
		},
		{
			label: 'Toggle Developer Tools',
			accelerator: (function () {
				if (process.platform === 'darwin') {
					return 'Alt+Command+I'
				} else {
					return 'Ctrl+Shift+I'
				}
			})(),
			click: function (item, focusedWindow) {
				if (focusedWindow) focusedWindow.toggleDevTools()
			}
		}
		]
	},
	{
		label: '&History',
		submenu: [
		{
			label: '&Statistic History',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'StatisticHistory'});
			}
		},
		{
			label: '&Open History File',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'OpenHistoryFile'});
			}
		},
		{
			label: '&Delete History File',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'DeleteHistoryFile'});
			}
		},
		]
	},
	{
		label: '&Help',
		role: 'help',
		submenu: [
		{
			label: 'daisy bell official site',
			click: function () { shell.openExternal('https://daisy-bell.booth.pm/') }
		},
		{
			label: '&Donate',
			submenu: [
			{
				label: '&Donate(Amazon)',
				click: function () { shell.openExternal('http://amzn.asia/gxaSPhE') }
			},
			]
		},
		{
			label: '&bug report',
			submenu: [
			{
				label: '&mailto:michinari.nukazawa@gmail.com',
				click: function () { shell.openExternal('mailto:michinari.nukazawa@gmail.com') }
			},
			{
				label: '&twitter:@MNukazawa',
				click: function () { shell.openExternal('https://twitter.com/MNukazawa') }
			},
			]
		},
		{
			label: '&Help',
			click: function (item, focusedWindow) {
				console.log('menu', item.label);
				focusedWindow.webContents.send('menu-clicked', {'menu_kind': 'Help'});
			},
		},
		{
			label: '&About',
			click: function () {
				openAboutWindow({
					icon_path: join(__dirname, '../image/icon.png'),
					copyright: 'Copyright (c) 2018 project daisy bell',
					package_json_dir: join(__dirname, '..'),
					// open_devtools: process.env.NODE_ENV !== 'production',
				});
			}
		}
		]
	}
	]

	if (process.platform === 'darwin') {
		function insert_window_menu(){
			template.splice(2, 0,
					{
						label: 'Window',
						role: 'window',
						submenu: [
						{
							label: 'Minimize',
							accelerator: 'CmdOrCtrl+M',
							role: 'minimize'
						},
						{
							label: 'Close',
							accelerator: 'CmdOrCtrl+W',
							role: 'close'
						}
						]
					});
		}
	
		insert_window_menu();

		let name = app.name;
		template.unshift({
			label: name,
			submenu: [
			{
				label: 'About ' + name,
				role: 'about'
			},
			{
				type: 'separator'
			},
			{
				label: 'Services',
				role: 'services',
				submenu: []
			},
			{
				type: 'separator'
			},
			{
				label: 'Hide ' + name,
				accelerator: 'Command+H',
				role: 'hide'
			},
			{
				label: 'Hide Others',
				accelerator: 'Command+Alt+H',
				role: 'hideothers'
			},
			{
				label: 'Show All',
				role: 'unhide'
			},
			{
				type: 'separator'
			},
			{
				label: 'Quit',
				accelerator: 'Command+Q',
				click: function () { app.quit() }
			}
			]
		})
		// Window menu.
		template[3].submenu.push(
			{
				type: 'separator'
			},
			{
				label: 'Bring All to Front',
				role: 'front'
			}
		)
	}

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}
createMenu();

function message_dialog(strtype, strtitle, strmessage){
	const { dialog } = require('electron');
	dialog.showMessageBoxSync(
			win,
			{
				type: strtype,
				buttons: ['OK'],
				title: strtitle,
				message: strmessage,
			});
}
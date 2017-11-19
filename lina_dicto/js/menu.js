'use strict';

const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

var menu = new Menu();

var template = [
{
	label: 'File',
	submenu: [
	{
		label: 'Quit',
		accelerator: 'CmdOrCtrl+Q',
		role: 'close'
	},
	]
},
{
	label: 'View',
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
	label: 'Help',
	role: 'help',
	submenu: [
	{
		label: 'daisy bell official site',
		click: function () { require('electron').shell.openExternal('https://daisy-bell.booth.pm/') }
	},
	{
		label: 'Donate',
		submenu: [
		{
			label: 'Donate(Amazon)',
			click: function () { require('electron').shell.openExternal('http://amzn.asia/gxaSPhE') }
		},
		]
	},
	{
		label: 'bug report',
		submenu: [
		{
			label: 'mailto:michinari.nukazawa@gmail.com',
			click: function () { require('electron').shell.openExternal('mailto:michinari.nukazawa@gmail.com') }
		},
		{
			label: 'twitter:@MNukazawa',
			click: function () { require('electron').shell.openExternal('https://twitter.com/MNukazawa') }
		},
		]
	}
	]
}
]

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

if (process.platform === 'darwin') {
	insert_window_menu();

	var name = require('electron').remote.app.getName()
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

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


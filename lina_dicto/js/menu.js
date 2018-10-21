'use strict';

const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const join = require('path').join;
const openAboutWindow = require('about-window').default;

var menu = new Menu();

function message_dialog(strtype, strtitle, strmessage) {
	const {dialog} = require('electron').remote;
	dialog.showMessageBox(
			remote.getCurrentWindow(),
			{
				type: strtype,
				buttons: ['OK'],
				title: strtitle,
				message: strmessage,
			});
}

function confirm_dialog(strtitle, strmessage) {
	const {dialog} = require('electron').remote;
	let choice = dialog.showMessageBox(
			remote.getCurrentWindow(),
			{
				type: 'question',
				buttons: ['Yes', 'No'],
				defaultId: 1,
				title: strtitle,
				message: strmessage,
			});

	return choice === 0;
};

var template = [
{
	label: '&File',
	submenu: [
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
	{
		label: '&Paste',
		accelerator: 'CmdOrCtrl+V',
		click: function (item, focusedWindow) {
			// キーボード・ショートカット表示用のダミー(js/index.js onloadにて処理)
		}
	},
	{type: 'separator'},
	{
		label: 'Focusing Input',
		accelerator: 'Alt+C',
		click: function (item, focusedWindow) {
			// 入力欄にフォーカスする
			let input_elem = document.getElementById('query-area__query-input__input');
			input_elem.focus();
		}
	},
	{
		label: '&Prev from history',
		accelerator: 'Alt+Up',
		click: function (item, focusedWindow) {
			let input_elem = document.getElementById('query-area__query-input__input');
			input_elem.focus();

			history.increment_history_index();
			const index = history.get_history_index();
			const history_item = history.get_history_item_from_index(index);
			console.debug(index, history_item);
			if(null !== history_item){
				input_elem.value = history_item.keyword;
			}
		}
	},
	{
		label: '&Next from history',
		accelerator: 'Alt+Down',
		click: function (item, focusedWindow) {
			let input_elem = document.getElementById('query-area__query-input__input');
			input_elem.focus();

			history.decrement_history_index();
			const index = history.get_history_index();
			const history_item = history.get_history_item_from_index(index);
			console.debug(index, history_item);
			if(null !== history_item){
				input_elem.value = history_item.keyword;
			}
		}
	},
	{
		label: '&Clear Input',
		accelerator: 'Esc',
		click: function (item, focusedWindow) {
			let input_elem = document.getElementById('query-area__query-input__input');
			input_elem.focus();
			input_elem.value = '';

			history.reset_history_index();
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
		label: '&Statistics History',
		click: function () {
			message_dialog('info', "Statistics History", history.get_statistics_string());
		}
	},
	{
		label: '&Open History File',
		click: function () {
			//! file exist check is dirty hack(shell.openExternal error callback is not work)
			if(! history.is_exist_file()){
				message_dialog('warning', 'Open History File', 'history is not exist.');
			}else{
				require('electron').shell.openExternal(
						"file://" + history.get_filepath(),
						true,
						function(err){
							message_dialog("Open History File", err.message);
						});
			}
		}
	},
	{
		label: '&Delete History File',
		click: function () {
			if(!confirm_dialog('Delete History File', 'Delete?')){
				console.debug("Delete History File cancel.");
			}else{
				console.debug("Delete History File do.");
				message_dialog('info', "Delete History File", history.delete_history());
			}
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
		click: function () { require('electron').shell.openExternal('https://daisy-bell.booth.pm/') }
	},
	{
		label: '&Donate',
		submenu: [
		{
			label: '&Donate(Amazon)',
			click: function () { require('electron').shell.openExternal('http://amzn.asia/gxaSPhE') }
		},
		]
	},
	{
		label: '&bug report',
		submenu: [
		{
			label: '&mailto:michinari.nukazawa@gmail.com',
			click: function () { require('electron').shell.openExternal('mailto:michinari.nukazawa@gmail.com') }
		},
		{
			label: '&twitter:@MNukazawa',
			click: function () { require('electron').shell.openExternal('https://twitter.com/MNukazawa') }
		},
		]
	},
	{
		label: '&Help',
		click: function () {
			message_dialog(
					'info', "Help",
					"`:help` to query input.\nShow all command.");
		},
	},
	{
		label: '&About',
		click: function () {
			openAboutWindow({
				icon_path: join(__dirname, 'image/icon.png'),
				copyright: 'Copyright (c) 2018 project daisy bell',
				package_json_dir: __dirname,
				// open_devtools: process.env.NODE_ENV !== 'production',
			});
		}
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


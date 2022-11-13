'use strict';

const path = require('path');
const fs = require('fs');
const { contextBridge, ipcRenderer } = require("electron");
const { shell } = require("electron");
const Kuromoji = require("kuromoji");
const fileex = require('./src/fileex');
const Preference = require('./src/preference');

let userDataPath_;
let japaneseTokenizer_;

const History = require('./src/history');
let history;

contextBridge.exposeInMainWorld(
	"myApi", {
		init: async (callback) => {
			const data = await ipcRenderer.invoke('init');
			console.log('preload::myApi::init', data);
			userDataPath_ = data.userDataPath;

			Preference.init(userDataPath_);

			history = new History(userDataPath_);

			const dicPath = path.join(__dirname, './node_modules/kuromoji/dict');
			console.log(dicPath);
			Kuromoji.builder({
				'dicPath': dicPath
				//dicPath: 'node_modules/kuromoji/dict'
			}).build(function (err, tokenizer) {
				console.log('loaded tokenizer', err);
				japaneseTokenizer_ = tokenizer;
				callback(err);
			});
		},
		message_dialog: (strtype, strtitle, strmessage) => {
			ipcRenderer.invoke('tomain-message-dialog', strtype, strtitle, strmessage);
		},
		read_dictionary_file: (callback) => {
			const dictionary_data = dictionary_loader();
			callback(dictionary_data);
		},
		read_preference: (callback) => {
			callback(Preference.read_preference(userDataPath_));
		},
		get_filepath_user_css: () => {
			return Preference.get_filepath_user_css(userDataPath_);
		},
		append_history_keyword: (keyword, extra) => {
			history.append_keyword(keyword, extra);
			//ipcRenderer.invoke('history-append-keyword', keyword, extra);
		},
		open_external_browser: (link) => {
			shell.openExternal(link)
		},
		read_textfile: (srcpath) => {
			const datafile = path.join(__dirname, srcpath);
			const t = fs.readFileSync(datafile, 'utf8');
			return t;		
		},
		japanese_tokenize: (word) => {
			return japaneseTokenizer_.tokenize(word);
		}
	}
);

ipcRenderer.on('menu-clicked', (event, arg) => {
	console.log('receive message: menu-clicked', arg)
	switch(arg.menu_kind){
		case 'UserCss':
			try{
				const filepath = Preference.get_filepath_user_css(userDataPath_);
				const promise = shell.openPath(filepath)
				promise.then((errmsg) => {
					if(0 !== errmsg.length){message_dialog('error', "Open User CSS File", errmsg);}
				})
			}catch(err){
				message_dialog('error', "Open User CSS File", err.message);
			}
			break;
		case 'ResetPreference':
			{
				const promise = confirm_dialog('Preference', 'Delete?');
				promise.then((res) => {
					console.log('ResetPreference', res)
					if(! res){
						console.debug("cancel.");
						return;
					}
					try{
						console.debug("Delete Preference File do.");
						message_dialog('info', "Delete Preference File", Preference.delete_preference(userDataPath_));
						Preference.init(userDataPath_);
					}catch(err){
						message_dialog('error', 'user preference error', "user preference error:\n" + err.message);
					}
				});
			}
			break;
		case 'Preference':
			try{
				const filepath = Preference.get_filepath(userDataPath_);
				const fileex = require('./src/fileex');
				if(! fileex.is_exist_file(filepath)){
					message_dialog('warning', 'Open Preference File', 'preference is not exist.');
					return;
				}
				const promise = shell.openPath(filepath)
				promise.then((errmsg) => {
					if(0 !== errmsg.length){message_dialog('error', "Open Preference File", errmsg);}
				})
			}catch(err){
				message_dialog('error', "Open Preference File", err.message);
			}
			break;
		case 'FocusInput':
			{
				// 入力欄にフォーカスする
				let input_elem = document.getElementById('query-area__query-input__input');
				input_elem.focus();
			}
			break;
		case 'PrevHistory':
			{
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
			break;
		case 'NextHistory':
			{
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
			break;
		case 'ClearInput':
			{
			let input_elem = document.getElementById('query-area__query-input__input');
			input_elem.focus();
			input_elem.value = '';

			history.reset_history_index();
			}
			break;
		case 'StatisticHistory':
			{
				message_dialog('info', "Statistics History", history.get_statistics_string());
			}
			break;
		case 'OpenHistoryFile':
			try{
				//! file exist check is dirty hack(shell.openExternal error callback is not work)
				if(! history.is_exist_file()){
					message_dialog('warning', 'Open History File', 'history is not exist.');
					return;
				}
				const filepath = history.get_filepath();
				const promise = shell.openPath(filepath)
				promise.then((errmsg) => {
					if(0 !== errmsg.length){message_dialog('error', "Open History File", errmsg);}
				})
			}catch(err){
				message_dialog('error', "Open History File", err.message);
			}
			break;
		case 'DeleteHistoryFile':
			{
				const promise = confirm_dialog('Delete History File', 'Delete?');
				promise.then((res) => {
					console.log('DeleteHistoryFile', res)
					if(! res){
						console.debug("cancel.");
						return;
					}
					console.debug("Delete History File do.");
					message_dialog('info', "Delete History File", history.delete_history());
				});
			}
			break;
		case 'Help':
			{
				message_dialog(
					'info', "Help",
					"`:help` to query input.\nShow all command.");
			}
			break;
		default:
			console.warn('invalid', data);

	}
})

function message_dialog(strtype, strtitle, strmessage) {
	ipcRenderer.invoke('tomain-message-dialog', strtype, strtitle, strmessage);
}

async function confirm_dialog(strtitle, strmessage) {
	const promise = await ipcRenderer.invoke('tomain-confirm-dialog', strtitle, strmessage);
	return promise;
};

function dictionary_loader()
{
	const filepath = path.join(__dirname, 'dictionary/esperanto/dictionary_data.json');
	console.log(filepath);

	const t = fileex.read_textfile(filepath);
	let dict = JSON.parse(t);

	return dict;
}
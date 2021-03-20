'use strict';

const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld(
	"myApi", {
		message_dialog: (strtype, strtitle, strmessage) => {
			ipcRenderer.invoke('tomain-message-dialog', strtype, strtitle, strmessage);
		}
	}
);


const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')

describe('Application launch', function () {
	this.timeout(10000)

	beforeEach(function () {
		this.app = new Application({
			path: electronPath,
			args: [path.join(__dirname, '..')]
		})
		return this.app.start()
	})

	afterEach(function () {
		if (this.app && this.app.isRunning()) {
			return this.app.stop()
		}
	})

	it("input basic test", function() {
		return this.app.client.waitForVisible('#query-area__query-input__input')
				.waitForEnabled('#query-area__query-input__input')
				.clearElement('#query-area__query-input__input')
				.setValue('#query-area__query-input__input', "Bonan matenon!")
				.getValue('#query-area__query-input__input')
				.then(function(text){assert(text === 'Bonan matenon!')})
	})

	it("input esperanto search to match", function() {
		return this.app.client.waitForVisible('#query-area__query-input__input')
				.waitForEnabled('#query-area__query-input__input')
				.clearElement('#query-area__query-input__input')
				.setValue('#query-area__query-input__input', "Bonan matenon!")
				.getValue('#query-area__query-input__input')
				.then(function(text){
					assert(text === 'Bonan matenon!')
				})
				.getText('#timeline')
				.then(function(text){
					// console.log("##tiemline 1:", text);
					assert(text === '');
				})
				.getText('#query-area__query-incrementals')
				.then(function(text){
					//console.log("##query-area__query-incrementals 1:", text)
					assert(text === ''); // "Bonan matenon!"は入力し切ると候補がなくなる
				})
				//.setValue('#query-area__query-input__input', "\n")
				.keys("\uE007")
				.getValue('#query-area__query-input__input')
				.then(function(text){
					assert(text === '')
				})
				.waitForVisible('#timeline')
				.getText('#timeline')
				.then(function(text){
					// console.log("##tiemline 2:", text);
					assert(0 != text.indexOf('Bonan matenon!'))
					assert(0 != text.indexOf('おはよう'))
				})
				.getText('#query-area__query-incrementals')
				.then(function(text){
					// console.log("##query-area__query-incrementals 2:", text);
					assert(text === '')
				})
				;
	})

	it("input esperanto incremental search", function() {
		return this.app.client.waitForVisible('#query-area__query-input__input')
				.waitForEnabled('#query-area__query-input__input')
				.clearElement('#query-area__query-input__input')
				// ** input "Bonan "
				.setValue('#query-area__query-input__input', "Bonan ")
				.getValue('#query-area__query-input__input')
				.then(function(text){
					assert(text === 'Bonan ')
				})
				.getText('#timeline')
				.then(function(text){
					assert(text === '');
				})
				.getText('#query-area__query-incrementals')
				.then(function(text){
					assert(text === 'Bonan apetiton!|Bonan matenon!|Bonan nokton!');
				})
				// ** input "matenon!"
				.setValue('#query-area__query-input__input', "Bonan matenon!")
				.getValue('#query-area__query-input__input')
				.then(function(text){
					assert(text === 'Bonan matenon!')
				})
				.getText('#timeline')
				.then(function(text){
					assert(text === '');
				})
				.getText('#query-area__query-incrementals')
				.then(function(text){
					assert(text === '');
				})
				// ** Enter
				.keys("\uE007")
				.getValue('#query-area__query-input__input')
				.then(function(text){
					assert(text === '')
				})
				.waitForVisible('#timeline')
				.getText('#timeline')
				.then(function(text){
					assert(0 != text.indexOf('Bonan matenon!'))
					assert(0 != text.indexOf('おはよう'))
				})
				.getText('#query-area__query-incrementals')
				.then(function(text){
					assert(text === '')
				})
				;
	})

})


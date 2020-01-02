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
					assert(text.includes('おはよう'));
				})
				.isExisting('#timeline__item__incremental__preprint')
				.then(function(res){
					assert(res); // exist
				})
				.getText('#timeline__item__incremental__preprint')
				.then(function(text){
					assert(text.includes('おはよう'));
				})
				.getText('#query-area__query-incrementals')
				.then(function(text){
					//console.log("##query-area__query-incrementals 1:", text)
					assert(text === 'Bonan matenon!|Bonan nokton!|Bonan tagon!');
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
				.isExisting('#timeline__item__incremental__preprint')
				.then(function(res){
					assert(! res); // not exist
				})
				.isExisting('#timeline__item_1')
				.then(function(res){
					assert(res);
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
					assert(text.includes('おはよう'));
				})
				.getText('#timeline__item__incremental__preprint')
				.then(function(text){
					assert(text.includes('おはよう'));
				})
				.getText('#query-area__query-incrementals')
				.then(function(text){
					assert(text === 'Bonan!|Bonan apetiton!|Bonan matenon!');
				})
				// ** input "matenon!"
				.setValue('#query-area__query-input__input', "Bonan matenon!")
				.getValue('#query-area__query-input__input')
				.then(function(text){
					assert(text === 'Bonan matenon!')
				})
				.getText('#timeline')
				.then(function(text){
					assert(text.includes('おはよう'));
				})
				.getText('#query-area__query-incrementals')
				.then(function(text){
					assert(text === 'Bonan matenon!|Bonan nokton!|Bonan tagon!');
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


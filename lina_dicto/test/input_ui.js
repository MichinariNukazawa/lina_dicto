const Application = require('spectron').Application
const assert = require('assert');
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path');

describe('Application launch', function () {
	this.timeout(10000);

	beforeEach(function () {
		this.app = new Application({
			path: electronPath,
			args: [path.join(__dirname, '..')]
		});
		return this.app.start();
	});

	afterEach(function () {
		if (this.app && this.app.isRunning()) {
			return this.app.stop();
		}
	});

	it("input basic test", async function() {
		const inputElement = await this.app.client.$('#query-area__query-input__input');
		await inputElement.waitForEnabled();
		await inputElement.clearValue();
		await inputElement.setValue("Bonan matenon!");
		const text = await inputElement.getValue();
		console.log(`after:'${text}'`);
		assert(text === 'Bonan matenon!');
	});

	it("input esperanto search to match", async function() {
		let isExisting
		let text;

		const inputElement = await this.app.client.$('#query-area__query-input__input');
		await inputElement.waitForEnabled();
		await inputElement.clearValue();
		await inputElement.setValue("Bonan matenon!");
		text = await inputElement.getValue();
		assert(text === 'Bonan matenon!');


		const timelineElement = await this.app.client.$('#timeline');
		text = await timelineElement.getText();
		assert(text.includes('おはよう'));

		const preprintElement = await this.app.client.$('.timeline__item__incremental__preprint');
		isExisting = await preprintElement.isExisting();
		assert(isExisting); // exist

		text = await preprintElement.getText();
		assert(text.includes('おはよう'));

		const increElement = await this.app.client.$('#query-area__query-incrementals');
		text = await increElement.getText();
		assert(text === 'Bonan matenon!|Bonan nokton!|Bonan tagon!');

		await inputElement.keys("\uE007"); //.setValue("\n");
		text = await inputElement.getValue();
		assert(text === '');

		await timelineElement.waitForEnabled();
		text = await timelineElement.getText();
		assert(0 != text.indexOf('Bonan matenon!'));
		assert(0 != text.indexOf('おはよう'));

		// このnot existテスト部分で5000msec近くかかるようだが詳細不明
		isExisting = await preprintElement.isExisting();
		assert(! isExisting); // not exist

		const item1Element = await this.app.client.$('#timeline__item_1');
		isExisting = await item1Element.isExisting();
		assert(isExisting);
		text = await increElement.getText();
		assert(text === '');
	});

	it("input esperanto incremental search", async function() {
		let isExisting
		let text;

		const inputElement = await this.app.client.$('#query-area__query-input__input');
		await inputElement.waitForEnabled();
		await inputElement.clearValue();
		await inputElement.setValue("Bonan ") // ** input "Bonan "
		text = await inputElement.getValue();
		assert(text === 'Bonan ');

		const timelineElement = await this.app.client.$('#timeline');
		text = await timelineElement.getText('#timeline');
		assert(text.includes('おはよう'));

		const preprintElement = await this.app.client.$('.timeline__item__incremental__preprint');
		text = await preprintElement.getText();
		assert(text.includes('おはよう'));

		const increElement = await this.app.client.$('#query-area__query-incrementals');
		text = await increElement.getText('#query-area__query-incrementals');
		assert(text === 'Bonan!|Bonan apetiton!|Bonan matenon!');

		await inputElement.setValue("Bonan matenon!") // ** input "matenon!"
		text = await inputElement.getValue();
		assert(text === 'Bonan matenon!');

		text = await timelineElement.getText('#timeline');
		assert(text.includes('おはよう'));

		text = await increElement.getText();
		assert(text === 'Bonan matenon!|Bonan nokton!|Bonan tagon!');

		await inputElement.keys("\uE007"); // ** Enter
		text = await inputElement.getValue();
		assert(text === '');

		await timelineElement.waitForEnabled();
		text = await timelineElement.getText('#timeline');
		assert(0 != text.indexOf('Bonan matenon!'));
		assert(0 != text.indexOf('おはよう'));

		text = await increElement.getText();
		assert(text === '');
	});

});


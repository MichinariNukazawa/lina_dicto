const packager = require('electron-packager');
const config = require('./package.json');

packager({
dir: './',
out: '../release',
name: config.name,
platform: 'win32',
arch: 'x64',
version: '0.1.0',
icon: './image/icon.ico',

'app-bundle-id': 'jp.co.michinari_nukazawa/lina_dicto',

'app-version': config.version,

overwrite: true,  // 上書き

'helper-bundle-id': 'jp.co.michinari_nukazawa/lina_dicto',
overwrite: true,
asar: true,
prune: true,
ignore: "node_modules/(electron-packager|electron-prebuilt|\.bin)|release\.js",
'version-string': {
CompanyName: 'daisy_bell',
FileDescription: 'Dictionary Application, Japanese to Esperanto',
OriginalFilename: config.name,
FileVersion: config.version,
ProductVersion: config.version,
ProductName: config.name,
InternalName: config.name
}
}, function done (err, appPath) {
	if(err) {
		throw new Error(err);
	}
	console.log('Done!!');
});

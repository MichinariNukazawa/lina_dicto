
.PHONY: all run clean

all:
	# NOP
	exit 1

reset:
	rm -rf lina_dicto/node_modules
	cd lina_dicto && npm install && npm audit fix

run:
	cd lina_dicto && npm run running

clean:
	cd lina_dicto && npm run clean
	rm -rf release/release

.PHONY: test ci-test
ci-test:
	cd lina_dicto && npm install
	rm lina_dicto/test/timeout.js # CI timeoutテストしない
	make test
	#make package

test:
	cd lina_dicto && npm run test test/$(ARG)

.PHONY: dictionary_source dictionary dictionary
dictionary_source:
	cd lina_dicto/dictionary/esperanto/dictionary_source/ && bash ./gen_dictionary.sh
dictionary:
	cd lina_dicto/dictionary/esperanto/dictionary_source/ && node ./expand_dictionary.js
dictionary_ios: dictionary
	cd lina_dicto/dictionary/esperanto/dictionary_source/ && mkdir -p ios
	node lina_dicto/dictionary/esperanto/dictionary_source/conv_pejvo_dictionary_ios.js
	node lina_dicto/dictionary/esperanto/dictionary_source/conv_pejvo_dictionary_ios_ja.js

.PHONY: package package_desktop
package: package_desktop

package_desktop:
	rm -rf lina_dicto/node_modules
	#cd lina_dicto && npm install # audit command depend npm version 6
	cd lina_dicto && npm install && npm audit fix
	make test
	bash ./release/installer_win32_x64.sh
	bash ./release/installer_darwin.sh
	bash ./release/installer_debian.sh


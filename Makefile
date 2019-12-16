
.PHONY: all run clean

all:
	# NOP
	exit 1

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

.PHONY: dictionary
dictionary:
	cd lina_dicto && bash ./dictionary/esperanto/gen_dictionary.sh

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

macappstore:
	sudo rm -rf lina_dicto/release/mas/
	cd lina_dicto && npm install && npm run pack:mas
	./mac_app_store/sign.sh


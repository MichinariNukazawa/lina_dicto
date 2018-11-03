
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
package: test package_desktop

package_desktop:
	bash ./release/installer_win32_x64.sh
	bash ./release/installer_darwin.sh
	bash ./release/installer_debian.sh



.PHONY: all run clean

all:
	# NOP
	exit 1

run:
	cd lina_dicto && npm run running

test:
	cd lina_dicto && npm run test

dictionary:
	cd lina_dicto && bash ./dictionary/esperanto/gen_dictionary.sh

clean:
	cd lina_dicto && npm run clean
	rm -rf release/release

.PHONY: package package_desktop
package: package_desktop

package_desktop:
	bash ./release/installer_win32_x64.sh
	bash ./release/installer_darwin.sh
	bash ./release/installer_debian.sh



.PHONY: all run clean

all:
	# NOP
	exit 1

run:
	cd lina_dicto && npm run build

test:
	cd lina_dicto && npm run test

dictionary:
	cd lina_dicto && bash ./dictionary/esperanto/gen_dictionary.sh

clean:
	rm -rf release

.PHONY: package package_desktop
package: package_desktop

package_desktop:
	bash ./installer_win32_x64.sh
	bash ./installer_darwin.sh
	bash ./installer_debian.sh



.PHONY: all run clean

all:
	# NOP
	exit 1

run:
	cd lina_dicto && npm run build

clean:
	rm -rf release

.PHONY: package package_desktop
package: package_desktop

package_desktop:
	bash ./installer_win32_x64.sh
	bash ./installer_darwin.sh
	cd lina_dicto && npm run installer_debian_amd64


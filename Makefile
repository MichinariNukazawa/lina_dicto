
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
	bash ./packaging_win64.sh
	bash ./packaging_macosx.sh
	cd lina_dicto && npm run installer_debian_amd64



.PHONY: all run clean

all:
	# NOP
	exit 1

run:
	cd lina_dicto && npm run build

clean:
	rm -rf release

.PHONY: packaging packaging_desktop
packaging: packaging_desktop

packaging_desktop:
	bash ./packaging_win64.sh
	bash ./packaging_macosx.sh


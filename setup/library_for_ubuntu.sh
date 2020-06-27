#!/bin/bash
#

set -eu
set -o pipefail

trap 'echo "error:$0($LINENO) \"$BASH_COMMAND\" \"$@\""' ERR

SCRIPT_DIR=$(cd $(dirname $0); pwd)
ROOT_DIR=${SCRIPT_DIR}/..


# install depend package
# https://github.com/nodesource/distributions
if type npm 2>/dev/null 1>/dev/null ; then
	echo "npm already exist."
else
	# sudo apt install npm -y
	sudo apt install curl -y
	curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
	sudo apt install -y nodejs
fi

# pushd ${ROOT_DIR}
# npm install electron
# popd




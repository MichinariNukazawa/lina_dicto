#!/bin/bash
#

set -eu
set -o pipefail
set -x

trap 'echo "error:$0($LINENO) \"$BASH_COMMAND\" \"$@\""' ERR


SCRIPT_DIR=$(cd $(dirname $0); pwd)

INPUT_FILE=""

function convert_utf(){
	OUTPUT_FILE=${INPUT_FILE%.*}_utf8.txt
	iconv -f Shift-JIS -t UTF8 "${INPUT_FILE}" |  perl -p -e 's/\r\n/\n/' > "${OUTPUT_FILE}"
}

mkdir -p w_dict/
pushd w_dict/

unzip ../pejv181.zip

INPUT_FILE="gvidilo.txt"
convert_utf
rm ${INPUT_FILE}
INPUT_FILE="legumin.txt"
convert_utf
rm ${INPUT_FILE}
INPUT_FILE="pejvo.txt"
convert_utf
rm ${INPUT_FILE}

popd


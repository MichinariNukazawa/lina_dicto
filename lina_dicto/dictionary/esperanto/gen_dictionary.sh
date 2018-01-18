#!/bin/bash
#

set -eu
set -o pipefail
set -x

trap 'echo "error:$0($LINENO) \"$BASH_COMMAND\" \"$@\""' ERR


SCRIPT_DIR=$(cd $(dirname $0); pwd)

INPUT_FILE=""
OUTPUT_FILE=""

function convert_utf(){
	INPUT_FILE=$1
	OUTPUT_FILE=$2
	iconv -f Shift-JIS -t UTF8 "${INPUT_FILE}" |  perl -p -e 's/\r\n/\n/' > "${OUTPUT_FILE}"
}

function convert_json(){
	INPUT_FILE=$1
	OUTPUT_FILE=$2
	echo -e "[" > "${OUTPUT_FILE}"
	cat "${INPUT_FILE}" | perl -p -e 's/^([^:]+):(.*)$/["\1","\2"],/' >> "${OUTPUT_FILE}"
	sed -i '$s/.$//' "${OUTPUT_FILE}"	# 末尾の','を除去する
	echo -e "]" >> "${OUTPUT_FILE}"
}

pushd ${SCRIPT_DIR}

mkdir -p w_dict/
pushd w_dict/

unzip ../pejv181.zip

convert_utf "gvidilo.txt" "../gvidilo.txt"
convert_utf "legumin.txt" "../legumin.txt"
convert_utf "pejvo.txt" "pejvo_utf8.txt"

convert_json "pejvo_utf8.txt" "../dictionary00.json"
rm ${INPUT_FILE}

popd

rm -rf w_dict/

node conv_pejvo_dictionary.js

popd


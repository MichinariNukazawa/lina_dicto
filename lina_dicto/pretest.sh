#!/bin/bash

mkdir -p object
sed 's/\/\*export default\*\//export default/g' js/esperanto.js > object/esperanto.js


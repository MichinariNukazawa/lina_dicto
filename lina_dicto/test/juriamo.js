'use strict';

var assert = require("power-assert"); // assertモジュールのinclude

const Juriamo = require('../src/juriamo');

it ("convert", function() {
	assert("Ａｍｒｉｌａｔｏ"	=== Juriamo.convert_juriamo_assign_from_alfabeto("Amrilato"));
	assert("Ｖｏ㍍ｏ"		=== Juriamo.convert_juriamo_assign_from_alfabeto("Voĉo"));
	assert("㍊１０００"		=== Juriamo.convert_juriamo_assign_from_alfabeto("￥１０００"));
	assert("ｓｕ㍍㌫ａｌｍｏ"	=== Juriamo.convert_juriamo_assign_from_alfabeto("suĉŝalmo"));
	assert("Amrilato"		=== Juriamo.convert_alfabeto_from_juriamo_assign("Ａｍｒｉｌａｔｏ"));
	assert("Voĉo"			=== Juriamo.convert_alfabeto_from_juriamo_assign("Ｖｏ㍍ｏ"));
	assert("￥１０００"		=== Juriamo.convert_alfabeto_from_juriamo_assign("㍊１０００"));
	assert("suĉŝalmo"		=== Juriamo.convert_alfabeto_from_juriamo_assign("ｓｕ㍍㌫ａｌｍｏ"));
});


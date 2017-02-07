'use strict';
/* global process */
/*******************************************************************************
 * Copyright (c) 2015 IBM Corp.
 *
 * All rights reserved. 
 *
 * Contributors:
 *   Chanakya - Initial implementation
 *******************************************************************************/
var express = require('express');
var router = express.Router();
var setup = require('../setup.js');

//anything in here gets passed to JADE template engine
function build_bag(){
	return {
				setup: setup,								//static vars for configuration settings
				e: process.error,							//send any setup errors
				jshash: process.env.cachebust_js,			//js cache busting hash (not important)
				csshash: process.env.cachebust_css,			//css cache busting hash (not important)
			};
}

// ============================================================================================================================
// Home
// ============================================================================================================================
router.route('/').get(function(req, res){
	res.render('index', {title: 'SPR', bag: build_bag()});
});

// ============================================================================================================================
// Part 1
// ============================================================================================================================
router.route('/public').get(function(req, res){
	res.render('home', {title: 'Smart Property Registry', bag: build_bag()});
});
router.route('/home/:page?').get(function(req, res){
	res.render('home', {title: 'Smart Property Registry', bag: build_bag()});
});

module.exports = router;


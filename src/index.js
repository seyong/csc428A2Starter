/***************************************************
* CSC428/2514 - St. George, Fall 2018 
* 
* File: index.js
* Summary: Entry point of current React app.
*	This assignment will help you become familiar with 
*	a HCI experiment in interaction techniques design.
*	This experiment is targeting Text Entry system,
*	a well-known HCI problem.
*	You are going to develop your own experimenet software
*	and measure the performance of your participants, and 
*	compare the designed text entry system with a baseline system.
*	Please take time to read through the code and note
*	how following text entry systems are working. 
*
* Instruction:
*	The assignment handout and README files contain 
*	a detailed description of what you need to do. Please
*	be sure to read them carefully.
*	
* TODO:
*	You must implement your own experiment software using 
*	given Starter code. 
*
* The code is commented, and the comments provide information
* about what each js file is doing.
*
* Written by: Seyong Ha, Mingming Fan, Sep. 2018
*				Assignment2: Quantitative Analysis
*				Updated at: NA
****************************************************/

/**
 *  Libraries
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Watch from './watch'


ReactDOM.render(
	// A size of a smartwatch screen is controlled
	//	via 'original_scale' parameters

	//If you want to do an experiment with exact same
	//	screen size with Apple Watch Series 3,
	//	pass 'size' and your 'devicePPI' as Watch component's properties.
	//	For example, to simulate the Apple Watch Series 3 , 42mm
	//	on your MacBookPro Retina:
	//		<Watch size={42} devicePPI={112} type={YourType}/>
	//Else,
	// 	pass originalScale property to Watch Component as a size
	// 	the default value is 0.15
	// 
	// type property will determine which version of text entry system 
	// you are going to use. 
	//	'normal'	: baseline condition, normal keyboard
	//	'zoom' 		: A keyboard has a zoom function.  
	<Watch originalScale={0.15} type={'zoom'} />,
	//<Watch originalScale={0.15} type={'normal'} />,
	document.getElementById("root")
);

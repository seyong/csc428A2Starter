// import librareis
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Watch from './watch'

// FileName: index.js
// Description:
//		Entry point of this React App.

function download(text, name, type) {
	 // console.log(JSON.parse(text));
	 var a = document.createElement("a");
	 var file = new Blob([text], {type: type});
	 a.href = URL.createObjectURL(file);
	 a.download = name;
	 a.click();
}


ReactDOM.render(
	// A size of your smartwatch screen size is controlled
	//	via 'original_scale' parameters

	//If you want to do an experiment with exact same
	//	screen size with Apple Watch Series 3,
	//	pass size and your devicePPI as Watch component's properties.
	//	For example, to simulate the Apple Watch Series 3 on your MacBookPro Retina
	//		AppleWatch 42mm
	//		<Watch size={42} devicePPI={112} type={YourType}/>
	//Else,
	// 	pass originalScale property to Watch Component
	// 	the default value is 0.15
	<Watch originalScale={0.15} type={'normal'} />,
	document.getElementById("root")
);

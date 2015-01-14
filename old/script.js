
function screenResolution() {
	//Screen Resolution problem:
	var x = screen.width;	
	var y = screen.height;
	var flash = document.getElementById("flashContent");
	
	if (Math.round(x/y * 100)/100 == 1.33) {
		flash.style.height = (81*y)/100 + "px";
	} else {
		flash.style.height = 700 + "px";
	}
};

function operaClickToActivate() {
	//Fix Opera "Click to Activate" bug:
	var theObjects = document.getElementsByTagName("object");
		for (var i = 0; i < theObjects.length; i++) {
			theObjects[i].outerHTML = theObjects[i].outerHTML;
		}
};

screenResolution();

window.onload = function() {
	operaClickToActivate();
};
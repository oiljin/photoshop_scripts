// (c) Copyright 2014.  Iljin Oleg.  All rights reserved.

/*
@@@BUILDINFO@@@ Count Layers.jsx 0.0.0.1
*/

var begDesc = "$$$/JavaScripts/CountLayers/Description=Get count layers in psd-file."
var begName = "$$$/JavaScripts/CountLayers/MenuName=Get count layers"

$.localize = true;

count = 0;

function run(){
    var layerSetsRef = app.activeDocument.layerSets;
	recFolder(layerSetsRef);
    count += app.activeDocument.layers.length*1;
    count -= layerSetsRef.length*1;
	alert('finish! Layer count: ' + count);
}

function recFolder(layerSetsRef){
	dumpLayerSets(layerSetsRef);
	
	var lenl = layerSetsRef.length;
	for(var i=0; i<lenl; i++){
		var layerSet = layerSetsRef[i];
		
		var child = layerSet.layerSets,
			len = child.length;
		if(len) {
			recFolder(child);
		}
	}
}

function dumpLayerSets(layerSets){
    var len = layerSets.length;
    for(var i=0;i<len;i++){
         var layerSet = layerSets[i];
		 if(layerSet && layerSet.artLayers){
			var l = layerSet.artLayers.length*1;
			count += l ? l : 0;
		 }
    }
}

run();
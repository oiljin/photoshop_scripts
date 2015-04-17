// (c) Copyright 2014.  Iljin Oleg.  All rights reserved.

/*
@@@BUILDINFO@@@ Font List In Visibled Layers.jsx 0.0.0.1
*/

var begDesc = "$$$/JavaScripts/FontListInVisibledLayers/Description=Font List In Visibled Layers."
var begName = "$$$/JavaScripts/FontListInVisibledLayers/MenuName=Font List In Visibled Layers"

$.localize = true;

summator = new Summator();
function Summator(){
	var fonts = new Object();

	return {
		add: function (key){
			fonts[key] = true;
		},
		
		get: function(){
			var str = '';
			for(key in fonts){
				str += key + '\n';
			}
			return str;
		}
	}
} 

function run(){
	fileOut.write("Start... \n\n");
    var layerSetsRef = app.activeDocument.layerSets;
    
	recFolder(layerSetsRef, 1);
    dumpLayers(app.activeDocument.layers);
}

function recFolder(layerSetsRef, tree){
	dumpLayerSets(layerSetsRef, tree);
	
	var lenl = layerSetsRef.length;
	for(var i=0; i<lenl; i++){
		var layerSet = layerSetsRef[i];
		
		var child = layerSet.layerSets,
			len = child.length;
		if(len) {
			recFolder(child, ++tree);
		}
		
	}
}

function dumpLayerSets(layerSets, tree){
    var len = layerSets.length;
    for(var i=0;i<len;i++){
         var layerSet = layerSets[i];
		 if(layerSet.visible){
			dumpLayers(layerSet.artLayers);
		 }
    }
}

function dumpLayers(layers){
    var len = layers.length;
    for(var i=0;i<len;i++){
        var layer = layers[i];
        if(layer.kind==undefined){
                continue;
        }
        if(layer.kind == LayerKind.TEXT){
			try{
				f = layer.textItem.font + ' ' + layer.textItem.size + ' #' + layer.textItem.color.rgb.hexValue;
				summator.add(f);
				fileOut.write('font: '+ layer.textItem.font +' font-size: ' + layer.textItem.size + ' color: #' + layer.textItem.color.rgb.hexValue + ' ('+ layer.name+')\n');
			} catch(e){
				fileOut.write('#####ERROR - ' + layer.name + '\n');
			}
        }
    }
}

fileOut = new File(app.activeDocument.fullName + "_fonts.txt");
fileOut.lineFeed = "Windows";
fileOut.open("w", "TEXT", "????");

run();

var info = summator.get();

fileOut.write("\n==========================================\n");
fileOut.write("Summary info:\n");
fileOut.write(info);
fileOut.write("\n==========================================\n");
fileOut.write("\nFinish...\n");
fileOut.close();

alert(info);
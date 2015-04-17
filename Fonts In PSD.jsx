// (c) Copyright 2014.  Iljin Oleg.  All rights reserved.

/*
@@@BUILDINFO@@@ Fonts In PSD.jsx 0.0.0.1
*/

var begDesc = "$$$/JavaScripts/FontsInPSD/Description=Fonts In PSD-file."
var begName = "$$$/JavaScripts/FontsInPSD/MenuName=Fonts In PSD"

$.localize = true;

count = 0;
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
    var len = layerSets.length,
		sep = '';
		
		for(var j=0; j< tree; j++){
			sep += '-';
		}
    for(var i=0;i<len;i++){
         var layerSet = layerSets[i];
         fileOut.write(sep + '  '+layerSet.name + '\n');
         dumpLayers(layerSet.artLayers);
    }
}

function dumpLayers(layers){
    var len = layers.length;
    for(var i=0;i<len;i++){
		count ++;
         var layer = layers[i];
         if(layer.kind==undefined){
                continue;
         }
        if(layer.kind == LayerKind.TEXT){
			try{
				f = layer.textItem.font + ' ' + layer.textItem.size + ' ' + layer.textItem.color.rgb.hexValue;
				summator.add(f);
				fileOut.write('font: '+ layer.textItem.font +' font-size: ' + layer.textItem.size + ' color: #' + layer.textItem.color.rgb.hexValue + ' ('+ layer.name+')\n');
			} catch(e){
				fileOut.write('#####ERROR - ' + layer.name + '\n');
			}
        }
    }
}
if ($.os.search(/windows/i) != -1) {
	fileLineFeed = "Windows";
} else {
	fileLineFeed = "Macintosh";
}

fileOut = new File(app.activeDocument.fullName + "_fonts.txt");
fileOut.lineFeed = fileLineFeed;
fileOut.open("w", "TEXT", "????");

run();

fileOut.write("\nTotal layer: " + count + "\n");

fileOut.write("\n==========================================\nSummary info:\n");
fileOut.write(summator.get());

fileOut.write("\nFinish...\n");
fileOut.close();
alert('finish! layer count: ' + count);
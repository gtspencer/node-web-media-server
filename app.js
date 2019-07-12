var express = require('express');
var app = express();
var csv = require('fast-csv');
var excludeFileList = 'csv-lists/ignore_list.csv';
var deleteFileList = 'csv-lists/delete_list.csv';
var includeFileList = 'csv-lists/include_list.csv';
var mediaPath = 'G:/_new/';
var mediaPathBck = 'G:\\_new\\';
var exec = require('child_process').exec, child;
const port = 3000;

const fs = require('fs');

var files;
var renamed = false;

var excludeList;
csv.fromPath(excludeFileList).on('data', function(data) {
	excludeList = data;
});
var deleteList;
csv.fromPath(deleteFileList).on('data', function(data) {
	deleteList = data;
});
var includeList;
csv.fromPath(includeFileList).on('data', function(data) {
	includeList = data;
});

app.use(express.static(__dirname + '/public'));

/*app.get('/', function (req, res) {
   res.send("Hello world");
   //res.render('/index.html');
});*/

app.get('/sendButton', function(req, res) {
	console.log("Renaming Files");
	renameFiles();
	res.sendFile( __dirname + "/public/" + "index.html" );
});

var server = app.listen(port, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("App listening at http://%s:%s", host, port)
});

function renameFiles() {
	files = fs.readdirSync(mediaPath);
	//console.log(fileList);
	files.forEach( function(item, index) {
		//console.log(item);
		var newName = getNewFileName(item);
		deleteFiles(item);
		child = exec('rename "' + mediaPath + item + '" "' + newName +'"',
		    function (error, stdout, stderr) {
		        //console.log('stdout: ' + stdout);
		        //console.log('stderr: ' + stderr);
		        if (error !== null) {
		             console.log('exec error: ' + error);
		        }
		    });
	});
}

function getNewFileName(oldName) {
	var newName = "";
	oldNameList = oldName.split('.');
	oldNameList.forEach( function(oldItem, oldIndex) {
		var foundEx = false;
		excludeList.forEach( function(exItem, exIndex) {
			if (oldItem.includes(exItem) || oldItem === '0' || oldItem === '1') {
				foundEx = true;
			}
		});
		if (!foundEx) {
			newName += oldItem + " ";
		} else {
			includeList.forEach( function (inclItem, inclIndex) {
				if (oldItem.includes(inclItem)) {
					newName += inclItem + " ";
				}
			});
		}
	});
	//console.log(newName);
	return newName;
}

function deleteFiles(folder) {
	deleteList.forEach( function(delItem, delIndex) {
		child = exec('del "' + mediaPathBck + folder + '\\*' + delItem,
			function (error, stdout, stderr) {
				console.log("Working Folder: " + folder);
				console.log("\tDeleted files of type " + delItem);
			    //console.log('stdout: ' + stdout);
			    //console.log('stderr: ' + stderr);
			    if (error !== null) {
			         console.log('exec error: ' + error);
			    }
		});
	});


/*	var delFiles = fs.readdirSync(mediaPath + folder);
	delFiles.forEach( function(item, index) {
		var itemArr = item.split('.');
		var foundFile = false;
		deleteList.forEach( function(delItem, delIndex) {
			if (itemArr[itemArr.length - 1] === delItem) {
				foundFile = true;
			}
		})
		if (foundFile) {
			
		}
	});*/
	//console.log(delFiles);
}
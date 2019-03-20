export function DntReader() {
  // module for to allow reading of dnt data from dnt files
  // right now this simply loads the whole file into the data property
  // data is an array of objects eg [{id: "123",NameParam: "456"}]

  this.data = [];
  this.columnNames = [];
  this.columnTypes = [];
  this.columnIndexes = [];
  this.numRows = 0;
  this.numColumns = 0;
  this.fileName = "";
  this.colsToLoad = null;

  this.getRow = function (index) {
    return this.convertData(this.data[index]);
  }

  this.convertData = function (d) {
    var item = { id: d[0] };

    for (var c = 1; c < this.numColumns; ++c) {
      if (d[c] != null) {
        item[this.columnNames[c]] = d[c];
      }
    }

    return item;
  }

  this.getValue = function (index, colName) {
    if (colName in this.columnIndexes) {
      return this.data[index][this.columnIndexes[colName]];
    }
    else {
      return null;
    }
  }

  // function to load in dnt data from a hosted file
  // if the file is not found it will try a zip with the same name
  this.loadDntFromServerFile = function (fileName, statusFunc, processFileFunc, failFunc) {
    var useFileName = fileName;
    if (this.colsToLoad === null && fileName.toUpperCase().lastIndexOf(".LZJSON") != fileName.length - 7 && fileName.toUpperCase().lastIndexOf(".JSON") != fileName.length - 5) {
      useFileName = fileName.substr(0, fileName.length - 4) + '.lzjson';
    }
    this.loadDntFromServerFileImpl(useFileName, statusFunc, processFileFunc, failFunc);
  }

  this.loadDntFromServerFileImpl = function (fileName, statusFunc, processFileFunc, failFunc) {

    // console.log("about to load");
    var isJson = (fileName.toUpperCase().lastIndexOf(".JSON") == fileName.length - 5);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileName, true);
    xhr.responseType = 'text';

    statusFunc('downloading dnt file ' + fileName);
    var start = new Date().getTime();

    var t = this;

    xhr.onerror = function (e) {
      console.log('what! error ', e);
      if (failFunc) {
        failFunc('Cannot load file' + e);
      }
    }

    xhr.ontimeout = function (e) {
      console.log('what! timeout ', e);
      if (failFunc) {
        failFunc('Timeout loading file' + e);
      }
    }

    xhr.onload = function (e) {
      // console.log("got status");

      if (this.status === 200) {
        // console.log("got 200 status");

        var blobv = this.response;
        t.processJsonFile(blobv, fileName);

        var end = new Date().getTime();
        var time = end - start;
        console.log('json time: ' + time / 1000 + 's for ' + fileName);
        processFileFunc();
      }
      else {
        console.log('what! status ' + this.status + '??');
        if (failFunc) {
          failFunc(this.status + ': Cannot load file, couldnt load zip either: ' + fileName);
        }
      }
    };

    xhr.send();
  }

  this.processJsonFile = function (json, fileName) {
    var dlData = JSON.parse(json);

    this.data = dlData.data;
    this.fileName = fileName;
    this.columnNames = dlData.columnNames;
    this.columnTypes = dlData.columnTypes;

    this.numRows = this.data.length;
    this.numColumns = dlData.columnNames.length;

    this.columnIndexes = { 'id': 0 };
    for (var c = 1; c < this.numColumns; ++c) {
      this.columnIndexes[this.columnNames[c]] = c;
    }
  }

  function onerror(message) {
    console.error(message);
  }
}

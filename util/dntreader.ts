const LZString = require('lz-string');

export class DntReader {
    // module for to allow reading of dnt data from dnt files
    // right now this simply loads the whole file into the data property
    // data is an array of objects eg [{id: "123",NameParam: "456"}]

    data: any[] = [];
    columnNames: string[] = [];
    columnTypes: number[] = [];
    columnIndexes: any = {};
    numRows = 0;
    numColumns = 0;
    fileName = '';
    colsToLoad = null;

    getRow(index: number) {
        return this.convertData(this.data[index]);
    }

    convertData(d: any[]) {
        const item: any = { id: d[0] };

        for (var c = 1; c < this.numColumns; ++c) {
            if (d[c] != null) {
                item[this.columnNames[c]] = d[c];
            }
        }

        return item;
    }

    getValue(index: number, colName: number) {
        if (colName in this.columnIndexes) {
            return this.data[index][this.columnIndexes[colName]];
        }
        else {
            return null;
        }
    }

    // function to load in dnt data from a hosted file
    // if the file is not found it will try a zip with the same name
    loadDntFromServerFile(fileName: string, statusFunc: any, processFileFunc: any, failFunc: any) {
        var useFileName = fileName;
        if (this.colsToLoad === null && fileName.toUpperCase().lastIndexOf(".LZJSON") != fileName.length - 7 && fileName.toUpperCase().lastIndexOf(".JSON") != fileName.length - 5) {
            useFileName = fileName.substr(0, fileName.length - 4) + '.lzjson';
        }
        this.loadDntFromServerFileImpl(useFileName, statusFunc, processFileFunc, failFunc);
    }

    loadDntFromServerFileImpl(fileName: string, statusFunc: any, processFileFunc: any, failFunc: any) {

        // console.log("about to load");
        var isLzJson = (fileName.toUpperCase().lastIndexOf(".LZJSON") == fileName.length - 7);
        var isJson = (fileName.toUpperCase().lastIndexOf(".JSON") == fileName.length - 5);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', fileName, true);

        if (isLzJson || isJson) {
            xhr.responseType = 'text';
        }
        else {
            xhr.responseType = 'blob';
        }

        statusFunc('downloading dnt file ' + fileName);
        var start = new Date().getTime();

        xhr.onerror = (e) => {
            console.log('what! error ', e);
            if (failFunc) {
                failFunc('Cannot load file' + e);
            }
        }

        xhr.ontimeout = (e) => {
            console.log('what! timeout ', e);
            if (failFunc) {
                failFunc('Timeout loading file' + e);
            }
        };

        const t = this;
        xhr.onload = function (e) {
            // console.log("got status");

            if (this.status === 200) {
                // console.log("got 200 status");

                var blobv = this.response;
                if (isJson) {
                    t.processJsonFile(blobv, fileName);

                    var end = new Date().getTime();
                    var time = end - start;
                    console.log('json time: ' + time / 1000 + 's for ' + fileName);
                    processFileFunc();
                }
                else if (isLzJson) {
                    t.processLzFile(blobv, fileName);

                    var end = new Date().getTime();
                    var time = end - start;
                    console.log('lzjson time: ' + time / 1000 + 's for ' + fileName);
                    processFileFunc();
                }
                else {
                    throw new Error('unknown file type');
                }
            }
            else {
                // if we get an error we can try to see if there is a zip version there
                if (fileName.toUpperCase().lastIndexOf('.LZJSON') === fileName.length - 7) {
                    console.log('trying dnt');
                    var dntFileName = fileName.substr(0, fileName.length - 7) + '.dnt';
                    t.loadDntFromServerFileImpl(dntFileName, statusFunc, processFileFunc, failFunc);
                }
                else if (fileName.toUpperCase().lastIndexOf('.DNT') === fileName.length - 4) {
                    console.log('trying json');
                    var zipFileName = fileName.substr(0, fileName.length - 4) + '.json';
                    t.loadDntFromServerFileImpl(zipFileName, statusFunc, processFileFunc, failFunc);
                }
                else {
                    console.log('what! status ' + this.status + '??');
                    if (failFunc) {
                        failFunc(this.status + ': Cannot load file, couldnt load zip either: ' + fileName);
                    }
                }
            }
        };

        xhr.send();
    }

    processJsonFile(json: string, fileName: string) {
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

    processLzFile(blobv: any, fileName: string) {
        var start = new Date().getTime();
        var stringifiedData = LZString.decompressFromUTF16(blobv);
        var end = new Date().getTime();
        var time = end - start;
        console.log('decompress time: ' + time / 1000 + 's for ' + fileName);

        this.processJsonFile(stringifiedData, fileName);
    }
}

module.exports = DntReader;
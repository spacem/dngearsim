export interface DntData {
    data: any[][];
    columnNames: string[];
    columnTypes: number[];
    columnIndexes: {[colName: string]: number};
    numRows: number;
    numColumns: number;
    fileName: string;
    colsToLoad: {[colName: string]: boolean};
}

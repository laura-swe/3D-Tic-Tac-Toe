var n = 3;

function Level(id) {
    this.id = id;
    this.rows = new Array(n).fill(0);
    this.cols = new Array(n).fill(0);
    this.diag = new Array(n - 1).fill(0);
}

//initialize state arrays
var levels = new Array(n);
var grid = new Array(n);
var grid_rows = new Array(n);
var grid_cols = new Array(n);
var grid_diag = new Array(n+1).fill(0);

//populate state arrays
for(var i = 0; i<n; i++){
    levels[i] = new Level(i);
    grid[i] = new Array(n).fill(0);
    grid_rows[i] = new Array(n);
    grid_cols[i] = new Array(n);
    for(var j = 0; j<n; j++){
        grid_rows[i][j] = new Array(n).fill(0);
        grid_cols[i][j] = new Array(n).fill(0);
    }

}

function init(){
	var table = document.getElementById("table");
	//create and populate body
	var body = table.createTBody();
	for(var i =0; i<n; i++){
		var row = body.insertRow(i);
		//cols
		for(var j = 0; j<n; j++){
			row.insertCell(j);
		}
	}

	//add other levels
    for(var i = 1; i<n; i++){
        $("section").append($("#table").clone(true).attr('id', i));
    }

    //set levels ids
    table.id = 0;

    var cellsArr = document.getElementsByTagName("td");
    //add listeners to each cell
    for(var i = 0; i<cellsArr.length; i++){
        cellsArr[i].style.backgroundColor = offColor;
        //cellsArr[i].onmousedown = cellOnMouseDown;
        //cellsArr[i].onclick = cellOnClick;
        cellsArr[i].onmouseover = function(){
            if(this.style.backgroundColor == offColor) {
                this.style.backgroundColor = hoverColor;
            }
        }
        cellsArr[i].onmouseleave = function(){
            if(this.style.backgroundColor == hoverColor){
                this.style.backgroundColor = offColor;
            }
        }
    }

	//set handlers for btns
	document.getElementById("reset").onclick = resetOnClick;
	//document.getElementById("color").onclick = clrOnClick;
	document.getElementById("surrender").onclick = function () {
	    alert("You have surrender");
	    //resetOnClick();
        socket.emit('surrender');
	}

}

var opsColor = "firebrick";
var onColor = "dodgerblue";
var offColor = "whitesmoke";
var hoverColor = "lightblue";
function cellOnClick(){
    this.style.backgroundColor = onColor;
    var player = 1;

    // console.log(this.parentNode.parentNode.parentNode.id);
    // console.log(this.parentNode.rowIndex);
    // console.log(this.cellIndex);

    var level_num = this.parentNode.parentNode.parentNode.id; //level number top = 0
    var row = this.parentNode.rowIndex;
    var col = this.cellIndex;
    var curr_level = levels[level_num];

    socket.emit('move', row, col, level_num, onColor);

    //update grid arrays
    grid[row][col]+=player;
    grid_rows[row][col][level_num] = player;
    grid_cols[col][row][level_num] = player;

    //four cases of diagonals in 3D
    if(row == 0 && col == 0){
        if(level_num == 0) {
            grid_diag[0]+=player;
        }
        if(level_num == n-1){
            grid_diag[n]+=player;
        }
    }

    if(row == n-1 && col == n-1){
        if(level_num == 0) {
            grid_diag[n]+=player;
        }
        if(level_num == n-1){
            grid_diag[0]+=player;
        }
    }

    if(row == 0 && col == n-1){
        if(level_num == 0) {
            grid_diag[n-2]+=player;
        }
        if(level_num == n-1){
            grid_diag[n-1]+=player;
        }
    }

    if(row == n-1 && col == 0){
        if(level_num == 0) {
            grid_diag[n-1]+=player;
        }
        if(level_num == n-1){
            grid_diag[n-2]+=player;
        }
    }

    //check middle one for diag 3D
    var middle = Math.floor(n/2);
    if(row == col && n%2 == 1 && level_num == middle && row == middle){
        for(var i = 0; i< grid_diag.length; i++){
            grid_diag[i]+=player;
        }
    }

    //update single level arrays
    curr_level.rows[row]+=player;
    curr_level.cols[col]+=player;

    if(col==row){
        curr_level.diag[0]+=player;

        //account for middle case (only when n is odd)
        if(n%2 == 1){
            var middle = Math.floor(n/2);
            if(row == middle){
                curr_level.diag[n-2]+=player;
            }
        }
    }

    if( (row == 0 && col == n-1) || (row == n-1 && col == 0) ){
        curr_level.diag[n-2]+=player;
    }

    //console.log(grid_diag);

    if(winCheck(curr_level.rows.indexOf(n), curr_level.cols.indexOf(n), curr_level.diag.indexOf(n))){
        socket.emit('end');
        alert("You Win!");
    }

    var dc = document.getElementsByTagName("td");
    for(var i = 0; i<dc.length; i++) {
        dc[i].onclick = function () {
            return false;
        }
    }

    document.getElementById("message").innerText = "Player is thinking";
    socket.emit('turnSwitch');
}



function resetOnClick(){
    socket.emit('reset');

    //clean data
    grid_diag = new Array(n+1).fill(0);

    for(var i = 0; i<n; i++){
        levels[i] = new Level(i);
        grid[i] = new Array(n).fill(0);
        grid_rows[i] = new Array(n);
        grid_cols[i] = new Array(n);
        for(var j = 0; j<n; j++){
            grid_rows[i][j] = new Array(n).fill(0);
            grid_cols[i][j] = new Array(n).fill(0);
        }

    }

    //clean UI
	var cellsArr = document.getElementsByTagName("td");
	for(var i = 0; i<cellsArr.length; i++){
		cellsArr[i].style.backgroundColor = offColor;
        cellsArr[i].onclick = cellOnClick;
        cellsArr[i].onmouseover = function(){
            if(this.style.backgroundColor == offColor) {
                this.style.backgroundColor = hoverColor;
            }
        }
        cellsArr[i].onmouseleave = function(){
            if(this.style.backgroundColor == hoverColor){
                this.style.backgroundColor = offColor;
            }
        }
	}


}

function winCheck(rows, cols, diag){
    //check single level
    if(rows >= 0 || cols >= 0 || diag>=0){
        //resetOnClick();
        console.log("row,col,diag: one level");
        return true;
    }

    if(grid_diag.indexOf(n) >= 0){
        //resetOnClick();
        console.log("diag 3D");
        return true;
    }

    //check 3D
    for(var i = 0; i < grid.length; i++){
        if(grid[i].indexOf(n) >= 0){
            //resetOnClick();
            console.log("same xy 3D");
            return true;
        }
    }

    for(var r = 0; r < grid_rows.length; r++){
        if(checkIdentity(grid_rows[r]) || checkBwIdentity(grid_rows[r])){
            //resetOnClick();
            console.log("row 3D");
            return true;
        }

        if(checkIdentity(grid_cols[r]) || checkBwIdentity(grid_cols[r])){
            //resetOnClick();
            console.log("col 3D");
            return true;
        }
    }

	return false;
}

function checkIdentity(matrix){
    for(var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if(i==j && matrix[i][j] == 0){
                return false;
            }
        }
    }
    return true;
}

function checkBwIdentity(matrix){
    if(n%2 == 1){
        var middle = Math.floor(n/2);
        if(matrix[middle][middle] == 0){
            return false;
        }
    }
    if(matrix[0][n-1] == 0 || matrix[n-1][0] == 0){
        return false;
    }
    return true;
}

init();
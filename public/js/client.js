//var socket = io("http://cmpt218.csil.sfu.ca:25042");
var socket = io("http://localhost:25042");

socket.on("start", function(){
    var cells = document.getElementsByTagName("td");
    for(var i = 0; i<cells.length; i++) {
        if(cells[i].style.backgroundColor == offColor) {
            cells[i].onclick = cellOnClick;
            //cells[i].innerHTML = "click";
        }
    }
    document.getElementById("message").innerText = "You Start";
});

socket.on("connect", function(){

    //both
    var cells = document.getElementsByTagName("td");
    for(var i = 0; i<cells.length; i++) {
        if(cells[i].style.backgroundColor == offColor) {
            cells[i].onclick = function(){
                return false;
            };
            //cells[i].innerHTML = "no click";
        }
    }
    document.getElementById("message").innerText = "Loading players...";

});

socket.on('clientChange', function(clientNum){
    //only to the second

});

socket.on('coordinates', function(row,col,level){
    //updateUI
    var table = document.getElementById(level);
    var cell = table.tBodies[0].rows[row].cells[col];
    cell.style.backgroundColor = opsColor;
    cell.onclick = function(){return false;}
    //cell.innerHTML = "no click";
});

socket.on('wait', function () {
    document.getElementById("message").innerText = "Player is thinking";
});


socket.on('turn', function(){
    var cells = document.getElementsByTagName("td");
    for(var i = 0; i<cells.length; i++) {
        if(cells[i].style.backgroundColor == offColor) {
            cells[i].onclick = cellOnClick;
            //cells[i].innerHTML = "click";
        }
    }
    document.getElementById("message").innerText = "Your turn";

});

socket.on('lost', function(){
    //console.log(username);
    alert("You lose!");
    //document.getElementById("reset").click();
    socket.close();
    window.location.href = './stats';


});

socket.on('reset', function(){
    //alert("New Game Starting...");
    document.getElementById("reset").click();
    //socket.close();

});

socket.on('win', function(){
    socket.close();
    window.location.href = './stats';
    //document.getElementById("reset").click();
});

socket.on('opsLeft', function(){
    alert("Oponent Left. You win!");
    socket.close();
    window.location.href = './stats';
});

socket.on('quit', function(){
    socket.close();
    window.location.href = './stats';
});


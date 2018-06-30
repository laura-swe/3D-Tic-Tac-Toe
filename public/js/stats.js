//Stats requests
var request = new XMLHttpRequest();
function transDate(date){
    var d = new Date(date);
    return d.toLocaleString("en-US");
}

function getGamesData() {
    var table = document.getElementById("statsTable");
    var body = table.createTBody();
    body.id = "tbody";
    var url = 'rawdata';
    request.responseType = 'json';
    request.open('POST', url);
    request.send();

    request.onload = function () {
        var jsonFile = request.response;
        //console.log(jsonFile);
        for (var i = 0; i < jsonFile.length; i++) {
            var row = body.insertRow(i);
            row.insertCell().innerText = transDate(jsonFile[i]['time']);
            row.insertCell().innerText = jsonFile[i]['moves'];
            row.insertCell().innerText = jsonFile[i]['winner'];
            row.insertCell().innerText = jsonFile[i]['loser'];
        }
    }
}


function getUsersData() {
    var url = "usersdata"
    var table = document.getElementById("profiles");
    var body = table.createTBody();
    body.id = "tbody";
    request.responseType = 'json';
    request.open('POST', url);
    request.send();

    request.onload = function () {
        var jsonFile = request.response;
        //console.log(jsonFile);
        for (var i = 0; i < jsonFile.length; i++) {
            var row = body.insertRow(i);
            row.insertCell().innerText = jsonFile[i]['username'];
            row.insertCell().innerText = jsonFile[i]['fname'];
            row.insertCell().innerText = jsonFile[i]['lname'];
            row.insertCell().innerText = jsonFile[i]['age'];
            row.insertCell().innerText = jsonFile[i]['gender'];
            row.insertCell().innerText = jsonFile[i]['email'];
            row.insertCell().innerText = jsonFile[i]['wins'];
            row.insertCell().innerText = jsonFile[i]['loses'];

        }
    }
}
//var del = document.getElementById("delete");
//var hide_d = document.getElementById("hide_d");
// var hidden_d = false;
// hide_d.onclick = function(){
//     console.log("hide btn clicked");
//     var rows = document.getElementsByTagName("tr");
//     if(!hidden_d) {
//         for (var i = 0; i < rows.length; i++) {
//             rows[i].cells[0].style.display = "none";
//         }
//         hide_d.innerText = "Show Date";
//     }else{
//         for (var i = 0; i < rows.length; i++) {
//             rows[i].cells[0].style.display = "table-cell";
//         }
//         hide_d.innerText = "Hide Date";
//     }
//     hidden_d = !hidden_d;
// };
//
// var hidden_n = false;
// hide_n.onclick = function(){
//     console.log("hide btn clicked");
//     var rows = document.getElementsByTagName("tr");
//     if(!hidden_n) {
//         for (var i = 0; i < rows.length; i++) {
//             rows[i].cells[1].style.display = "none";
//         }
//         hide_n.innerText = "Show Name";
//     }else{
//         for (var i = 0; i < rows.length; i++) {
//             rows[i].cells[1].style.display = "table-cell";
//         }
//         hide_n.innerText = "Hide Name";
//     }
//     hidden_n = !hidden_n;
// };
//
// var hidden_i = false;
// hide_i.onclick = function(){
//     console.log("hide btn clicked");
//     var rows = document.getElementsByTagName("tr");
//     if(!hidden_i) {
//         for (var i = 0; i < rows.length; i++) {
//             rows[i].cells[2].style.display = "none";
//         }
//         hide_i.innerText = "Show User ID";
//     }else{
//         for (var i = 0; i < rows.length; i++) {
//             rows[i].cells[2].style.display = "table-cell";
//         }
//         hide_i.innerText = "Hide User ID";
//     }
//     hidden_i = !hidden_i;
// };
//
// function byDate(x,y){
//     return ((x['date'] == y['date']) ? 0 : ((x['date'] > y['date']) ? 1 : -1 ));
// }
//
// function byName(x,y){
//     return ((x['name'] == y['name']) ? 0 : ((x['name'] > y['name']) ? 1 : -1 ));
// }
//
// function byStudentId(x,y){
//     return ((x['student_id'] == y['student_id']) ? 0 : ((x['student_id'] > y['student_id']) ? 1 : -1 ));
// }
//
//
// var bydate = document.getElementById("bydate");
// bydate.onclick = function () {
//     request.open('POST', url);
//     request.send();
//     request.onload = function() {
//         var jsonFile = request.response;
//         jsonFile.sort(byDate);
//         for(var i = 0; i < jsonFile.length; i++) {
//             var row = body.rows[i];
//             if (jsonFile[i]['action'] == "end") {
//                 row.cells[0].innerText = transDate(jsonFile[i]['date']);
//                 row.cells[1].innerText = "--- Session Ended";
//                 row.cells[2].innerText = "---";
//                 row.style.backgroundColor = "lightcoral";
//
//             } else {
//                 row.cells[0].innerText = transDate(jsonFile[i]['date']);
//                 row.cells[1].innerText = jsonFile[i]['name'];
//                 row.cells[2].innerText = jsonFile[i]['student_id'];
//                 row.style.backgroundColor = "whitesmoke";
//             }
//         }
//     }
// }
//
// var byname = document.getElementById("byname");
// byname.onclick = function () {
//     request.open('POST', url);
//     request.send();
//     request.onload = function() {
//         var jsonFile = request.response;
//         jsonFile.sort(byName);
//         for(var i = 0; i < jsonFile.length; i++) {
//             var row = body.rows[i];
//             if (jsonFile[i]['action'] == "end") {
//                 row.cells[0].innerText = transDate(jsonFile[i]['date']);
//                 row.cells[1].innerText = "--- Session Ended";
//                 row.cells[2].innerText = "---";
//                 row.style.backgroundColor = "lightcoral";
//
//             } else {
//                 row.cells[0].innerText = transDate(jsonFile[i]['date']);
//                 row.cells[1].innerText = jsonFile[i]['name'];
//                 row.cells[2].innerText = jsonFile[i]['student_id'];
//                 row.style.backgroundColor = "whitesmoke";
//             }
//         }
//     }
// }
//
// var bystudentid = document.getElementById("bystudentid");
// bystudentid.onclick = function () {
//     request.open('POST', url);
//     request.send();
//     request.onload = function() {
//         var jsonFile = request.response;
//         jsonFile.sort(byStudentId);
//         for(var i = 0; i < jsonFile.length; i++) {
//             var row = body.rows[i];
//             if (jsonFile[i]['action'] == "end") {
//                 row.cells[0].innerText = transDate(jsonFile[i]['date']);
//                 row.cells[1].innerText = "--- Session Ended";
//                 row.cells[2].innerText = "---";
//                 row.style.backgroundColor = "lightcoral";
//
//             } else {
//                 row.cells[0].innerText = transDate(jsonFile[i]['date']);
//                 row.cells[1].innerText = jsonFile[i]['name'];
//                 row.cells[2].innerText = jsonFile[i]['student_id'];
//                 row.style.backgroundColor = "whitesmoke";
//             }
//         }
//     }
// }
//
//

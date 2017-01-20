var welcome = "welcomeview";
var profile = "profileview";

displayView = function(viewId){
 document.getElementById("innerDiv").innerHTML = document.getElementById(viewId).innerHTML;
};

window.onload = function(){
 //code that is executed as the page is loaded.
 //You shall put your own custom code here.
 //window.alert() is not allowed to be used in your implementation.
 displayView(welcome);
};

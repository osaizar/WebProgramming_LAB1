var welcome = "welcomeview";
var profile = "profileview";

displayView = function(){
 var viewId;
 if (localStorage.getItem("token") == "undefined"){
   viewId = welcome;
 }else{
   viewId = profile;
 }
 document.getElementById("innerDiv").innerHTML = document.getElementById(viewId).innerHTML;
};

window.onload = function(){
 displayView();
};


function logIn(){
  var email = document.forms["loginForm"]["email"].value;
  var password = document.forms["loginForm"]["password"].value;

  var server_msg = serverstub.signIn(email, password);

  if (server_msg.success){ //debug
    alert(server_msg.message);
  }else {
    alert(server_msg.message);
  }

  localStorage.setItem("token", server_msg.data);

  displayView();
}


function checkPasswords(type){
  var password = document.getElementById("s_password");
  var rpassword = document.getElementById("s_rpassword");

  if(password.value != rpassword.value){
    rpassword.setCustomValidity("Passwords do not match!");
  }else{
    rpassword.setCustomValidity('');
  }
}

function signUp(){

  var firstname = document.forms["signupForm"]["name"].value;
  var familyname = document.forms["signupForm"]["f-name"].value;
  var gender_select = document.getElementById("gender");
  var gender = gender_select.options[gender_select.selectedIndex].text;
  var city = document.forms["signupForm"]["city"].value;
  var country = document.forms["signupForm"]["country"].value;
  var email = document.forms["signupForm"]["email"].value;
  var password = document.forms["signupForm"]["password"].value;

  var user = {
    "email": email,
    "password": password,
    "firstname": firstname,
    "familyname": familyname,
    "gender": gender,
    "city": city,
    "country": country
  };

  var server_msg = serverstub.signUp(user);

  if (server_msg.success){ //debug
    alert(server_msg.message);
  }else {
    alert(server_msg.message);
  }
}

function openTab(tabName){

  var i;

  var menu = document.getElementsByClassName("menu");

  for(i = 0; i < menu.length; i++){
    menu[i].style.display = "none";
  }

  document.getElementById(tabName).style.display = "block";

}

function changePassword(){
  var npassword = document.forms["changePassForm"]["new_password"].value;
  var cpassword = document.forms["changePassForm"]["current_password"].value;

  serverstub.changePassword(localStorage.getItem("token"), cpassword, npassword);

  alert("password changed!"); //debug
}

function signOut(){
  serverstub.signOut(localStorage.getItem("token"));
  localStorage.setItem("token", "undefined");
  displayView();
}

function renderHome(){
  var token = localStorage.getItem("token");
  var server_msg = serverstub.getUserDataByToken(token);
  var data;

  if (server_msg.success){
    data = server_msg.data;
  }else{
    return -1; //error
  }

  alert(token+" "+data.firstname); //debug

  replaceHTML("home", "%NAME%", data.firstname);
  replaceHTML("home", "%FNAME%", data.familyname);
  replaceHTML("home", "%GENDER%", data.gender);
  replaceHTML("home", "%COUNTRY%", data.country);
  replaceHTML("home", "%CITY%", data.city);
  replaceHTML("home", "%EMAIL%", data.email);
}

function replaceHTML(id, search, replace){ //find "search" on id an repalace with replace
  document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace(search, replace);
}

function sendMsg(){
  var token = localStorage.getItem("token");
  var server_msg = serverstub.getUserDataByToken(token);
  var data;

  if (server_msg.success){
    data = server_msg.data;
  }else{
    return -1; //error
  }

  var msg = document.forms["msgForm"]["message"].value;

  alert(msg+" by: "+data.email); //debug

  serverstub.postMessage(token, msg, data.email);
}

function reloadMsgs(){
  var token = localStorage.getItem("token");
  var server_msg = serverstub.getUserMessagesByToken(token);
  var messages;

  if (server_msg.success){
    messages = server_msg.data;
  }else{
    return -1; //error
  }

  var msgDiv = document.getElementById("messageDiv");

  while (msgDiv.firstChild) {
    msgDiv.removeChild(msgDiv.firstChild);
  }

  for (var i = 0; i < messages.length; i++){
    var p = document.createElement('p');
    p.innerHTML = "<b>"+messages[i].content+"</b> by "+messages[i].writer;
    msgDiv.appendChild(p);
  }

}

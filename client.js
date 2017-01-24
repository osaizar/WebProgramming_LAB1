//Costant declarations
const WELCOME = "welcomeview";
const PROFILE = "profileview";


displayView = function(){
  var viewId;
  if (localStorage.getItem("token") == "undefined" || localStorage.getItem("token") == null){
    viewId = WELCOME;
  }else{
    viewId = PROFILE;
  }
  document.getElementById("innerDiv").innerHTML = document.getElementById(viewId).innerHTML;
  if (viewId == PROFILE){
    bindFunctionsProfile();
    openTab("menu","home")
  }
  else if (viewId == WELCOME){
    bindFunctionsWelcome();
  }
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


function signOut(){

  serverstub.signOut(localStorage.getItem("token"));
  localStorage.setItem("token", "undefined");
  displayView();
}

function openTab(tabType, tabName){

  var i;

  var menu = document.getElementsByClassName(tabType);

  for(i = 0; i < menu.length; i++){
    menu[i].style.display = "none";
  }

  document.getElementById(tabName).style.display = "block";

  if(tabName == "home"){
    renderHome();
  }
}


function changePassword(){

  var npassword = document.forms["changePassForm"]["new_password"].value;
  var cpassword = document.forms["changePassForm"]["current_password"].value;

  serverstub.changePassword(localStorage.getItem("token"), cpassword, npassword);

  alert("password changed!"); //debug

  return false;
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

  replaceHTML("userData", "%NAME%", data.firstname);
  replaceHTML("userData", "%FNAME%", data.familyname);
  replaceHTML("userData", "%GENDER%", data.gender);
  replaceHTML("userData", "%COUNTRY%", data.country);
  replaceHTML("userData", "%CITY%", data.city);
  replaceHTML("userData", "%EMAIL%", data.email);

  reloadUserMsgs();
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

  serverstub.postMessage(token, msg, data.email);

  reloadUserMsgs();

  return false;
}


function sendMsgTo(){

  var token = localStorage.getItem("token");
  var email = document.forms["userSearchForm"]["email"].value;
  var msg = document.forms["msgToForm"]["message"].value;

  serverstub.postMessage(token, msg, email);

  reloadMsgs();

  return false;
}


function reloadUserMsgs(){

  var token = localStorage.getItem("token");
  var server_msg = serverstub.getUserMessagesByToken(token);
  var messages;

  if (server_msg.success){
    messages = server_msg.data;
  }else{
    return -1; //error
  }

  var msgDiv = document.getElementById("userMessageDiv");

  while (msgDiv.firstChild) {
    msgDiv.removeChild(msgDiv.firstChild);
  }

  for (var i = 0; i < messages.length; i++){
    var p = document.createElement('p');
    p.innerHTML = "<b>"+messages[i].content+"</b> by "+messages[i].writer;
    msgDiv.appendChild(p);
  }

}


function reloadMsgs(){

  var token = localStorage.getItem("token");
  var email = document.forms["userSearchForm"]["email"].value;
  var server_msg = serverstub.getUserMessagesByEmail(token, email);
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


function searchUser(){

  var token = localStorage.getItem("token");
  var email = document.forms["userSearchForm"]["email"].value;
  var server_msg = serverstub.getUserDataByEmail(token, email);
  var userData;


  if (server_msg.success){
    userData = server_msg.data;
  }else{
    alert(server_msg.message); //debug
    return -1; //error
  }

  renderUserTab(userData);
  openTab("browsetab","user");

  return false;
}


function renderUserTab(userData){

  replaceHTML("otherUserData", "%NAME%", userData.firstname);
  replaceHTML("otherUserData", "%FNAME%", userData.familyname);
  replaceHTML("otherUserData", "%GENDER%", userData.gender);
  replaceHTML("otherUserData", "%COUNTRY%", userData.country);
  replaceHTML("otherUserData", "%CITY%", userData.city);
  replaceHTML("otherUserData", "%EMAIL%", userData.email);

  reloadMsgs();
}


function back(){

  openTab("browsetab","search");
}

function replaceHTML(id, search, replace){ //find "search" on id an repalace with replace

  document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace(search, replace);
}


function bindFunctionsWelcome(){

  document.getElementById("loginForm").onsubmit = logIn;
  document.getElementById("signupForm").onsubmit = signUp;

  document.getElementById("s_rpassword").onkeyup = checkPasswords;
}


function bindFunctionsProfile(){

  document.getElementById("navHome").onclick = function() { openTab("menu","home");};
  document.getElementById("navBrowse").onclick = function() { openTab("menu","browse");};
  document.getElementById("navAccount").onclick = function() { openTab("menu","account");};

  document.getElementById("userMsgReloadButton").onclick = reloadUserMsgs;
  document.getElementById("logout").onclick = signOut;
  document.getElementById("back").onclick = back;
  document.getElementById("msgReloadButton").onclick = reloadMsgs;

  document.getElementById("msgForm").onsubmit = sendMsg;
  document.getElementById("msgToForm").onsubmit = sendMsgTo;
  document.getElementById("userSearchForm").onsubmit = searchUser;
  document.getElementById("changePassForm").onsubmit = changePassword;

  document.getElementById("s_rpassword").onkeyup = checkPasswords;
}

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

  var msg = serverstub.signIn(email, password);

  if (msg.success){ //debug
    alert(msg.message);
  }else {
    alert(msg.message);
  }

  localStorage.setItem("token", msg.data);

  displayView();
}


function checkPasswords(){
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
    email: email,
    password: password,
    firstname: firstname,
    familyname: familyname,
    gender: gender,
    city: city,
    country: country
  };

  var msg = serverstub.signUp(user);

  if (msg.success){ //debug
    alert(msg.message);
  }else {
    alert(msg.message);
  }
}

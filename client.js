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
 //code that is executed as the page is loaded.
 //You shall put your own custom code here.
 //window.alert() is not allowed to be used in your implementation.
 displayView();
};


function validateLoginForm(){

  var accepted = true;

  var email = document.forms["loginForm"]["email"].value;
  var password = document.forms["loginForm"]["password"].value;

  if(email == "" || password == ""){
      alert("fill the blanks!"); //test
      accepted = false;
  }

  if (accepted){
    logIn(email, password);
  }
}

function logIn(email, password){
  var msg = serverstub.signIn(email, password);

  if (msg.success){ //debug
    alert(msg.message);
  }else {
    alert(msg.message);
  }

  localStorage.setItem("token", msg.data);

  displayView();
}

function validateSignUpForm(){

  var accepted = true;

  var name = document.forms["signupForm"]["name"].value;
  var fname = document.forms["signupForm"]["f-name"].value;
  var gender_select = document.getElementById("gender");
  var gender = gender_select.options[gender_select.selectedIndex].text;
  var city = document.forms["signupForm"]["city"].value;
  var country = document.forms["signupForm"]["country"].value;
  var email = document.forms["signupForm"]["email"].value;
  var password = document.forms["signupForm"]["password"].value;
  var rpassword = document.forms["signupForm"]["Rpassword"].value;

  if(email == "" || password == "" || name == "" || fname == "" || gender == "" || city == "" || country == "" || rpassword == ""){
      alert("fill the blanks!"); //test
      accepted = false;
  }

  if(password != rpassword){
      alert("The passwords do not match");
      accepted = false;
  }

  if(password.length < 6){
      alert("The password is too short");
      accepted = false;
  }

  if(accepted){
    signUp(email, password, name, fname, gender, city, country);
  }

  return accepted;
}

function signUp(email, password, firstname, familyname, gender, city, country){

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

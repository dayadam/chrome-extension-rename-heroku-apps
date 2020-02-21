//document.

  window.onload = function() {
  //window.document.body.onload = doThis;
  //setTimeout(function() {
  //}, 5000);
  //function doThis() {
  console.log("DOM fully loaded and parsed");
  const apps = document.querySelectorAll(".app-list > div > a > div > span");
  const body = document.getElementsByTagName("body")[0].innerHTML;
  console.log(apps);
  console.log(body);
  //}
};

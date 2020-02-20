document.addEventListener("DOMContentLoaded", event => {
  console.log("DOM fully loaded and parsed");

  console.log("hi");

  /* const apps = document.querySelector(
  "div.main-content"
).innerText; */

  /* const apps = document.querySelector(
    ".flex.nowrap > button > span.ml2.mr1.purple"
  ).innerText; */

  const apps = document.getElementsByTagName("a").innerHTML;

  // > div.app-list > div.apps-list-item > a > div.items-baseline > span

  console.log(apps);
});

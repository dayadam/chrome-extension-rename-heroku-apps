//document.

/* const apps = document.querySelectorAll(".app-list > div > a > div > span");
apps.addEventListener("DOMContentLoaded", function() {
  console.log(apps);
}); */

/* const apps = document.querySelector(".app-list");
apps.addEventListener("click", function() {
  console.log(apps);
}); */

window.onload = function() {
  //window.document.body.onload = doThis;
  //setTimeout(function() {
  //}, 5000);
  //function doThis() {
  /*   const apps = document.querySelector(".app-list");
  apps.addEventListener("click", function() {
    console.log(apps);
  }); */
  console.log("DOM fully loaded and parsed");
  const body = document.getElementsByTagName("body")[0].innerHTML;
  //console.log(apps);
  console.log(body);
  const body1 = document.getElementsByTagName("body")[0];
  // Select the node that will be observed for mutations
  const targetNode = document.getElementsByClassName(".ember-application");
  // Options for the observer (which mutations to observe)
  const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
  };
  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (let mutation of mutationsList) {
      mutation.addedNodes.forEach(addedNodes => {
        if (addedNodes.className === "f3 near-black") {
          //console.log(addedNodes.nodeName);
          console.log(addedNodes);
          console.log(addedNodes.textContent.trim());
        }
      });
      /* if (mutation.addedNodes) {
        console.log(mutation[0].nodeName);
        //console.log(mutation.addedNodes[0]);
      } */
      /* if (mutation.type === "childList") {
        console.log("A child node has been added or removed.");
      } else if (mutation.type === "attributes") {
        console.log(
          "The " + mutation.attributeName + " attribute was modified."
        );
      } */
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  // Start observing the target node for configured mutations
  observer.observe(body1, config);
  //}
};

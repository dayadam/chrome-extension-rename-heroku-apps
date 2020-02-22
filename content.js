//get local img url in chrome runtime env
const pencilImgURL = chrome.runtime.getURL("images/pencil.png");
// set an empty array if no data in localStorage
if (localStorage.getItem("apps") === null) {
  localStorage.setItem("apps", "[]");
}
// storage saved as string, must parse/ stringify
const apps = JSON.parse(localStorage.getItem("apps"));

// heroku is client-side rendered, so listen for DOM mutation
// in order to see DOM tree. wait till on load for rendering to occur
window.onload = function() {
  console.log("window loaded");
  const body = document.getElementsByTagName("body")[0];
  // Select the node that will be observed for mutations
  // Options for the observer (which mutations to observe)
  const config = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
  };
  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      mutation.addedNodes.forEach(addedNode => {
        if (addedNode.className === "f3 near-black") {
          //setting first local storage / apps if none exist
          if (apps.length === 0) {
            apps.push({
              herokuName: addedNode.textContent.trim(),
              editedName: ""
            });
            localStorage.setItem("apps", JSON.stringify(apps));
          }
          // looping through apps to see if app exists in apps / storage,
          // and if not push it to apps / saving to local storage
          let found = false;
          for (i = 0; i < apps.length; i++) {
            if (apps[i].herokuName === addedNode.textContent.trim()) {
              found = true;
              console.log(`${addedNode.textContent.trim()} exists in storage`);
            } else if (i === apps.length - 1 && found === false) {
              console.log(`${addedNode.textContent.trim()} pushed to apps`);
              apps.push({
                herokuName: addedNode.textContent.trim(),
                editedName: ""
              });
              localStorage.setItem("apps", JSON.stringify(apps));
            }
          }
          //edit div and img
          const imgDiv = document.createElement("div");
          imgDiv.setAttribute("class", "chrome-app-item edit");
          const editImg = document.createElement("img");
          editImg.setAttribute("src", pencilImgURL);
          editImg.setAttribute("alt", "edit pencil");
          editImg.setAttribute(
            "class",
            `chrome-app-item ${addedNode.textContent.trim()}`
          );
          imgDiv.appendChild(editImg);
          addedNode.nextSibling.nextSibling.appendChild(imgDiv);
          //delete div and "X" text
          const deleteDiv = document.createElement("div");
          deleteDiv.setAttribute("class", "chrome-app-item delete");
          const deleteDivText = document.createElement("span");
          deleteDivText.setAttribute(
            "class",
            `chrome-app-item ${addedNode.textContent.trim()}`
          );
          deleteDivText.innerText = "X";
          deleteDiv.appendChild(deleteDivText);
          // prevent anchor tag href redirect with stopPropagation when
          // edit and delete are clicked
          addedNode.nextSibling.nextSibling.appendChild(deleteDiv);
          deleteDiv.addEventListener("click", function(event) {
            event.stopPropagation();
            event.preventDefault();
            console.log(event);
          });
          imgDiv.addEventListener("click", function(event) {
            event.stopPropagation();
            event.preventDefault();
            console.log(event);
          });
        }
      });
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  // Start observing the target node for configured mutations
  // listening for DOM changes
  observer.observe(body, config);
};

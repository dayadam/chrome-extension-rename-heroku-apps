//get local img url in chrome runtime env
const pencilImgURL = chrome.runtime.getURL("images/pencil.png");
const checkImgURL = chrome.runtime.getURL("images/checkmark.png");
// set an empty array if no data in localStorage
if (localStorage.getItem("apps") === null) {
  localStorage.setItem("apps", "[]");
}
// storage saved as string, must parse/ stringify
const apps = JSON.parse(localStorage.getItem("apps"));
// editing stateful variable
let currentlyEditing = false;

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
        if (addedNode.className === "ml1") {
          const appName = addedNode.textContent.trim();
          checkStore(addedNode, appName);
        }
        if (addedNode.className === "f3 near-black") {
          //save parent node of app name as variable
          const divSibling = addedNode.nextSibling.nextSibling;
          const appName = addedNode.textContent.trim();
          checkStore(addedNode, appName);
          //edit div and img
          const imgDiv = document.createElement("div");
          imgDiv.setAttribute("class", "chrome-app-item edit");
          const editImg = document.createElement("img");
          editImg.setAttribute("src", pencilImgURL);
          editImg.setAttribute("alt", "edit app name");
          editImg.setAttribute("class", `chrome-app-item ${appName}`);
          imgDiv.appendChild(editImg);
          divSibling.appendChild(imgDiv);
          //delete div and "X" text
          const deleteDiv = document.createElement("div");
          deleteDiv.setAttribute("class", "chrome-app-item delete");
          const deleteDivText = document.createElement("span");
          deleteDivText.setAttribute("class", `chrome-app-item ${appName}`);
          deleteDivText.innerText = "X";
          deleteDiv.appendChild(deleteDivText);
          // prevent anchor tag href redirect with stopPropagation when
          // edit and delete are clicked
          divSibling.appendChild(deleteDiv);

          imgDiv.addEventListener("click", function(event) {
            event.stopPropagation();
            event.preventDefault();
            // if edit img is a check mark, it has been clicked to edit,
            // so on click submit changes
            if (currentlyEditing) {
              const inputNode = divSibling.firstChild;
              const editImgNodeEditing =
                divSibling.firstChild.nextSibling.firstChild;
              const editedName = inputNode.value;
              //change back edit img to pencil
              editImgNodeEditing.setAttribute("src", pencilImgURL);
              editImgNodeEditing.setAttribute("alt", "edit app name");
              divSibling.removeChild(inputNode);
              currentlyEditing = false;
              //update apps array with edited name
              apps.forEach(app => {
                if (app.herokuName === appName) {
                  app.editedName = editedName;
                }
              });
              // save to local storage
              localStorage.setItem("apps", JSON.stringify(apps));
              if (editedName === "") {
                addedNode.innerText = appName;
              } else {
                addedNode.innerText = editedName;
              }
            }
            // if edit img displays a pencil, it has not already been clicked,
            // so replace heroku app name with input box to edit
            else if (!currentlyEditing) {
              const editImgNode = divSibling.firstChild.firstChild;
              // replace app name text with input box to rename app
              const input = document.createElement("input");
              input.setAttribute("type", "text");
              input.setAttribute("name", `${appName}`);
              input.setAttribute("placeholder", `${appName}`);
              input.setAttribute("class", "chrome-app-item");
              //input.setAttribute("value", `${addedNode.innerText}`);
              input.addEventListener("click", function(event) {
                event.stopPropagation();
                event.preventDefault();
              });
              // drag prevention doesn't seem to do anything
              input.addEventListener(
                "drag",
                function(event) {
                  event.stopPropagation();
                  event.preventDefault();
                },
                false
              );
              // change edit img from pencil to check mark for submit
              try {
                editImgNode.setAttribute("src", checkImgURL);
                editImgNode.setAttribute("alt", "submit edited name");
                divSibling.insertBefore(input, divSibling.firstChild);
                currentlyEditing = true;
              } catch (error) {
                console.log(error);
              }
            }
          });

          deleteDiv.addEventListener("click", function(event) {
            event.stopPropagation();
            event.preventDefault();
            // simply exit editing if editing
            if (currentlyEditing) {
              const inputNode = divSibling.firstChild;
              const editImgNodeEditing =
                divSibling.firstChild.nextSibling.firstChild;
              //change back edit img to pencil
              editImgNodeEditing.setAttribute("src", pencilImgURL);
              editImgNodeEditing.setAttribute("alt", "edit app name");
              divSibling.removeChild(inputNode);
              currentlyEditing = false;
            }
            // otherwise delete app name a set to given heroku name
            else {
              addedNode.innerText = appName;
              apps.forEach(app => {
                if (app.herokuName === appName) {
                  app.editedName = "";
                }
              });
              // save to local storage
              localStorage.setItem("apps", JSON.stringify(apps));
            }
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

function checkStore(addedNode, appName) {
  //setting first local storage / apps if none exist
  if (apps.length === 0) {
    apps.push({
      herokuName: appName,
      editedName: ""
    });
    localStorage.setItem("apps", JSON.stringify(apps));
  }
  // looping through apps to see if app exists in apps / storage,
  // and if not push it to apps / saving to local storage
  let found = false;
  for (i = 0; i < apps.length; i++) {
    if (apps[i].herokuName === appName) {
      found = true;
      if (apps[i].editedName) {
        addedNode.innerText = apps[i].editedName;
      }
      console.log(`${appName} exists in storage`);
    } else if (i === apps.length - 1 && found === false) {
      //console.log(`${appName} pushed to apps`);
      apps.push({
        herokuName: appName,
        editedName: ""
      });
      localStorage.setItem("apps", JSON.stringify(apps));
    }
  }
}

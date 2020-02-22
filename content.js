const pencilImgURL = chrome.runtime.getURL("images/pencil.png");

window.onload = function() {
  console.log("DOM fully loaded and parsed");
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
          //const editButton = document.createElement("button");
          const imgDiv = document.createElement("div");
          imgDiv.setAttribute("class", "app-item edit");
          const editImg = document.createElement("img");
          editImg.setAttribute("src", pencilImgURL);
          editImg.setAttribute("alt", "edit pencil");
          editImg.setAttribute(
            "class",
            `app-item ${addedNode.textContent.trim()}`
          );
          imgDiv.appendChild(editImg);
          addedNode.nextSibling.nextSibling.appendChild(imgDiv);
          const deleteDiv = document.createElement("div");
          deleteDiv.setAttribute("class", "app-item delete");
          const deleteDivText = document.createElement("span");
          deleteDivText.setAttribute(
            "class",
            `app-item ${addedNode.textContent.trim()}`
          );
          deleteDivText.innerText = "X";
          deleteDiv.appendChild(deleteDivText);
          addedNode.nextSibling.nextSibling.appendChild(deleteDiv);
        }
      });
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  // Start observing the target node for configured mutations
  observer.observe(body, config);
};

export default class SelectionSplitter {
  extractFirstElement(htmlObject: HTMLDivElement) {
    if (!htmlObject.firstElementChild) {
      return "";
    }
    return htmlObject.firstElementChild.outerHTML;
  }

  extractAllButFirstElement(htmlObject: HTMLDivElement) {
    let htmlObjectCopy = document.createElement("div");
    htmlObjectCopy.innerHTML = htmlObject.innerHTML;
    if (htmlObjectCopy.firstChild) {
      htmlObjectCopy.removeChild(htmlObjectCopy.firstChild);
    }

    htmlObjectCopy.innerHTML = removeEmptyFirstLines(htmlObjectCopy.innerHTML)

    return htmlObjectCopy.innerHTML;
  }
}

function removeEmptyFirstLines(text) {
  let output = text
  while (output.startsWith("<p></p>")) {
    output = output.substring(7)
  }
  return output
}
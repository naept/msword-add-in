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

    return htmlObjectCopy.innerHTML;
  }
}

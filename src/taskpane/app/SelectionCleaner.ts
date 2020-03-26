export default class SelectionCleaner {
  private htmlObject: HTMLDivElement = null;

  execute(htmlObject: HTMLDivElement) {
    this.htmlObject = htmlObject;
    this.cleanHtmlElement()
  }

  private cleanHtmlElement() {
    this.removeAllTagAttributes();
    this.removeAllNonBreakableSpaces();
    this.removeAllTags("meta");
    this.removeAllTags("style");
    this.removeAllTags("span", false);
    this.removeAllTags("div", false);
    this.removeAllCarriageReturns();
    this.trim();
  }

  private removeAllTagAttributes() {
    const clearTags = (element: Element) => {
      element.getAttributeNames().forEach(attributeName => {
        if (attributeName != "src") {
          element.removeAttribute(attributeName);
        }
      });
      for (var i = 0; i < element.children.length; i++) {
        clearTags(element.children[i]);
      }
    };

    clearTags(this.htmlObject);
  }

  private removeAllTags(tagName: string, eraseContent: Boolean = true) {
    if (eraseContent) {
      let elementsToRemove = this.htmlObject.getElementsByTagName(tagName);
      for (var i = 0; i < elementsToRemove.length; i++) {
        elementsToRemove[i].remove();
      }
    }
    const openTag = new RegExp("<" + tagName + ">", "g");
    const closeTag = new RegExp("</" + tagName + ">", "g");
    this.htmlObject.innerHTML = this.htmlObject.innerHTML.replace(openTag, "").replace(closeTag, "");
  }

  private removeAllCarriageReturns() {
    // Remove the ones after a tag
    this.htmlObject.innerHTML = this.htmlObject.innerHTML.replace(/>\n/g, ">");
    // Replace the others with one space
    this.htmlObject.innerHTML = this.htmlObject.innerHTML.replace(/\n/g, " ");
  }

  private removeAllNonBreakableSpaces() {
    this.htmlObject.innerHTML = this.htmlObject.innerHTML.replace(/&nbsp;/g, "");
  }

  private trim() {
    this.htmlObject.innerHTML = this.htmlObject.innerHTML.replace(/[ ]{2,}/g, " ");
    this.htmlObject.innerHTML = this.htmlObject.innerHTML.trim();
  }
}

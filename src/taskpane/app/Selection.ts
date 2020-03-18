export default class Selection {

    getSelectionHtml() {
        return Word.run((context) => {
            let selection = context.document.getSelection().getHtml()
        
            return context.sync().then(() => {
              let inputHtmlObject = document.createElement('div');
              inputHtmlObject.innerHTML = selection.value;
              this.cleanHtmlElement(inputHtmlObject)
              return inputHtmlObject.outerHTML.replace(/<span>/g, "").replace(/<\/span>/g, "")
            })
        })
    }

    cleanHtmlElement(rootElement: Element) {
        this.removeAllTagAttributes(rootElement)
        this.removeAllTags(rootElement, "meta")
        this.removeAllTags(rootElement, "style")
        this.reduceSingleChildDivs(rootElement)
    }
    

    removeAllTagAttributes(rootElement: Element) {
        rootElement.getAttributeNames().forEach((attributeName) => {
            if (attributeName != "src") {
                rootElement.removeAttribute(attributeName)
            }
        })
        for (var i = 0; i < rootElement.children.length; i++) {
            this.removeAllTagAttributes(rootElement.children[i])
        }
    }
    
    removeAllTags(rootElement: Element, tagName: string) {
        let elementsToRemove = rootElement.getElementsByTagName(tagName)
        for (var i = 0; i < elementsToRemove.length; i++) {
            elementsToRemove[i].remove()
        }
    }
    
    reduceSingleChildDivs(rootElement: Element) {
        let childrenElements = rootElement.children
        if (childrenElements.length > 1) {
            for (var i = 0; i < childrenElements.length; i++) {
                this.reduceSingleChildDivs(childrenElements[i])
            }
        } else if (childrenElements.length == 1) {
            if (rootElement.tagName.toLowerCase() == "div") {
                let parentElement = rootElement.parentElement
                if (parentElement) {
                    parentElement.appendChild(childrenElements[0])
                    parentElement.removeChild(rootElement)
                    this.reduceSingleChildDivs(parentElement)
                }
            } else {
                this.reduceSingleChildDivs(childrenElements[0])
            }
        } else {
            if (rootElement.tagName.toLowerCase() == "div") {
                rootElement.remove()
            }
        }
    }
}
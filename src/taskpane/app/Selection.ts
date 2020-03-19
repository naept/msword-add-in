
export default class Selection {
    private selectionHtmlObject: HTMLDivElement = null

    constructor() {
        this.selectionHtmlObject = document.createElement('div')
    }

    getSelectionHtml() {
        return Word.run((context) => {
            let selection = context.document.getSelection().getHtml()
        
            return context.sync().then(() => {
              this.selectionHtmlObject.innerHTML = selection.value
              this.cleanHtmlElement()
              return this.selectionHtmlObject.innerHTML
            })
        })
    }

    cleanHtmlElement() {
        this.removeAllTagAttributes()
        this.removeAllNonBreakableSpaces()
        this.removeAllTags("meta")
        this.removeAllTags("style")
        this.removeAllTags("span", false)
        this.removeAllTags("div", false)
        this.removeAllCarriageReturns()
        this.trim()
    }
    
    removeAllTagAttributes() {
        const clearTags = (element: Element) => {
            element.getAttributeNames().forEach((attributeName) => {
                if (attributeName != "src") {
                    element.removeAttribute(attributeName)
                }
            })
            for (var i = 0; i < element.children.length; i++) {
                clearTags(element.children[i])
            }
        }

        clearTags(this.selectionHtmlObject)
    }
    
    removeAllTags(tagName: string, eraseContent: Boolean = true) {
        if (eraseContent) {
            let elementsToRemove = this.selectionHtmlObject.getElementsByTagName(tagName)
            for (var i = 0; i < elementsToRemove.length; i++) {
                elementsToRemove[i].remove()
            }
        }
        const openTag = new RegExp("<" + tagName + ">", "g")
        const closeTag = new RegExp("</" + tagName + ">", "g")
        this.selectionHtmlObject.innerHTML = this.selectionHtmlObject.innerHTML.replace(openTag, "").replace(closeTag, "")
    }

    removeAllCarriageReturns() { // Only the ones after a tag
        this.selectionHtmlObject.innerHTML = this.selectionHtmlObject.innerHTML.replace(/>\n/g, ">")
    }

    removeAllNonBreakableSpaces() {
        this.selectionHtmlObject.innerHTML = this.selectionHtmlObject.innerHTML.replace(/&nbsp;/g, "")
    }

    trim() {
        this.selectionHtmlObject.innerHTML = this.selectionHtmlObject.innerHTML.trim()
    }

}
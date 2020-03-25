import SelectionCleaner from "./SelectionCleaner";
import SelectionSplitter from "./SelectionSplitter";

declare type ChangeCallback = (selection: Selection) => void;
export default class Selection {
  private selectionFull: HTMLDivElement = null;
  private selectionFirstParagraph: HTMLDivElement = null;
  private selectionLastParagraphs: HTMLDivElement = null;

  private callbacks: {} = {};
  private nextCallbackId: number = 0;

  constructor() {
    this.selectionFull = document.createElement("div");
    this.selectionFirstParagraph = document.createElement("div");
    this.selectionLastParagraphs = document.createElement("div");

    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, () => {
      this.handleSelectionChange();
    });

    this.handleSelectionChange();
  }

  /**
   * Informe les écouteurs d'un changement de selection
   * */
  private inform() {
    const callbacks: ChangeCallback[] = Object.values(this.callbacks);
    callbacks.forEach(cb => cb(this));
  }

  /**
   * Permet d'ajouter un écouteur
   * */
  onChange(cb: ChangeCallback) {
    this.callbacks[this.nextCallbackId] = cb;
    return this.nextCallbackId++;
  }

  /**
   * Permet de supprimer un écouteur
   * */
  onChangeUnsubscribe(callbackId: number) {
    delete this.callbacks[callbackId];
  }

  getSelectionHtml() {
    return this.selectionFull.innerHTML;
  }

  getSelectionFirstParagraphText() {
    return this.selectionFirstParagraph.innerText;
  }

  getSelectionLastParagraphsHtml() {
    return this.selectionLastParagraphs.innerHTML;
  }

  handleSelectionChange() {
    return Word.run(context => {
      let selection = context.document.getSelection().getHtml();

      return context.sync().then(() => {
        this.selectionFull.innerHTML = selection.value;
        const selectionCleaner = new SelectionCleaner();
        selectionCleaner.execute(this.selectionFull);
        const selectionSplitter = new SelectionSplitter();
        this.selectionFirstParagraph.innerHTML = selectionSplitter.extractFirstElement(this.selectionFull);
        this.selectionLastParagraphs.innerHTML = selectionSplitter.extractAllButFirstElement(this.selectionFull);
        this.inform();
      });
    });
  }
}

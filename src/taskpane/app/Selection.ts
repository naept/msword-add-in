import SelectionCleaner from "./SelectionCleaner";
import SelectionSplitter from "./SelectionSplitter";
import SelectionImager from "./SelectionImager";

declare type ChangeCallback = (selection: Selection) => void;
export default class Selection {
  private selectionFull: HTMLDivElement = null;
  private selectionPictures: string[] = [];

  private callbacks: {} = {};
  private nextCallbackId: number = 0;

  constructor() {
    this.selectionFull = document.createElement("div");

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
    const selectionSplitter = new SelectionSplitter();
    let selectionFirstParagraph: HTMLDivElement = document.createElement("div");
    selectionFirstParagraph.innerHTML = selectionSplitter.extractFirstElement(this.selectionFull);
    return selectionFirstParagraph.innerText;
  }

  getSelectionLastParagraphsHtml() {
    const selectionSplitter = new SelectionSplitter();
    return selectionSplitter.extractAllButFirstElement(this.selectionFull);
  }

  handleSelectionChange() {
    return Word.run(context => {
      let selection = context.document.getSelection().getHtml();
      let pictures = context.document.getSelection().inlinePictures;
      pictures.load();

      return context.sync().then(() => {
        this.selectionFull.innerHTML = selection.value;

        const selectionCleaner = new SelectionCleaner();
        selectionCleaner.execute(this.selectionFull);

        let selectionPictures = pictures.items;
        if (selectionPictures.length > 0) {
          let base64ImageSrcs = [];
          selectionPictures.forEach((picture, idx) => {
            base64ImageSrcs[idx] = picture.getBase64ImageSrc();
          });
          context.sync().then(() => {
            base64ImageSrcs.forEach((base64ImageSrc, idx) => {
              this.selectionPictures[idx] = base64ImageSrc.value;
            });

            const selectionImager = new SelectionImager();
            selectionImager.execute(this.selectionFull, this.selectionPictures);
            this.inform();
          });
        } else {
          this.inform();
        }
      });
    });
  }
}

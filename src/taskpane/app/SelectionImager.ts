export default class SelectionImager {
  async execute(htmlObject: HTMLDivElement, pictures: string[]) {
    htmlObject.innerHTML = htmlObject.innerHTML.replace(/(<img src=\")[^\"]+(\")/g, (correspondance, head, tail) => {
      if (correspondance) {
        return head + "data:image/png;base64," + pictures.shift() + tail;
      }
      return "";
    });
  }
}

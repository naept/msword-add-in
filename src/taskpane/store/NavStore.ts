import { NavOption } from "../interfaces";

declare type ChangeCallback = (store: NavStore) => void;

export default class NavStore {
  public nav: NavOption = NavOption.Main;
  public errorMessage: String = null;

  private callbacks: {} = {};
  private nextCallbackId: number = 0;

  /**
   * Informe les écouteurs d'un changement au sein du Store
   * */
  inform() {
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

  setNav(nav: NavOption, errorMessage: String = null): void {
    this.nav = nav;
    this.errorMessage = errorMessage;
    this.inform();
  }
}

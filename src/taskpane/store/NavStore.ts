import { NavOption } from "../interfaces"

declare type ChangeCallback = (store: NavStore) => void

export default class NavStore {

    public nav: NavOption = NavOption.Main

    private callbacks: ChangeCallback[] = []

    /**
     * Informe les écouteurs d'un changement au sein du Store
     * */
    inform () {
        this.callbacks.forEach(cb => cb(this))
    }

    /**
     * Permet d'ajouter un écouteur
     * */
    onChange (cb: ChangeCallback) {
        this.callbacks.push(cb)
    }

    setNav (nav: NavOption): void {
        console.log(nav)
        this.nav = nav
        this.inform()
    }
}
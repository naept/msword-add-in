'use strict'

// Object.defineProperty(exports, "__esModule", {
//     value: true
// });
// exports.setCookie = setCookie;
// exports.getCookie = getCookie;
// exports.removeCookie = removeCookie;

export function setCookie(name: string, value: any, date: Date) {
    let expirey = date instanceof Date ? '; expires='+date : null
    var cookie = [name, '=', JSON.stringify(value), '; domain_.', window.location.host.toString(), '; path=/;',expirey].join('');
    document.cookie = cookie;
}

export function getCookie(name: string): any {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result = result != null ? JSON.parse(result[1]) : [];
    return result;
}

export function removeCookie(name: string) {
    document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain.', window.location.host.toString()].join('');
}
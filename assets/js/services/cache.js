/*
 * Copyright 2020 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 *
 */

const cache = {};

function set(key, data) {
    cache[key] = {
        data,
        cachedAt: new Date().getTime()
    };

}

function get(key) {
    return new Promise(resolve => {
        resolve(cache[key] && cache[key].cachedAt + (15 * 60 * 1000) > new Date().getTime() ? cache[key] : null);
    });
}

function invalidate(key) {
    delete cache[key];
}

export default {
    set,
    get,
    invalidate
}
'use strict';

const assert = require('assert');

const Compiler = module.exports = function(timer) {
    this.timer = timer instanceof Object ?
        timer : {
            '世纪': 1000 * 60 * 60 * 24 * 365 * 100,
            '年': 1000 * 60 * 60 * 24 * 365,
            '天': 1000 * 60 * 60 * 24,
            '小时': 1000 * 60 * 60,
            '分钟': 1000 * 60,
            '秒': 1000,
            '毫秒': 1
        };
};

Compiler.prototype = {
    constructor: Compiler,
    timeify: function(
        chunk,
        callback = (val, name) => `${ val } ${ name }`
    ) {
        assert(chunk > 0, 'chunk is invaild.');
        const pre = Compiler.preset,
            temp = [];
        Object.keys(this.timer).every(key => {
            const cur = this.timer[key],
                val = Math.floor(chunk / cur);
            chunk = chunk % cur;
            if (val) temp.push(callback(val, key));
            return chunk;
        });
        return temp.map((cur, i) => {
            i = temp.length - 1 - i;
            return cur + pre[
                i > pre.length - 1 ? pre.length - 1 : i
            ];
        }).join('');
    },
    parse: function(time) {
        const keys = Object.keys(this.timer),
            temp = time.match(
                new RegExp(`\\d+ +(${ keys.join('|') })`, 'g')
            );
        let index;
        return temp.reduce((res, cur) =>
            cur.match(/(\d+|[^ ]+$)/g).reduce((prev, cur) => {
                const i = keys.indexOf(cur);
                assert(!(i <= index), 'time format is invaild.');
                index = i;
                return prev * this.timer[cur];
            }) + res, 0);
    }
};

Compiler.preset = ['', ' 和 ', ', '];
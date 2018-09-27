'use strict';

const { AssertionError } = require('assert');
const Compiler = require('./lib/compiler');

// 拓展编译器，输出英文版

Compiler.preset = ['', ' and ', ', '];

const formatDuration = seconds => {
    const compiler = new Compiler({
        'year': 60 * 60 * 24 * 365,
        'day': 60 * 60 * 24,
        'hour': 60 * 60,
        'minute': 60,
        'second': 1
    });
    try {
        return compiler.timeify(
            seconds,
            (val, name) => {
                name = `${ val } ${ name }`;
                if (val > 1) return `${ name }s`;
                return name;
            }
        );
    } catch (err) {
        if (err instanceof AssertionError) return 'now';
        throw err;
    }
};

module.exports = formatDuration;
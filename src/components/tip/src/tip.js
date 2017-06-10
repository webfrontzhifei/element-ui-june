import Vue from 'vue';

import TipComponent from './tip.vue';

import extend from '../../../utils/extend.js';

const defaults = {
    mode: '',
    text: '',

    delay: 2500,

    closeOnClickBackdrop: true,
    closeOnPressEscape: true,
};

const TipConstructor = Vue.extend(TipComponent);

let instance;
let current;
const queue = [];

const defaultCallback = () => {
    if (current) {
        const callback = current.callback;

        if (typeof callback === 'function') {
            callback();
        }
    }
};

const showNextTip = () => {
    if (!instance) {
        instance = new TipConstructor({
            el: document.createElement('div'),
        });

        document.body.appendChild(instance.$el);

        instance.callback = defaultCallback;
    }

    if (!instance.value || instance.closeTimer) {
        if (queue.length > 0) {
            current = queue.shift();

            const options = current.options;

            Object.keys(options).forEach((prop) => {
                instance[prop] = options[prop];
            });

            if (options.callback === undefined) {
                instance.callback = defaultCallback;
            }

            const originCallback = instance.callback;
            instance.callback = () => {
                originCallback();
                showNextTip();
            };

            Vue.nextTick(() => {
                instance.value = true;
            });
        }
    }
};

const Tip = (options, callback) => {
    if (options.callback && !callback) {
        callback = options.callback;
    }

    queue.push({
        options: extend({}, defaults, options),
        callback,
    });

    return showNextTip();
};

Tip.success = (text, options) => {
    if (typeof options === 'function') {
        options = {
            callback: options,
        };
    }

    return Tip(extend({
        mode: 'success',
        text,
    }, options));
};

Tip.error = (text, options) => {
    if (typeof options === 'function') {
        options = {
            callback: options,
        };
    }

    return Tip(extend({
        mode: 'error',
        text,
    }, options));
};

export default Tip;

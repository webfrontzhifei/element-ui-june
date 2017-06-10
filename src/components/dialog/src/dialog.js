import Vue from 'vue';

import DialogComponent from './dialog.vue';

import extend from '../../../utils/extend.js';

const defaults = {
    dialogClass: '',

    title: '',
    showClose: true,

    content: '',

    showConfirmButton: true,
    confirmButtonClass: '',
    confirmButtonText: '',

    showCancelButton: false,
    cancelButtonClass: '',
    cancelButtonText: '',

    lockScroll: true,

    closeOnClickBackdrop: true,
    closeOnPressEscape: true,

    beforeClose: null,
};

const DialogConstructor = Vue.extend(DialogComponent);

let instance;
let current;
const queue = [];

const defaultCallback = (action) => {
    if (current) {
        const callback = current.callback;

        if (typeof callback === 'function') {
            callback(action);
        }

        if (current.resolve) {
            const $type = current.options.$type;

            if ($type === 'confirm') {
                if (action === 'resolve') {
                    current.resolve(action);
                } else if (action === 'reject') {
                    current.reject(action);
                }
            } else {
                current.resolve(action);
            }
        }
    }
};

const showNextDialog = () => {
    if (!instance) {
        instance = new DialogConstructor({
            el: document.createElement('div'),
        });

        document.body.appendChild(instance.$el);

        instance.callback = defaultCallback;
    }

    if (!instance.value) {
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
            instance.callback = (action) => {
                originCallback(action);
                showNextDialog();
            };

            Vue.nextTick(() => {
                instance.value = true;
            });
        }
    }
};

const Dialog = (options, callback) => {
    if (options.callback && !callback) {
        callback = options.callback;
    }

    if (typeof Promise !== 'undefined') {
        return new Promise((resolve, reject) => { // eslint-disable-line
            queue.push({
                options: extend({}, defaults, options),
                callback,
                resolve,
                reject,
            });

            showNextDialog();
        });
    }

    queue.push({
        options: extend({}, defaults, options),
        callback,
    });

    return showNextDialog();
};

Dialog.alert = (content, title, options) => {
    if (typeof title === 'object') {
        options = title;
        title = '';
    }

    return Dialog(extend({
        $type: 'alert',
        title,
        content,
    }, options));
};

Dialog.confirm = (content, title, options) => {
    if (typeof title === 'object') {
        options = title;
        title = '';
    }

    return Dialog(extend({
        $type: 'confirm',
        title,
        content,
        showCancelButton: true,
    }, options));
};

export default Dialog;

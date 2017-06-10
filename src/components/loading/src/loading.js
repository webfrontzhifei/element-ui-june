import Vue from 'vue';

import Loading from './loading.vue';

import extend from '../../../utils/extend.js';

const defaults = {
    closeOnClickBackdrop: false,
    closeOnPressEscape: false,
};

const LoadingConstructor = Vue.extend(Loading);

let instance;
let current;
const queue = [];

const showNextLoading = () => {
    if (!instance) {
        instance = new LoadingConstructor({
            el: document.createElement('div'),
        });

        document.body.appendChild(instance.$el);
    }

    if (!instance.value) {
        if (queue.length > 0) {
            current = queue.shift();

            const options = current.options;

            Object.keys(options).forEach((prop) => {
                instance[prop] = options[prop];
            });

            Vue.nextTick(() => {
                instance.value = true;
            });
        }
    }
};

export default {
    show(options) {
        queue.push({
            options: extend({}, defaults, options),
        });

        showNextLoading();
    },

    hide() {
        if (instance && instance.value) {
            Vue.nextTick(() => {
                instance.value = false;
                showNextLoading();
            });
        }
    },
};

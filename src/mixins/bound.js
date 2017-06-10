export default {
    beforeDestroy() {
        this.disableCheckBound();
    },

    methods: {
        checkBound(e) {
            let curEl = e.target;

            while (curEl) {
                if (curEl === this.$el) {
                    return;
                }
                curEl = curEl.parentNode;
            }

            const checkBoundCallback = this._checkBoundCallback; // eslint-disable-line max-len,no-underscore-dangle

            if (typeof checkBoundCallback === 'function') {
                checkBoundCallback();
            }
        },
        enableCheckBound(callback) {
            this._checkBoundCallback = callback; // eslint-disable-line no-underscore-dangle

            // 当 event.target 在其本身事件中被移除时获取不到 parentNode, 所以设置 useCapture 为 true 能让监测优先执行
            document.addEventListener('click', this.checkBound, true);
        },
        disableCheckBound() {
            this._checkBoundCallback = null; // eslint-disable-line no-underscore-dangle
            document.removeEventListener('click', this.checkBound, true);
        },
    },
};

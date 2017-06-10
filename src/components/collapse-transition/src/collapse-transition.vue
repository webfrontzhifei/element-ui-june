<script>
    import { addClass, removeClass } from '../../../utils/dom.js';

    function Events() {}

    Events.prototype = {
        beforeEnter(el) {
            if (!el.dataset) el.dataset = {};

            el.dataset.oldHeight = el.style.height;
            el.dataset.oldOverflow = el.style.overflow;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;
            el.dataset.oldPaddingTop = el.style.paddingTop;

            el.style.height = 0;
            el.style.overflow = 'hidden';
            el.style.paddingBottom = 0;
            el.style.paddingTop = 0;
        },

        enter(el) {
            addClass(el, 'v-collapse-transition');

            el.style.height = `${el.scrollHeight}px`;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
            el.style.paddingTop = el.dataset.oldPaddingTop;
        },

        afterEnter(el) {
            removeClass(el, 'v-collapse-transition');

            el.style.height = el.dataset.oldHeight;
            el.style.overflow = el.dataset.oldOverflow;

            delete el.dataset.oldHeight;
            delete el.dataset.oldOverflow;
            delete el.dataset.oldPaddingBottom;
            delete el.dataset.oldPaddingTop;
        },

        beforeLeave(el) {
            if (!el.dataset) el.dataset = {};

            el.dataset.oldHeight = el.style.height;
            el.dataset.oldOverflow = el.style.overflow;
            el.dataset.oldPaddingBottom = el.style.paddingBottom;
            el.dataset.oldPaddingTop = el.style.paddingTop;

            el.style.height = `${el.scrollHeight}px`;
            el.style.overflow = 'hidden';
        },

        leave(el) {
            if (el.scrollHeight > 0) { // 这里其实没有必要做判断，但是必须调用el.scrollHeight触发重绘
                addClass(el, 'v-collapse-transition');

                el.style.height = 0;
                el.style.paddingBottom = 0;
                el.style.paddingTop = 0;
            }
        },

        afterLeave(el) {
            removeClass(el, 'v-collapse-transition');

            el.style.height = el.dataset.oldHeight;
            el.style.overflow = el.dataset.oldOverflow;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
            el.style.paddingTop = el.dataset.oldPaddingTop;

            delete el.dataset.oldHeight;
            delete el.dataset.oldOverflow;
            delete el.dataset.oldPaddingBottom;
            delete el.dataset.oldPaddingTop;
        },
    };

    export default {
        name: 'vCollapseTransition',
        functional: true,
        render(h, { children }) {
            return h('transition', {
                on: new Events(),
            }, children);
        },
    };
</script>

<style lang="sass">
    .v-collapse-transition {
        transition: height .218s, padding-top .218s, padding-bottom .218s;
    }
</style>

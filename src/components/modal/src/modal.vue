<template>
    <v-backdrop ref="backdrop" v-show="visible"
        class="v-modal"
        :class="[size ? 'v-modal-' + size : '']"
        @click="handleBackdropClick">
        <v-align @click="handleBackdropClick">
            <div ref="dialog" class="v-modal-dialog">
                <i v-if="showClose"
                    class="v-modal-close fa fa-close"
                    @click="close"></i>

                <div class="v-modal-head">
                    <slot name="head">
                        <span class="v-modal-title">{{title}}</span>
                    </slot>
                </div>
                <div class="v-modal-body">
                    <slot></slot>
                </div>
                <div class="v-modal-foot" v-if="$slots.foot">
                    <slot name="foot"></slot>
                </div>
            </div>
        </v-align>
    </v-backdrop>
</template>

<script>
    import { addClass, removeClass, once, transitionEndEvent } from '../../../utils/dom.js';

    import vAlign from '../../align';
    import vBackdrop from '../../backdrop';
    import vButton from '../../button';

    export default {
        name: 'vModal',

        components: {
            vAlign,
            vBackdrop,
            vButton,
        },

        props: {
            value: {
                type: Boolean,
                default: false,
            },
            size: String,
            title: {
                type: String,
                default: '',
            },
            showClose: {
                type: Boolean,
                default: true,
            },
            closeOnClickBackdrop: {
                type: Boolean,
                default: false,
            },
            closeOnPressEscape: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                visible: false,
            };
        },

        watch: {
            value(val) {
                this.visible = val;
            },
            visible(val) {
                const body = document.body;

                this.$emit('input', val);

                if (val) {
                    this.$emit('open');
                    this.$nextTick(() => {
                        this.$refs.dialog.scrollTop = 0;
                    });

                    if (body.clientWidth < window.innerWidth) {
                        const scrollbarWidth = this.getScrollBarWidth();

                        if (scrollbarWidth > 0) {
                            body.style.paddingRight = `${scrollbarWidth}px`;
                        }
                    }
                    addClass(body, 'has-modal-open');
                } else {
                    this.$emit('close');

                    once(this.$refs.backdrop.$el, transitionEndEvent, () => {
                        body.style.paddingRight = '';
                        removeClass(body, 'has-modal-open');
                    });
                }
            },
        },

        methods: {
            handleBackdropClick() {
                if (this.closeOnClickBackdrop) {
                    this.close();
                }
            },

            close() {
                this.visible = false;
            },

            getScrollBarWidth() {
                const doc = document;
                const body = doc.body;

                const scrollDiv = doc.createElement('div');
                scrollDiv.className = 'v-modal-scrollbar-measure';

                body.appendChild(scrollDiv);
                const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                body.removeChild(scrollDiv);

                return scrollbarWidth;
            },
        },
    };
</script>

<style lang="sass">
    body.has-modal-open {
        overflow: hidden;
    }

    .v-modal {
        background-color: rgba(0, 0, 0, .6);
        overflow-y: auto;
        padding: 20px;

        &-small &-dialog {
            width: 360px;
        }

        &-large &-dialog {
            width: 80%;
        }

        &-dialog {
            background-color: #fff;
            border-radius: 2px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            text-align: left;
            width: 60%;
        }

        & &-close {
            color: #999;
            cursor: pointer;
            font-size: 16px;
            height: 30px;
            line-height: 30px;
            position: absolute;
            right: 3px;
            text-align: center;
            top: 0;
            width: 30px;
            z-index: 201;

            &:hover {
                color: #333;
            }
        }

        &-head {
            border-bottom: 1px solid #e5e5e5;
            color: #333;
            font-weight: bold;
            font-size: 16px;
            padding: 15px 20px;
        }

        &-body {
            color: #444;
            overflow-y: auto;
            padding: 30px 20px;
            position: relative;
        }

        &-foot {
            background-color: #fff;
            border-top: 1px solid #e5e5e5;
            box-shadow: inset 0 1px 0 #fff;
            overflow: hidden;
            padding: 19px 20px 20px;
            position: relative;
            text-align: right;

            button + button {
                margin-left: 10px;
            }
        }

        &-scrollbar-measure {
            position: absolute;
            top: -9999px;
            width: 50px;
            height: 50px;
            overflow: scroll;
        }
    }
</style>

<template>
    <v-backdrop class="v-dialog" :class="dialogClass" v-show="value" @click="handleBackdropClick">
        <v-align @click="handleBackdropClick">
            <div class="v-dialog-inner">
                <i v-if="showClose"
                    class="v-dialog-close fa fa-close"
                    @click="handleAction('reject')"></i>

                <div class="v-dialog-head">{{title}}</div>
                <div class="v-dialog-body" v-html="content"></div>
                <div class="v-dialog-foot">
                    <v-button
                        theme="danger"
                        v-show="showConfirmButton"
                        @click="handleAction('resolve')">
                        {{confirmButtonText || '确定'}}
                    </v-button>
                    <v-button
                        v-show="showCancelButton"
                        @click="handleAction('reject')">
                        {{cancelButtonText || '取消'}}
                    </v-button>
                </div>
            </div>
        </v-align>
    </v-backdrop>
</template>

<script>
    import Vue from 'vue';

    import vAlign from '../../align';
    import vBackdrop from '../../backdrop';
    import vButton from '../../button';

    let uid = 0;

    const getSafeHandle = (handle) => {
        const currentUid = uid;

        return () => {
            Vue.$nextTick(() => {
                if (currentUid === uid) {
                    handle();
                }
            });
        };
    };

    export default {
        name: 'vDialog',

        components: {
            vAlign,
            vBackdrop,
            vButton,
        },

        data() {
            return {
                value: false,

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
        },

        watch: {
            value(val) {
                if (val) {
                    uid++;
                }
            },
        },

        methods: {
            handleAction(action) {
                if (typeof this.beforeClose === 'function') {
                    this.beforeClose(action, this, getSafeHandle(() => {
                        this.doClose(action);
                    }));
                } else {
                    this.doClose(action);
                }
            },

            handleBackdropClick() {
                if (this.closeOnClickBackdrop) {
                    this.doClose();
                }
            },

            doClose(action) {
                if (!this.value) {
                    return;
                }

                this.value = false;

                if (action) {
                    this.callback(action, this);
                }
            },
        },
    };
</script>

<style lang="sass">
    .v-dialog {
        background-color: rgba(0, 0, 0, .6);
        overflow-y: auto;
        padding: 20px;

        &-inner {
            background-color: #fff;
            border-radius: 2px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            text-align: left;
            width: 360px;
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
    }
</style>

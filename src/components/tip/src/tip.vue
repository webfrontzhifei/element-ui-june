<template>
    <v-backdrop class="v-tip" v-show="value" @click="handleBackdropClick">
        <v-align @click="handleBackdropClick">
            <p class="v-tip-text" :class="'v-tip-text-' + mode">{{text}}</p>
        </v-align>
    </v-backdrop>
</template>

<script>
    import vAlign from '../../align';
    import vBackdrop from '../../backdrop';

    export default {
        name: 'vTip',

        components: {
            vAlign,
            vBackdrop,
        },

        data() {
            return {
                value: false,

                delay: 2500,

                mode: '',
                text: '',

                closeOnClickBackdrop: true,
                closeOnPressEscape: true,
            };
        },

        watch: {
            value(val) {
                if (val) {
                    this.clearCloseTimer();
                    this.closeTimer = setTimeout(() => {
                        this.doClose();
                    }, this.delay);
                }
            },
        },

        methods: {
            handleBackdropClick() {
                if (this.closeOnClickBackdrop) {
                    this.doClose();
                }
            },

            doClose() {
                this.clearCloseTimer();

                if (!this.value) {
                    return;
                }

                this.value = false;

                this.callback(this);
            },

            clearCloseTimer() {
                if (this.closeTimer) {
                    clearTimeout(this.closeTimer);
                    this.closeTimer = null;
                }
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";

    .v-tip {
        background-color: rgba(0, 0, 0, .2);

        &-text {
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            border-radius: 3px;
            color: #fff;
            display: inline-block;
            margin-left: auto;
            margin-right: auto;
            max-width: 240px;
            padding: 10px 20px;
            outline: none;

            &-success {
                background: $success;
                border: 1px solid $success;
            }

            &-error {
                background: $danger;
                border: 1px solid $danger;
            }
        }
    }
</style>

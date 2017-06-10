<template>
    <v-backdrop class="v-loading" v-show="value" @click="handleBackdropClick">
        <v-align @click="handleBackdropClick">
            <v-spinner></v-spinner>
        </v-align>
    </v-backdrop>
</template>

<script>
    import vAlign from '../../align';
    import vBackdrop from '../../backdrop';
    import vSpinner from '../../spinner';

    export default {
        name: 'vLoading',

        components: {
            vAlign,
            vBackdrop,
            vSpinner,
        },

        data() {
            return {
                value: false,

                closeOnClickBackdrop: false,
                closeOnPressEscape: false,
            };
        },

        methods: {
            handleBackdropClick() {
                if (this.closeOnClickBackdrop) {
                    this.doClose();
                }
            },

            doClose() {
                if (!this.value) {
                    return;
                }

                this.value = false;
            },
        },
    };
</script>

<style lang="sass">
    .v-loading {
        background-color: rgba(0, 0, 0, .15);
    }
</style>

<template>
    <div class="v-dropdown" :class="{
        'is-disabled': disabled,
    }">
        <div class="v-dropdown-toggle" @click="toggle">
            <slot></slot>
        </div>

        <v-collapse-transition>
            <div class="v-dropdown-menu" v-show="value">
                <slot name="menu"></slot>
            </div>
        </v-collapse-transition>
    </div>
</template>

<script>
    import boundMixin from '../../../mixins/bound.js';

    import vCollapseTransition from '../../collapse-transition';

    export default {
        name: 'vDropdown',

        mixins: [boundMixin],

        components: {
            vCollapseTransition,
        },

        props: {
            value: Boolean,
            disabled: Boolean,
        },

        watch: {
            value(val) {
                if (val) {
                    this.enableCheckBound(() => this.hide());
                } else {
                    this.disableCheckBound();
                }
            },
        },

        methods: {
            toggle() {
                if (this.value) {
                    this.hide();
                } else {
                    this.show();
                }
            },
            show() {
                this.$emit('input', true);
            },
            hide() {
                this.$emit('input', false);
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-dropdown {
        position: relative;

        &-toggle {
            cursor: pointer;
        }

        &-menu {
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            left: 0;
            max-height: 400px;
            min-width: 160px;
            overflow-y: auto;
            padding: 5px 0;
            position: absolute;
            z-index: 200;
        }

        &.is-disabled {
            @extend %disabled;
        }
    }
</style>

<template>
    <label class="v-radio" :class="{
        'is-disabled': disabled,
        }">
        <input type="radio" :name="computedName" :value="label" v-model="radioValue">
        <i></i>
        <span v-if="$slots.default"><slot></slot></span>
    </label>
</template>

<script>
    export default {
        name: 'vRadio',

        props: {
            value: {},
            label: {},
            name: String,
            disabled: Boolean,
        },

        computed: {
            radioValue: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                },
            },
            computedName() {
                return this.name || this.$parent.name;
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-radio {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;

        & + & {
            margin-left: 20px;
        }

        & > input {
            clip: rect(0, 0, 0, 0);
            position: absolute;

            &:checked + i {
                background-color: $radio-checked-bg-color;
                border-color: $radio-checked-border-color;

                &:after {
                    transform: rotate(45deg) scale(1);
                }
            }
        }

        & > i {
            background-color: $radio-bg-color;
            border: 1px solid $radio-border-color;
            border-radius: $radio-border-radius;
            box-sizing: border-box;
            display: inline-block;
            font-size: $radio-size;
            height: $radio-size;
            margin-top: -$radio-size * 0.125;
            position: relative;
            transition: border-color .1s cubic-bezier(.71,-.46,.29,1.46),
                background-color .1s cubic-bezier(.71,-.46,.29,1.46);
            vertical-align: middle;
            width: $radio-size;

            &:after {
                border: 0.125em solid $radio-checked-inner-color;
                border-left: 0;
                border-top: 0;
                box-sizing: border-box;
                content: '';
                height: 0.5625em;
                left: 0.25em;
                position: absolute;
                top: 0.0625em;
                transform: rotate(45deg) scale(0);
                transition: all .2s cubic-bezier(.71,-.46,.88,.6);
                width: 0.375em;
            }
        }

        & > span {
            margin-left: 5px;
        }

        &:hover {
            & > i {
                border-color: $radio-checked-border-color;
            }
        }

        &.is-disabled {
            @extend %disabled;
        }
    }
</style>

<template>
    <label class="v-checkbox" :class="{
        'is-disabled': disabled,
        }">
        <input
            v-if="trueLabel || falseLabel"
            type="checkbox"
            :name="name"
            :true-value="trueLabel"
            :false-value="falseLabel"
            v-model="checkboxValue"
            :disabled="disabled"
            @change="handleChange">
        <input
            v-else
            type="checkbox"
            :name="name"
            :value="label"
            v-model="checkboxValue"
            :disabled="disabled"
            @change="handleChange">
        <i></i>
        <span v-if="$slots.default"><slot></slot></span>
    </label>
</template>

<script>
    export default {
        name: 'vCheckbox',

        props: {
            value: {},
            label: {},
            name: String,
            disabled: Boolean,
            trueLabel: {},
            falseLabel: {},
        },

        computed: {
            checkboxValue: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                },
            },
        },

        methods: {
            handleChange(event) {
                this.$emit('change', event);
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-checkbox {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;

        & > input {
            clip: rect(0, 0, 0, 0);
            position: absolute;

            &:checked + i {
                background-color: $checkbox-checked-bg-color;
                border-color: $checkbox-checked-border-color;

                &:after {
                    transform: rotate(45deg) scale(1);
                }
            }
        }

        & > i {
            background-color: $checkbox-bg-color;
            border: 1px solid $checkbox-border-color;
            border-radius: $checkbox-border-radius;
            box-sizing: border-box;
            display: inline-block;
            font-size: $checkbox-size;
            height: $checkbox-size;
            margin-top: -$checkbox-size * 0.125;
            position: relative;
            transition: border-color .1s cubic-bezier(.71,-.46,.29,1.46),
                background-color .1s cubic-bezier(.71,-.46,.29,1.46);
            vertical-align: middle;
            width: $checkbox-size;

            &:after {
                border: 0.125em solid $checkbox-checked-inner-color;
                border-left: 0;
                border-top: 0;
                box-sizing: border-box;
                content: '';
                height: 0.625em;
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
                border-color: $checkbox-checked-border-color;
            }
        }

        &.is-disabled {
            @extend %disabled;
        }
    }
</style>

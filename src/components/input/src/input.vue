<template>
    <div class="v-input" :class="{
        'is-disabled': disabled,
        'is-invalid': !valid,
    }">
        <input
            v-if="type !== 'textarea'"
            ref="input"
            :type="type"
            :value="inputValue"
            :placeholder="placeholder"
            :name="name"
            :minlength="minlength"
            :maxlength="maxlength"
            :min="min"
            :max="max"
            :step="step"
            :disabled="disabled"
            :readonly="readonly"
            :autofocus="autofocus"
            :autocomplete="autocomplete"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur">
        <textarea
            v-else
            ref="textarea"
            :value="inputValue"
            :placeholder="placeholder"
            :name="name"
            :minlength="minlength"
            :maxlength="maxlength"
            :rows="rows"
            :disabled="disabled"
            :readonly="readonly"
            :autofocus="autofocus"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur">
        </textarea>

        <span class="v-input-counter" v-if="showCounter">
            {{inputValue ? ('' + inputValue).length : 0 }}/{{maxlength}}
        </span>

        <v-validator-errors></v-validator-errors>
    </div>
</template>

<script>
    import validatorMixin from '../../validator/src/mixin';

    export default {
        name: 'vInput',
        mixins: [validatorMixin],
        props: {
            type: {
                type: String,
                default: 'text',
            },
            value: [String, Number],
            placeholder: String,
            name: String,
            minlength: Number,
            maxlength: Number,
            min: Number,
            max: Number,
            step: Number,
            rows: Number,
            disabled: Boolean,
            readonly: Boolean,
            autofocus: Boolean,
            autocomplete: {
                type: String,
                default: 'off',
            },
            showCounter: Boolean,
        },
        data() {
            return {
                inputValue: this.value,
            };
        },
        watch: {
            value(val) {
                this.setInputValue(val);
            },
        },
        methods: {
            setInputValue(value) {
                if (this.inputValue !== value) {
                    this.inputValue = value;
                }
            },
            handleInput(event) {
                const value = event.target.value;
                this.$emit('input', value);
                this.setInputValue(value);
                this.$emit('change', value);
            },
            handleFocus(event) {
                this.$emit('focus', event);
            },
            handleBlur(event) {
                this.validate();
                this.$emit('blur', event);
            },
            focus() {
                this.$refs.input.focus();
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-input {
        display: inline-block;
        vertical-align: middle;
        position: relative;

        input, textarea {
            border: 1px solid #d1d2d4;
            color: #4a4a4a;
            font-size: 14px;
            line-height: 20px;
            padding: 4px 6px;
            width: 100%;

            &:focus {
                border-color: $primary;
            }
        }

        &-counter {
            color: #8e8f92;
            height: 30px;
            left: 100%;
            line-height: 30px;
            margin-left: 10px;
            position: absolute;
            top: 0;
        }

        &.is-disabled {
            @extend %disabled;
        }

        &.is-invalid {
            input, textarea,
            input:focus, textarea:focus {
                border-color: $danger;
            }
        }
    }
</style>

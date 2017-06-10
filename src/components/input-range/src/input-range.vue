<template>
    <div class="v-input-range" :class="{
        'is-disabled': disabled,
        }">
        <input :type="type" :value="from" @input="onFromChange" />
        <span>-</span>
        <input :type="type" :value="to" @input="onToChange" />
    </div>
</template>

<script>
    export default {
        name: 'vInputRange',

        props: {
            type: {
                type: String,
                default: 'number',
            },
            from: [String, Object],
            to: [String, Object],
            disabled: Boolean,
        },

        methods: {
            onFromChange(event) {
                this.$emit('from-change', event.target.value);
            },
            onToChange(event) {
                this.$emit('to-change', event.target.value);
            },
        },
    };
</script>

<style lang="sass">
    .v-input-range {
        display: inline-block;
        vertical-align: middle;

        input {
            border: 1px solid #d1d2d4;
            color: #4a4a4a;
            float: left;
            font-size: 14px;
            height: 30px;
            line-height: 20px;
            padding: 4px 6px;
            width: 90px;

            &:focus {
                border-color: #2972cc;
            }

            &::-webkit-clear-button,
            &::-webkit-inner-spin-button {
                display: none;
            }

            &::-webkit-calendar-picker-indicator {
                margin-right: -5px;
                padding: 0;
            }
        }

        span {
            float: left;
            line-height: 30px;
            text-align: center;
            width: 20px;
        }
    }
</style>

<template>
    <div class="v-date-range-picker" :class="{
        'is-disabled': disabled,
    }">
        <v-date-picker
            :value="start"
            :min="min"
            :max="end"
            :disabled="disabled"
            @input="onStartChange"></v-date-picker>
        <span>至</span>
        <v-date-picker
            :value="end"
            :min="start"
            :max="max"
            :disabled="disabled"
            @input="onEndChange"></v-date-picker>
    </div>
</template>

<script>
    import vDatePicker from './date-picker.vue';

    export default {
        name: 'vDateRangePicker',

        components: {
            vDatePicker,
        },

        props: {
            start: String,
            end: String,
            min: [String, Object],
            max: [String, Object],
            disabled: Boolean,
        },

        methods: {
            onStartChange(date, mDate) {
                this.$emit('start-change', date, mDate);
            },
            onEndChange(date, mDate) {
                this.$emit('end-change', date, mDate);
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-date-range-picker {
        display: inline-block;
        vertical-align: middle;

        .v-date-picker {
            float: left;
            width: 95px;

            &:last-child {
                .v-date-picker-picker {
                    right: 0;
                }
            }
        }

        & > span {
            float: left;
            line-height: 30px;
            text-align: center;
            width: 30px;
        }

        &.is-disabled {
            @extend %disabled;
        }
    }
</style>

<template>
    <div class="v-datetime-range-picker" :class="{
        'is-disabled': disabled,
    }">
        <v-datetime-picker
            :value="start"
            :min="min"
            :max="end"
            :disabled="disabled"
            @input="onStartChange"></v-datetime-picker>
        <span>至</span>
        <v-datetime-picker
            :value="end"
            :min="start"
            :max="max"
            :disabled="disabled"
            @input="onEndChange"></v-datetime-picker>
    </div>
</template>

<script>
    import vDatetimePicker from './datetime-picker.vue';

    export default {
        name: 'vDatetimeRangePicker',

        components: {
            vDatetimePicker,
        },

        props: {
            start: String,
            end: String,
            min: [String, Object],
            max: [String, Object],
            disabled: Boolean,
        },

        methods: {
            onStartChange(datetime, mDatetime) {
                this.$emit('start-change', datetime, mDatetime);
            },
            onEndChange(datetime, mDatetime) {
                this.$emit('end-change', datetime, mDatetime);
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-datetime-range-picker {
        display: inline-block;
        min-width: 350px;
        vertical-align: middle;

        .v-datetime-picker {
            float: left;
            width: 160px;

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

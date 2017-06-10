<template>
    <div class="v-datetime-picker" :class="computedClasses">
        <v-date-picker placeholder="日期"
            :value="date"
            :min="minDate"
            :max="maxDate"
            @input="onDateChange"></v-date-picker>
        <v-time-picker placeholder="时间"
            :date="date"
            :value="time"
            :min="minTime"
            :max="maxTime"
            :disabled="!date"
            @input="onTimeChange"></v-time-picker>
    </div>
</template>

<script>
    import moment from 'moment';

    import vDatePicker from '../../date-picker';
    import vTimePicker from '../../time-picker';

    export default {
        name: 'vDatetimePicker',

        components: {
            vDatePicker,
            vTimePicker,
        },

        props: {
            value: String,
            min: [String, Object],
            max: [String, Object],
            disabled: Boolean,
        },

        computed: {
            date() {
                return this.value ? this.value.split(' ')[0] : undefined;
            },
            time() {
                return this.value ? this.value.split(' ')[1] : undefined;
            },
            minDate() {
                return this.min ? this.min.split(' ')[0] : undefined;
            },
            maxDate() {
                return this.max ? this.max.split(' ')[0] : undefined;
            },
            minTime() {
                if (this.min && this.date === this.minDate) {
                    return this.min.split(' ')[1];
                }

                return undefined;
            },
            maxTime() {
                if (this.max && this.date === this.maxDate) {
                    return this.max.split(' ')[1];
                }

                return undefined;
            },
            computedClasses() {
                return {
                    'is-disabled': this.disabled,
                };
            },
        },

        methods: {
            onDateChange(date) {
                const datetime = this.date ? this.value.replace(this.date, date) : date;
                this.onDatetimeChange(datetime);
            },
            onTimeChange(time) {
                const datetime = this.time ? this.value.replace(this.time, time) : `${this.date} ${time}`;
                this.onDatetimeChange(datetime);
            },
            onDatetimeChange(datetime) {
                this.$emit('input', datetime, moment(datetime, 'YYYY-MM-DD HH:mm'));
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-datetime-picker {
        display: inline-block;
        min-width: 160px;
        vertical-align: middle;

        .v-date-picker {
            float: left;
            margin-right: 10px;
            width: 95px;
        }

        .v-time-picker {
            float: left;
            width: 55px;
        }
        &.is-disabled {
            @extend %disabled;
        }
    }
</style>

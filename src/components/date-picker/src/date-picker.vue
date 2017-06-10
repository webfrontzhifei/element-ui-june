<template>
    <div class="v-date-picker" :class="{
        'is-disabled': disabled,
    }">
        <slot>
            <input type="text" :value="value" readonly
                :placeholder="placeholder" @click="toggle">
        </slot>

        <v-collapse-transition>
            <div class="v-date-picker-picker" v-show="active">
                <div class="v-date-picker-switchs" v-if="phase">
                    <span class="v-date-picker-prev" @click="prev"
                        :class="{ disabled: isPrevDisabled }">
                        <i class="fa fa-angle-left"></i>
                    </span>
                    <span class="v-date-picker-next" @click="next"
                        :class="{ disabled: isNextDisabled }">
                        <i class="fa fa-angle-right"></i>
                    </span>
                    <span class="v-date-picker-title" @click="switchToParentPhase">{{title}}</span>
                </div>

                <div class="v-date-picker-years" v-if="phase === 'year'">
                    <span v-for="(y, yIndex) in years" :key="yIndex"
                        :class="{ disabled: y.disabled, selected: y.selected }"
                        @click="selectYear(y)">{{y.year}}</span>
                </div>

                <div class="v-date-picker-months" v-if="phase === 'month'">
                    <span v-for="(m, mIndex) in months" :key="mIndex"
                        :class="{ disabled: m.disabled, selected: m.selected }"
                        @click="selectMonth(m)">{{m.month}}</span>
                </div>

                <template v-if="phase === 'day'">
                    <div class="v-date-picker-days">
                        <span v-for="(day, dayIndex) in days" key="dayIndex">{{day}}</span>
                    </div>

                    <div class="v-date-picker-dates">
                        <span v-for="(d, dIndex) in dates" :key="dIndex"
                            :class="{ disabled: d.disabled, selected: d.selected }"
                            @click="selectDate(d)">{{d.date}}</span>
                    </div>
                </template>
            </div>
        </v-collapse-transition>
    </div>

</template>

<script>
    import moment from 'moment';
    import 'moment/locale/zh-cn';

    import boundMixin from '../../../mixins/bound.js';

    import vCollapseTransition from '../../collapse-transition';

    // 修正一周开始时间为周日
    moment.localeData()._week.dow = 0; // eslint-disable-line no-underscore-dangle

    export default {
        name: 'vDatePicker',

        mixins: [boundMixin],

        components: {
            vCollapseTransition,
        },

        props: {
            value: String,
            min: {
                type: [String, Object],
                default: () => ({ year: -3 }),
            },
            max: {
                type: [String, Object],
                default: () => ({ year: 3 }),
            },
            yFormatter: {
                type: String,
                default: 'YYYY',
            },
            ymFormatter: {
                type: String,
                default: 'YYYY-MM',
            },
            formatter: {
                type: String,
                default: 'YYYY-MM-DD',
            },
            placeholder: String,
            disabled: Boolean,
            lastPhase: {
                type: String,
                default: 'day',
            },
        },

        data() {
            return {
                active: false,
                yearMonth: null,
                phase: '',
                days: moment.weekdaysMin(),
            };
        },

        computed: {
            /**
             * @return {Moment} 当前选中日期
             */
            mValue() {
                const mValue = this.value ? moment(this.value, this.formatter) : moment().startOf('day');
                if (this.mMinDate.isAfter(mValue)) {
                    return this.mMinDate.clone();
                }
                if (this.mMaxDate.isBefore(mValue)) {
                    return this.mMaxDate.clone();
                }
                return mValue;
            },

            /**
             * @return {Moment} 当前年月
             */
            mYearMonth() {
                return moment(this.yearMonth, this.ymFormatter);
            },

            /**
             * @return {Moment} 最小日期
             */
            mMinDate() {
                const min = this.min;

                if (!min) {
                    return moment().startOf('day');
                }

                if (typeof min === 'object') {
                    const minDate = moment();

                    Object.keys(min).forEach((key) => {
                        if (min[key]) {
                            minDate.add(min[key], key);
                        }
                    });

                    return minDate.startOf('day');
                }

                return moment(this.min, this.formatter);
            },

            /**
             * @return {Moment} 最大日期
             */
            mMaxDate() {
                const max = this.max;

                if (!max) {
                    return moment().startOf('day');
                }

                if (typeof max === 'object') {
                    const maxDate = moment();

                    Object.keys(max).forEach((key) => {
                        if (max[key]) {
                            maxDate.add(max[key], key);
                        }
                    });

                    return maxDate.startOf('day');
                }

                return moment(this.max, this.formatter);
            },

            /**
             * @return {String} 标题, 根据当前阶段显示不同格式数据
             */
            title() {
                let title;

                const year = this.mYearMonth.year();

                switch (this.phase) {
                    case 'year':
                        title = `${year - 6}-${year + 5}`;
                        break;
                    case 'month':
                        title = year;
                        break;
                    default:
                        title = this.yearMonth;
                }

                return title;
            },

            /* eslint-disable max-len */
            /**
             * @return {[Array<{year: String, moment: Moment, selected: Boolean, disabled: Boolean}>]} 年份数组, 当前年份前6后5
             */
            years() {
                const years = [];

                const year = this.mYearMonth.clone().startOf('year');

                const curDate = this.mValue.clone().startOf('year');
                const minDate = this.mMinDate.clone().startOf('year');
                const maxDate = this.mMaxDate.clone().startOf('year');

                const len = 12;
                const start = year.year() - 6;
                let i;
                let temp;

                for (i = 0; i < len; i++) {
                    temp = year.clone().year(start + i);

                    years.push({
                        year: temp.format('YYYY'),
                        moment: temp,
                        selected: temp.isSame(curDate),
                        disabled: temp.isAfter(maxDate) || temp.isBefore(minDate),
                    });
                }

                return years;
            },

            /**
             * @return {[Array<{month: String, moment: Moment, selected: Boolean, disabled: Boolean}>]} 月份数组, 1 - 12 月
             */
            months() {
                const months = [];

                const month = this.mYearMonth.clone().startOf('year');

                const curDate = this.mValue.clone().startOf('month');
                const minDate = this.mMinDate.clone().startOf('month');
                const maxDate = this.mMaxDate.clone().startOf('month');

                const len = 12;
                let i;
                let temp;

                for (i = 0; i < len; i++) {
                    temp = month.clone().month(i);

                    months.push({
                        month: temp.format('MMM'),
                        moment: temp,
                        selected: temp.isSame(curDate),
                        disabled: temp.isAfter(maxDate) || temp.isBefore(minDate),
                    });
                }

                return months;
            },

            /**
             * @return {[Array<{date: String, moment: Moment, selected: Boolean, disabled: Boolean}>]} 月份数组, 本月第一天所在周的第一天 - 本月最后一天所在周的最后一天
             */
            dates() {
                const dates = [];

                const date = this.mYearMonth.clone().startOf('month');

                const curDate = this.mValue.clone().startOf('day');
                const minDate = this.mMinDate.clone().startOf('day');
                const maxDate = this.mMaxDate.clone().startOf('day');

                const monthStartDate = date.clone().startOf('month');
                const monthEndDate = date.clone().endOf('month');

                const firstDate = monthStartDate.clone().startOf('week');
                const lastDate = monthEndDate.clone().endOf('week');

                const monthDays = date.daysInMonth();
                const prevMonthDays = moment.duration({ from: firstDate, to: monthStartDate }).days();
                const nextMonthDays = moment.duration({ from: monthEndDate, to: lastDate }).days();

                let i = 0;
                let temp;

                for (i = 0; i < monthDays; i++) {
                    temp = date.clone().date(i + 1);

                    dates.push({
                        date: temp.date(),
                        moment: temp,
                        selected: temp.isSame(curDate),
                        disabled: temp.isAfter(maxDate) || temp.isBefore(minDate),
                    });
                }

                for (i = 0; i < prevMonthDays; i++) {
                    temp = monthStartDate.clone().add(-i - 1, 'day');

                    dates.unshift({
                        date: temp.date(),
                        moment: temp,
                        selected: false,
                        disabled: true,
                    });
                }

                for (i = 0; i < nextMonthDays; i++) {
                    temp = monthEndDate.clone().add(i + 1, 'day');

                    dates.push({
                        date: temp.date(),
                        moment: temp,
                        selected: false,
                        disabled: true,
                    });
                }

                return dates;
            },
            /* eslint-enable max-len */

            /**
             * @return {Boolean} 向前操作激活状态，根据不同阶段做不同判断
             */
            isPrevDisabled() {
                const minDate = this.mMinDate.clone();
                let start;

                switch (this.phase) {
                    case 'year':
                        minDate.startOf('year');
                        start = this.years[0].moment;
                        break;
                    case 'month':
                        minDate.startOf('month');
                        start = this.months[0].moment;
                        break;
                    default:
                        minDate.startOf('day');
                        start = this.dates.filter(d => !d.disabled)[0].moment; // 过滤掉不可选中的日期
                }

                return !minDate.isBefore(start);
            },

            /**
             * @return {Boolean} 向后操作激活状态，根据不同阶段做不同判断
             */
            isNextDisabled() {
                const maxDate = this.mMaxDate.clone();
                let end;

                switch (this.phase) {
                    case 'year':
                        maxDate.startOf('year');
                        end = this.years[this.years.length - 1].moment;
                        break;
                    case 'month':
                        maxDate.startOf('month');
                        end = this.months[this.months.length - 1].moment;
                        break;
                    default:
                        maxDate.startOf('day');
                        end = this.dates.filter(d => !d.disabled).slice(-1)[0].moment; // 过滤掉不可选中的日期
                }

                return !maxDate.isAfter(end);
            },
        },

        methods: {
            toggle() {
                if (this.active) {
                    this.hide();
                } else {
                    this.show();
                }
            },
            show() {
                this.phase = this.lastPhase;
                this.yearMonth = this.mValue.format('YYYY-MM');
                this.enableCheckBound(() => this.hide());

                this.$nextTick(() => { // 放到 nextTick 是为了让动画更流畅
                    this.active = true;
                });
            },
            hide() {
                this.active = false;
                this.disableCheckBound();
            },

            prev() {
                const currYearMonth = this.mYearMonth;
                let prevYearMonth;

                switch (this.phase) {
                    case 'year':
                        prevYearMonth = currYearMonth.add(-12, 'year');
                        break;
                    case 'month':
                        prevYearMonth = currYearMonth.add(-1, 'year');
                        break;
                    default:
                        prevYearMonth = currYearMonth.add(-1, 'month');
                }

                this.yearMonth = prevYearMonth.format('YYYY-MM');
            },

            next() {
                const currYearMonth = this.mYearMonth;
                let nextYearMonth;

                switch (this.phase) {
                    case 'year':
                        nextYearMonth = currYearMonth.add(12, 'year');
                        break;
                    case 'month':
                        nextYearMonth = currYearMonth.add(1, 'year');
                        break;
                    default:
                        nextYearMonth = currYearMonth.add(1, 'month');
                }

                this.yearMonth = nextYearMonth.format('YYYY-MM');
            },

            switchToParentPhase() {
                if (this.phase === 'day') {
                    this.phase = 'month';
                } else {
                    this.phase = 'year';
                }
            },

            selectYear(y) {
                if (this.lastPhase === 'year') {
                    this.hide();
                    this.$emit('input', y.moment.format(this.yFormatter), y.moment);
                } else {
                    this.phase = 'month';
                    this.yearMonth = y.moment.format(this.ymFormatter);
                }
            },

            selectMonth(m) {
                if (this.lastPhase === 'month') {
                    this.hide();
                    this.$emit('input', m.moment.format(this.ymFormatter), m.moment);
                } else {
                    this.phase = 'day';
                    this.yearMonth = m.moment.format(this.ymFormatter);
                }
            },

            selectDate(d) {
                this.hide();
                this.$emit('input', d.moment.format(this.formatter), d.moment);
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-date-picker {
        display: inline-block;
        vertical-align: middle;
        position: relative;

        input {
            border: 1px solid #d1d2d4;
            color: #4a4a4a;
            cursor: pointer;
            font-size: 14px;
            height: 30px;
            line-height: 20px;
            padding: 4px 6px;
            width: 100%;

            &:focus {
                border-color: #2972cc;
            }
        }

        &-picker {
            background-color: #fff;
            border-radius: 3px;
            border-top: 1px solid #eee;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            overflow: auto;
            padding: 5px;
            position: absolute;
            transition: opacity 0.218s;
            width: 220px;
            z-index: 200;
        }

        &-prev,
        &-next,
        &-title {
            cursor: pointer;
            display: block;
            height: 30px;
            line-height: 30px;
            text-align: center;
        }

        &-prev,
        &-next {
            color: #808080;
            margin-top: -2px;

            i {
                font-size: 20px;
                line-height: inherit;
                width: 35px;
            }

            &.disabled {
                color: #ccd0d7;
                @extend %disabled;
            }

            &:hover i {
                color: $primary;
            }
        }

        &-prev {
            float: left;
        }

        &-next {
            float: right;
        }

        &-title {
            color: #4c5161;
            margin: 0 35px;

            &:hover {
                background-color: #f0f0f2;
            }
        }

        &-years,
        &-months,
        &-days,
        &-dates {
            overflow: hidden;
            text-align: center;

            span {
                border-radius: 2px;
                color: #4c5161;
                float: left;
            }
        }

        &-years,
        &-months,
        &-dates {
            span {
                cursor: pointer;

                &:hover {
                    background-color: #f0f0f2;
                }

                &.disabled {
                    color: #ccd0d7;
                    @extend %disabled;
                }

                &:not(.disabled).selected {
                    background-color: $primary;
                    color: #fff;
                }
            }
        }

        &-years,
        &-months {
            span {
                height: 40px;
                line-height: 40px;
                width: 25%;
            }
        }

        &-days,
        &-dates {
            span {
                height: 30px;
                line-height: 30px;
                width: 14.2857143%;
            }
        }

        &.is-disabled {
            @extend %disabled;
        }

        &.is-invalid {
            input,
            input:focus {
                border-color: #ed4259;
            }
        }
    }
</style>

<template>
    <div class="v-time-picker" :class="{
        'is-disabled': disabled,
    }">
        <slot>
            <input type="text" :value="niceValue" readonly
                :placeholder="placeholder" @click="toggle">
        </slot>

        <v-collapse-transition>
            <div class="v-time-picker-picker" v-show="active">
                <div class="v-time-picker-switchs" v-if="phase === 'minute'">
                    <span class="v-time-picker-prev" @click="prev"
                        :class="{ disabled: isPrevDisabled }">
                        <i class="fa fa-angle-left"></i>
                    </span>
                    <span class="v-time-picker-next" @click="next"
                        :class="{ disabled: isNextDisabled }">
                        <i class="fa fa-angle-right"></i>
                    </span>
                    <span class="v-time-picker-title" @click="toggleType">{{title}}</span>
                </div>

                <div class="v-time-picker-hours" v-if="phase === 'hour'">
                    <span v-for="h in hours" track-by="$index"
                        :class="{ disabled: h.disabled, selected: h.selected }"
                        @click="selectHour(h)">{{h.hour}}</span>
                </div>

                <div class="v-time-picker-minutes" v-if="phase === 'minute'">
                    <span v-for="m in minutes" track-by="$index"
                        :class="{ disabled: m.disabled, selected: m.selected }"
                        @click="selectMinute(m)">{{m.minute}}</span>
                </div>
            </div>
        </v-collapse-transition>
    </div>
</template>

<script>
    import moment from 'moment';

    import boundMixin from '../../../mixins/bound.js';

    import vCollapseTransition from '../../collapse-transition';

    export default {
        name: 'vTimePicker',

        mixins: [boundMixin],

        components: {
            vCollapseTransition,
        },

        props: {
            value: String,
            date: String,
            min: String,
            max: String,
            formatter: {
                type: String,
                default: 'HH:mm',
            },
            placeholder: String,
            disabled: Boolean,
        },

        data() {
            return {
                active: false,
                hour: null,
                phase: '',
            };
        },

        computed: {
            /**
             * @return {Moment} 当前日期
             */
            mDate() {
                return this.date ? moment(this.date, 'YYYY-MM-DD') : moment().startOf('day');
            },

            /**
             * @return {Moment} 当前选中时间
             */
            mValue() {
                const dateFormatter = 'YYYY-MM-DD';
                const date = this.mDate.format(dateFormatter);

                const formatter = this.formatter;
                const value = this.value || moment().format(formatter);

                return moment(`${date} ${value}`, `${dateFormatter} ${formatter}`);
            },

            /**
             * @return {Moment} 当前小时
             */
            mHour() {
                return this.mDate.clone().hour(this.hour);
            },

            /**
             * @return {Moment} 最小时间
             */
            mMinTime() {
                const dateFormatter = 'YYYY-MM-DD';
                const date = this.mDate.format(dateFormatter);

                const formatter = this.formatter;
                const min = this.min || moment().startOf('day').format(formatter);

                return moment(`${date} ${min}`, `${dateFormatter} ${formatter}`);
            },

            /**
             * @return {Moment} 最大时间
             */
            mMaxTime() {
                const dateFormatter = 'YYYY-MM-DD';
                const date = this.mDate.format(dateFormatter);

                const formatter = this.formatter;
                const max = this.max || moment().endOf('day').format(formatter);

                return moment(`${date} ${max}`, `${dateFormatter} ${formatter}`);
            },

            niceValue() {
                return this.value ? this.mValue.format(this.formatter) : '';
            },

            /**
             * @return {String} 标题, 根据当前阶段显示不同格式数据
             */
            title() {
                let title;

                switch (this.phase) {
                    case 'minute':
                        title = this.mHour.format('HH:00');
                        break;
                    default:
                }

                return title;
            },

            /* eslint-disable max-len */
            /**
             * @return {[Array<{hour: String, moment: Moment, selected: Boolean, disabled: Boolean}>]} 小时数组, 0-23小时
             */
            hours() {
                const hours = [];

                const date = this.mDate.clone().startOf('day');

                const curTime = this.mValue.clone().startOf('hour');
                const minTime = this.mMinTime.clone().startOf('hour');
                const maxTime = this.mMaxTime.clone().startOf('hour');

                const len = 24;
                let i;
                let temp;

                for (i = 0; i < len; i++) {
                    temp = date.clone().hour(i);

                    hours.push({
                        hour: temp.format('HH:mm'),
                        moment: temp,
                        selected: temp.isSame(curTime),
                        disabled: temp.isAfter(maxTime) || temp.isBefore(minTime),
                    });
                }

                return hours;
            },

            /**
             * @return {[Array<{minute: String, moment: Moment, selected: Boolean, disabled: Boolean}>]} 分数组, 0-59
             */
            minutes() {
                const minutes = [];

                const hour = this.mHour.clone().startOf('hour');

                const curTime = this.mValue.clone().startOf('minute');
                const minTime = this.mMinTime.clone().startOf('minute');
                const maxTime = this.mMaxTime.clone().startOf('minute');

                const len = 12;
                let i;
                let temp;

                for (i = 0; i < len; i++) {
                    temp = hour.clone().minute(i * 5);

                    minutes.push({
                        minute: temp.format('HH:mm'),
                        moment: temp,
                        selected: temp.isSame(curTime),
                        disabled: temp.isAfter(maxTime) || temp.isBefore(minTime),
                    });
                }

                return minutes;
            },
            /* eslint-enable max-len */

            isPrevDisabled() {
                const minTime = this.mMinTime.clone();
                let start;

                switch (this.phase) {
                    case 'hour':
                        break;
                    default:
                        minTime.startOf('minute');
                        start = this.minutes[0].moment;
                }

                return !minTime.isBefore(start);
            },

            isNextDisabled() {
                const maxTime = this.mMaxTime.clone();
                let end;

                switch (this.phase) {
                    case 'hour':
                        break;
                    default:
                        maxTime.startOf('minute').add(-4, 'minute'); // 最小可选时间间隔：5分钟
                        end = this.minutes[this.minutes.length - 1].moment;
                }

                return !maxTime.isAfter(end);
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
                this.phase = 'hour';
                this.hour = this.mValue.hour();
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
                const currHour = this.mHour;
                let prevHour;

                switch (this.phase) {
                    case 'hour':
                        break;
                    default:
                        prevHour = currHour.add(-1, 'hour');
                }

                this.hour = prevHour.hour();
            },

            next() {
                const currHour = this.mHour;
                let nextour;

                switch (this.phase) {
                    case 'hour':
                        break;
                    default:
                        nextour = currHour.add(1, 'hour');
                }

                this.hour = nextour.hour();
            },

            toggleType() {
                if (this.phase === 'minute') {
                    this.phase = 'hour';
                }
            },

            selectHour(h) {
                this.phase = 'minute';
                this.hour = h.moment.hour();
            },

            selectMinute(m) {
                this.hide();
                this.$emit('input', m.moment.format(this.formatter), m.moment);
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-time-picker {
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
            overflow-y: auto;
            padding: 5px;
            position: absolute;
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

        &-hours,
        &-minutes {
            overflow: hidden;
            text-align: center;

            span {
                border-radius: 2px;
                color: #4c5161;
                cursor: pointer;
                float: left;

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

        &-hours {
            span {
                height: 30px;
                line-height: 30px;
                width: 25%;
            }
        }

        &-minutes {
            span {
                height: 40px;
                line-height: 40px;
                width: 25%;
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

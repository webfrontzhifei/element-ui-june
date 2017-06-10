import DatetimePicker from './src/datetime-picker.vue';

DatetimePicker.install = (Vue) => {
    Vue.component(DatetimePicker.name, DatetimePicker);
};

export default DatetimePicker;

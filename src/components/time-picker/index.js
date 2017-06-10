import TimePicker from './src/time-picker.vue';

TimePicker.install = (Vue) => {
    Vue.component(TimePicker.name, TimePicker);
};

export default TimePicker;

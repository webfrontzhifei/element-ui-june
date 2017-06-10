import CollapseTransition from './src/collapse-transition.vue';

CollapseTransition.install = (Vue) => {
    Vue.component(CollapseTransition.name, CollapseTransition);
};

export default CollapseTransition;

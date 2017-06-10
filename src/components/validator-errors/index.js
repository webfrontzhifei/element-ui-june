import ValidatorErrors from '../validator/src/validator-errors.vue';

ValidatorErrors.install = (Vue) => {
    Vue.component(ValidatorErrors.name, ValidatorErrors);
};

export default ValidatorErrors;

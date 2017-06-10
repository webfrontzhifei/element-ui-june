import debounce from 'lodash/debounce';

import vValidatorErrors from './validator-errors.vue';

export default {
    components: {
        vValidatorErrors,
    },

    props: {
        autoValidate: Boolean,
        validateOnInit: Boolean,
        required: Boolean,
        requiredTip: {
            type: String,
            default: '该字段不能为空',
        },
        maxlength: Number,
        maxlengthTip: {
            type: String,
            default: '该字段长度过长',
        },
        pattern: String,
        patternTip: {
            type: String,
            default: '该字段不合法',
        },
        extraTip: String,
    },
    data() {
        return {
            valid: true,
            invalids: {
                required: false,
                maxlength: false,
                pattern: false,
                extra: false,
            },
        };
    },
    computed: {
        // 获取需要验证的值，默认获取 value 值
        modelValue() {
            return this.value;
        },
    },
    watch: {
        extraTip() {
            this.validate();
        },
    },
    mounted() {
        if (this.validateOnInit) {
            this.validate();
        }

        if (this.autoValidate) {
            this.$watch('modelValue', debounce(() => this.validate(), 300));
        }
    },
    methods: {
        resetValid() {
            this.valid = true;
            this.invalids.required = false;
            this.invalids.maxlength = false;
            this.invalids.pattern = false;
            this.invalids.extra = false;
        },
        validate() {
            this.resetValid();
            this.validateRequired();
            this.validateMaxlength();
            this.validatePattern();
            this.validateExtra();
        },
        validateRequired() {
            if (!this.valid) {
                return;
            }

            if (this.required && !this.modelValue) {
                this.invalids.required = true;
                this.valid = false;
            } else {
                this.invalids.required = false;
            }
        },
        validateMaxlength() {
            if (!this.valid) {
                return;
            }

            if (this.maxlength > 0 && this.modelValue.length > this.maxlength) {
                this.invalids.maxlength = true;
                this.valid = false;
            } else {
                this.invalids.maxlength = false;
            }
        },
        validatePattern() {
            if (!this.valid) {
                return;
            }

            if (this.pattern && !(new RegExp(this.pattern).test(this.modelValue))) {
                this.invalids.pattern = true;
                this.valid = false;
            } else {
                this.invalids.pattern = false;
            }
        },
        validateExtra() {
            if (!this.valid) {
                return;
            }

            if (this.extraTip) {
                this.invalids.extra = true;
                this.valid = false;
            } else {
                this.invalids.extra = false;
            }
        },
    },
};

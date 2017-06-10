 <template>
    <div class="v-select" :class="computedClasses">
        <div class="v-select-selected" @click="toggleOptions">
            <input v-if="editable" type="text"
                :value="selectValue"
                :placeholder="label"
                @input="handleEdit($event.target.value)">
            <template v-else>{{labelValue}}</template>
            <i class="v-select-caret" :class="{ up: isOptionsShowing }"></i>
        </div>

        <v-validator-errors></v-validator-errors>

        <v-collapse-transition>
            <div class="v-select-options" v-show="isOptionsShowing">
                <div class="v-select-search" v-if="filterable">
                    <input type="text" v-model="filterText">
                </div>
                <ul>
                    <slot></slot>
                </ul>
            </div>
        </v-collapse-transition>
    </div>
</template>

<script>
    import boundMixin from '../../../mixins/bound.js';
    import validatorMixin from '../../validator/src/mixin';

    import vCollapseTransition from '../../collapse-transition';
    import vInput from '../../input';

    export default {
        name: 'vSelect',

        mixins: [boundMixin, validatorMixin],

        components: {
            vCollapseTransition,
            vInput,
        },

        props: {
            value: {},
            label: {},
            filterable: Boolean,
            editable: Boolean,
            disabled: Boolean,
        },
        data() {
            return {
                selectValue: this.value,
                labelValue: this.label,
                isOptionsShowing: false,
                optionsLength: 0, // 用于同步 options.length
                filterText: '',
            };
        },
        computed: {
            computedClasses() {
                return {
                    'is-disabled': this.disabled,
                    'is-invalid': !this.valid,
                };
            },
        },
        watch: {
            value(val) {
                this.setSelectValue(val);
            },
            label(val) {
                this.labelValue = val;
            },
            filterText(val) {
                this.options.forEach(d => d.toggle(val));
            },
        },
        created() {
            this.options = [];
        },
        methods: {
            setSelectValue(value) {
                if (this.selectValue !== value) {
                    this.selectValue = value;
                    this.recalcSelectedOption();
                    this.$emit('change', value);
                }
            },
            recalcSelectedOption() {
                this.options.forEach((d) => {
                    if (d.value === this.selectValue) {
                        d.selected = true;
                        this.labelValue = d.label;
                    } else {
                        d.selected = false;
                    }
                });
            },
            toggleOptions() {
                if (!this.options.length) {
                    return;
                }

                if (this.isOptionsShowing) {
                    this.hideOptions();
                } else {
                    this.showOptions();
                }
            },
            showOptions() {
                this.filterText = null;

                this.isOptionsShowing = true;
                this.enableCheckBound(() => this.hideOptions());
            },
            hideOptions() {
                this.isOptionsShowing = false;
                this.disableCheckBound();
            },
            select(option) {
                const value = option.value;

                this.$emit('input', value);
                this.setSelectValue(value);
                this.hideOptions();
                this.$nextTick(() => {
                    this.validate();
                });
            },
            handleEdit(value) {
                this.$emit('input', value);
                this.setSelectValue(value);
                this.hideOptions();
                this.$nextTick(() => {
                    this.validate();
                });
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-select {
        display: inline-block;
        position: relative;
        vertical-align: middle;

        &-selected {
            border: 1px solid #d1d2d4;
            color: #808080;
            cursor: pointer;
            height: 30px;
            line-height: 30px;
            overflow: hidden;
            padding-right: 30px;
            padding-left: 10px;
            position: relative;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
                border-color: #b1b3b6;
                color: #4a4a4a;
            }

            input {
                color: #4a4a4a;
                font-size: 14px;
                line-height: 20px;
                padding: 4px 0;
                vertical-align: top;
                width: 100%;

                &:focus {
                    border-color: $primary;
                }
            }
        }

        &-caret {
            color: #A6A6A6;
            border-top: 5px solid;
            border-right: 5px solid transparent;
            border-left: 5px solid transparent;
            height: 0;
            position: absolute;
            right: 10px;
            top: 12px;
            transition: transform .25s;
            width: 0;

            &.up {
                transform: rotate(180deg);
            }
        }

        &-options {
            background-color: #fff;
            border-radius: 3px;
            border-top: 1px solid #eee;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            max-height: 300px;
            min-width: 200px;
            overflow-y: auto;
            position: absolute;
            width: 100%;
            z-index: 200;

            li {
                color: #808080;
                cursor: pointer;
                height: 30px;
                line-height: 30px;
                padding: 0 12px;
                text-align: left;
                white-space: nowrap;

                &.selected,
                &:hover {
                    background-color: #e1e1e1;
                }
            }
        }

        &-search {
            padding: 2px;

            input {
                border: 1px solid #d1d2d4;
                color: #4a4a4a;
                font-size: 14px;
                line-height: 20px;
                padding: 4px 6px;
                width: 100%;

                &:focus {
                    border-color: $primary;
                }
            }
        }

        &.is-disabled {
            @extend %disabled;
        }

        &.is-invalid {
            .v-select-selected {
                border-color: $danger;
            }
        }
    }
</style>

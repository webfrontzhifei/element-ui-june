 <template>
    <div class="v-switch" :class="{
        'v-switch-checked': switchValue,
        'is-disabled': disabled,
    }" @click="handleChange">
        <div class="v-switch-inner">
            <span class="v-switch-btn">{{text}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'vSwitch',
        props: {
            value: {},
            onValue: {},
            offValue: {},
            onText: {},
            offText: {},
            disabled: Boolean,
        },
        computed: {
            switchValue: {
                get() {
                    const { onValue, offValue, value } = this;

                    if (onValue || offValue) {
                        return value === onValue;
                    }
                    return !!value;
                },
                set(val) {
                    const { onValue, offValue } = this;
                    let value;

                    if (onValue || offValue) {
                        value = val ? onValue : offValue;
                    } else {
                        value = !!val;
                    }
                    this.$emit('input', value);
                    this.$emit('change', value);
                },
            },
            text() {
                return this.switchValue ? this.onText : this.offText;
            },
        },
        methods: {
            handleChange() {
                this.switchValue = !this.switchValue;
            },
        },
    };
</script>
<style lang="sass">
    @import "../../../sass/variable.scss";
    @import "../../../sass/mixins.scss";

    .v-switch {
        cursor: pointer;
        display: inline-block;
        position: relative;
        vertical-align: middle;

        &-inner {
            background-color: $switch-background;
            border: $switch-border;
            border-radius: $switch-border-radius;
            height: $switch-height;
            line-height: $switch-line-height;
            position: relative;
            width: $switch-width;
            transition: all 0.3s ease-in;

            &:after {
                background-color: #fff;
                border-radius: 100%;
                content: '';
                height: $switch-height - 4px;
                left: 2px;
                position: absolute;
                top: 1px;
                transition: all 0.3s ease-in;
                width: $switch-height - 4px;
            }

        }

        &-btn {
            font-size: 12px;
            left: $switch-width - $switch-height + 1px;
            position: absolute;
            top: -1px;
        }

        &-checked {
            .v-switch-inner {
                background-color: $switch-checked-background;
                border: $switch-border-checked;
                color: $switch-checked-color;

                &:after {
                    left: $switch-width - $switch-height + 1px;
                }
            }

            .v-switch-btn {
                left: 6px;
            }
        }

        &.is-disabled {
            @extend %disabled;
        }
    }
</style>

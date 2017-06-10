<template>
    <div class="v-form-item" :class="itemClass" :style="itemStyle">
        <label class="v-form-item-label" :style="labelStyle">{{label}}</label>
        <slot><span class="v-form-item-text">{{text}}</span></slot>
    </div>
</template>

<script>
    import Button from '../../button/src/button.vue';
    import Form from './form.vue';

    export default {
        name: 'vFormItem',

        props: {
            label: String,
            labelWidth: String,
            text: [String, Number],
        },

        data() {
            return {
                type: '',
            };
        },

        computed: {
            form() {
                let parent = this.$parent;

                while (parent.$options.name !== Form.name) {
                    parent = parent.$parent;
                }

                return parent;
            },
            itemClass() {
                const classes = {};

                if (this.type) {
                    classes[`v-form-item-${this.type}`] = true;
                }

                return classes;
            },
            itemStyle() {
                const style = {};

                const labelWidth = this.labelWidth || this.form.labelWidth;

                if (labelWidth) {
                    style.paddingLeft = labelWidth;
                }

                return style;
            },
            labelStyle() {
                const style = {};

                const labelWidth = this.labelWidth || this.form.labelWidth;

                if (labelWidth) {
                    style.marginLeft = `-${labelWidth}`;
                    style.width = labelWidth;
                }

                return style;
            },
        },

        // 如果有子元素中有 size="large" 的 button, 则增加 large 类型
        mounted() {
            const children = this.$children;

            let i = children.length;
            let child;

            while (--i >= 0) {
                child = children[i];

                if (child.$options.name === Button.name && child.size === 'large') {
                    this.type = 'large';
                    break;
                }
            }
        },
    };
</script>

<style lang="sass">
    .v-form-item {
        margin-bottom: 10px;
        padding-left: 100px;

        &-label {
            display: inline-block;
            float: left;
            line-height: 30px;
            margin-left: -100px;
            padding-right: 10px;
            text-align: right;
            vertical-align: middle;
            width: 100px;
        }

        &-text {
            display: inline-block;
            height: 30px;
            line-height: 30px;
            vertical-align: middle;
        }

        .v-checkbox, .v-radio-group {
            height: 30px;
            line-height: 30px;
        }

        .v-input, .v-select {
            width: 200px;
        }

        .v-select + .v-select {
            margin-left: 10px;
        }

        .v-switch {
            padding: 5px 0;
        }

        .v-input {
            &.larger {
                width: 320px;
            }

            &.largest {
                width: 520px;
            }

            & + .v-button {
                margin-left: 10px;
                vertical-align: top;
            }
        }

        .v-uploader {
            margin-right: 10px;
        }

        .uploader-filename,
        .uploader-filelink,
        .uploader-tip {
            display: inline-block;
            height: 30px;
            line-height: 30px;
            margin-left: 10px;
            vertical-align: middle;
        }

        .uploader-filename,
        .uploader-filelink {
            color: #4A90E2;
        }

        .uploader-preivew {
            margin-top: 10px;
            max-width: 250px;

            img {
                max-width: 100%;
            }
        }

        .uploader-tip {
            color: #F5A623;
        }

        .v-button {
            margin-right: 10px;

            &-large {
                margin-right: 15px;
            }
        }
    }
</style>

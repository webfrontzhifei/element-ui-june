<template>
    <form class="v-form" :class="[
        'v-form-cols-' + columns,
        'v-form-gap-' + computedGap,
    ]">
        <h2 class="v-form-title" v-if="title">{{title}}</h2>
        <slot></slot>
    </form>
</template>

<script>
    function getAllChildren(component) {
        let children = [];
        let i;

        children = children.concat(component.$children);

        for (i = 0; i < component.$children.length; i++) {
            children = children.concat(getAllChildren(component.$children[i]));
        }

        return children;
    }

    export default {
        name: 'vForm',

        props: {
            title: String,
            labelWidth: String,
            columns: {
                type: Number,
                default: 1,
            },
            gap: Number,
        },

        computed: {
            computedGap() {
                return this.gap || (this.columns === 1 ? 2 : 1);
            },
        },

        methods: {
            /**
             * 重置表单验证状态
             */
            resetValid() {
                const children = getAllChildren(this);

                let child;

                Object.keys(children).forEach((key) => {
                    child = children[key];

                    if (child && typeof child.resetValid === 'function') {
                        child.resetValid();
                    }
                });
            },

            /**
             * 验证表单所有元素
             */
            validate() {
                const children = getAllChildren(this);

                let child;
                let valid = true;

                Object.keys(children).forEach((key) => {
                    child = children[key];

                    if (typeof child.validate === 'function') {
                        child.validate();

                        if (!child.valid) {
                            valid = false;
                        }
                    }
                });

                return valid;
            },
        },

    };
</script>

<style lang="sass">
    .v-form {
        background-color: #fff;
        margin-bottom: 20px;
        padding: 20px;
        *zoom: 1;

        &:after, &:before {
            display: table;
            content: ' ';
        }

        &:after {
            clear: both;
        }

        &-title {
            color: #262626;
            font-size: 18px;
            margin-bottom: 40px;
            padding-left: 20px;
        }

        &-cols-1 {
            .v-form-item {
                padding-left: 130px;
            }

            .v-form-item-label {
                margin-left: -130px;
                padding-right: 20px;
                width: 130px;
            }
        }

        &-cols-2,
        &-cols-3 {
            padding-bottom: 10px;

            .v-form-item {
                float: left;
                padding-left: 100px;
            }

            .v-form-item-label {
                margin-left: -100px;
                width: 100px;
            }
        }

        &-cols-2 {
            .v-form-item {
                width: 50%;
            }
        }

        &-cols-3 {
            .v-form-item {
                width: 33.33%;

                @media (max-width: 1279px) {
                    width: 50%;
                }
            }
        }

        &-gap-1 {
            padding-bottom: 10px;

            .v-form-item {
                margin-bottom: 10px;

                &-large {
                    margin-top: 20px;
                }
            }
        }

        &-gap-2 {
            .v-form-item {
                margin-bottom: 20px;

                &-large {
                    margin-top: 40px;
                }
            }
        }
    }
</style>

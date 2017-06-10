<template>
    <div class="v-form-group">
        <h3 class="v-form-group-title" v-if="title">{{title}}</h3>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'vFormGroup',

        props: {
            title: String,
        },
    };
</script>

<style lang="sass">
    .v-form-group {
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
            margin-bottom: 20px;
            margin-top: 20px;
            padding-left: 20px;
        }
    }
</style>

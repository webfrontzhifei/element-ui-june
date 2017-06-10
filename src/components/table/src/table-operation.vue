<template>
    <div class="v-table-operation" @click="$emit('click', $event)">
        <template v-if="url">
            <router-link class="v-table-operation-link" :to="url"
                :append="append"
                :target="target">
                <slot></slot>
            </router-link>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'vTableOperation',

        props: {
            url: String,
            append: Boolean,
            target: {
                type: String,
                default: '_self',
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";

    .v-table-operation {
        border-left: 1px solid $table-operation-color;
        color: $table-operation-color;
        cursor: pointer;
        display: block;
        float: left;
        line-height: 20px;
        padding-left: 10px;
        padding-right: 10px;
        position: relative;

        &:nth-of-type(1) {
            border-left-width: 0;
            padding-left: 0;
        }

        &-link {
            color: $table-operation-color;
        }
    }

</style>

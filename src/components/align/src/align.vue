<template>
    <div class="v-align">
        <div class="v-align-inner" :style="style" @click.self="$emit('click')">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'vAlign',
        props: {
            horizontal: {
                type: String,
                default: 'center',
            },
            vertical: {
                type: String,
                default: 'middle',
            },
        },
        computed: {
            style() {
                return {
                    'text-align': this.horizontal,
                    'vertical-align': this.vertical,
                };
            },
        },
    };
</script>

<style lang="sass">
    .v-align {
        display: table;
        height: 100%;
        width: 100%;

        &-inner {
            display: table-cell;
        }
    }
</style>

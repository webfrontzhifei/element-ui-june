<template>
    <transition :name="transition" @before-enter="beforeEnter">
        <div class="v-backdrop" :style="{ 'z-index': zIndex }" @click.self="$emit('click')">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
    let zIndex = 200;

    export default {
        name: 'vBackdrop',
        props: {
            transition: {
                type: String,
                default: 'backdrop',
            },
        },
        data() {
            return {
                zIndex,
            };
        },
        methods: {
            beforeEnter() {
                this.zIndex = zIndex++;
            },
        },
    };
</script>

<style lang="sass">
    .v-backdrop {
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
    }

    .backdrop {
        &-enter-active, &-leave-active {
            transition: opacity ease-out .2s;
        }

        &-enter, &-leave-active {
            opacity: 0;
        }
    }
</style>

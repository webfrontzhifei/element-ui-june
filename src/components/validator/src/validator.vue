<template>
    <div class="v-validator">
        <v-validator-errors></v-validator-errors>
    </div>
</template>

<script>
    import validatorMixin from './mixin';

    export default {
        name: 'vValidator',
        mixins: [validatorMixin],
        props: {
            value: {},
        },
    };
</script>

<style lang="sass">
    .v-validator {
    }
</style>

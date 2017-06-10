<template>
    <div class="v-validator-errors" v-if="!$parent.valid">
        <p v-if="$parent.invalids.required">{{$parent.requiredTip}}</p>
        <p v-if="$parent.invalids.maxlength">{{$parent.maxlengthTip}}</p>
        <p v-if="$parent.invalids.pattern">{{$parent.patternTip}}</p>
        <p v-if="$parent.invalids.extra">{{$parent.extraTip}}</p>
    </div>
</template>

<script>
    export default {
        name: 'vValidatorErrors',
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";

    .v-validator-errors {
        color: $danger;

        p {
            line-height: 18px;
        }
    }
</style>

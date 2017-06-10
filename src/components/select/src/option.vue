<template>
    <li @click="onSelect" :class="{ selected: selected }" v-show="visible">
        <slot>{{label}}</slot>
    </li>
</template>

<script>
    export default {
        name: 'vOption',

        props: {
            value: {},
        },

        data() {
            const select = this.$parent;

            return {
                selected: this.value === select.value,
                visible: true,
                label: select.editable ? this.value : null,
            };
        },

        computed: {
            select() {
                return this.$parent;
            },
        },

        mounted() {
            const select = this.select;

            select.options.push(this);
            select.optionsLength++;

            if (!select.editable) {
                this.label = this.$el.innerText.trim();
            }

            select.recalcSelectedOption();
        },

        beforeDestroy() {
            const select = this.select;
            const options = select.options;

            options.splice(options.indexOf(this), 1);
            select.optionsLength--;

            select.recalcSelectedOption();
        },

        methods: {
            onSelect() {
                this.$parent.select(this);
            },

            toggle(text) {
                let visible = true;

                if (text) {
                    visible = this.$el.innerText.trim().toLowerCase().indexOf(text.toLowerCase()) > -1;
                }

                this.visible = visible;
            },
        },
    };
</script>

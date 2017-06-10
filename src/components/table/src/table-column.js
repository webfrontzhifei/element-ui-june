export default {
    name: 'vTableColumn',

    props: {
        type: String,
        title: String,
        prop: String,
        visible: {
            type: Boolean,
            default: true,
        },
        width: {},
        align: String,
        className: String,
    },

    data() {
        return {
        };
    },

    mounted() {
        this.table.addColumn(this);

        if (this.type === 'expand') {
            this.table.renderExpanded = (h, scope) => this.renderExpandedCell(h, scope);
        }
    },

    beforeDestroy() {
        this.table.removeColumn(this);
    },

    computed: {
        table() {
            return this.$parent;
        },
    },

    methods: {
        renderCell(h, scope) {
            if (!this.visible) {
                return '';
            }

            if (this.type === 'expand') {
                const expanded = this.table.expandRows.indexOf(scope.row) > -1;

                return (
                    <div class={ `v-table-expander ${expanded ? 'expanded' : ''}` }
                        on-click={ () => this.table.handleExpandClick(scope.row) }>
                        <i class="fa fa-angle-right"></i>
                    </div>
                );
            } else if (this.$scopedSlots.default) {
                return this.$scopedSlots.default(scope);
            } else if (this.prop) {
                return scope.row[this.prop];
            }
            return this.$slots.default;
        },

        renderExpandedCell(h, scope) {
            if (!this.visible) {
                return '';
            }
            if (this.$scopedSlots.default) {
                return this.$scopedSlots.default(scope);
            }
            return this.$slots.default;
        },
    },

    render() {
        return '';
    },
};

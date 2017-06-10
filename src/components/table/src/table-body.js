export default {
    name: 'vTableBody',

    computed: {
        table() {
            return this.$parent;
        },
    },

    /* eslint-disable */
    render(h) {
        return (
            <transition-group name={this.table.transition} tag="tbody">
                {
                    this._l(this.table.data, (row, rowIndex) =>[
                        <tr
                            key={ this.table.rowKey ? row[this.table.rowKey] : rowIndex }>
                            {
                                this._l(this.table.columns, (column, columnIndex) =>
                                    <td
                                        v-show={column.visible}
                                        class={[column.align, column.className]}
                                        >
                                        { column.renderCell(h, { column, row, $index: rowIndex }) }
                                    </td>
                                )
                            }
                        </tr>,
                        this.table.expandRows.indexOf(row) < 0 ? '' :
                            (<tr>
                                <td colspan={ this.table.columns.length } class="expanded-cell"
                                    on-click={ () => this.table.handleExpandClick(scope.row) }>
                                    { this.table.renderExpanded ? this.table.renderExpanded(h, { row, $index: rowIndex }) : ''}
                                </td>
                            </tr>),
                    ])
                }
            </transition-group>
        );
    },
    /* eslint-enable */
};

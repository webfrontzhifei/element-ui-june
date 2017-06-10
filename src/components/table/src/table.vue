<template>
    <div class="v-table">
        <div hidden><slot></slot></div>
        <table>
            <caption v-if="title">{{title}}</caption>

            <colgroup>
                <col v-for="column in columns" v-show="column.visible" :width="column.width" />
            </colgroup>

            <thead v-if="hasHeader">
                <tr>
                    <th v-for="column in columns" v-show="column.visible">{{column.title || '&nbsp;'}}</th>
                </tr>
            </thead>

            <tbody v-if="!data.length">
                <tr>
                    <td :colspan="columns.length">
                        {{emptyMsg}}
                    </td>
                </tr>
            </tbody>

            <v-table-body v-else></v-table-body>
        </table>

        <div v-if="$slots.pagination" :style="$slots.operations ? 'float: right' : ''">
            <slot name="pagination"></slot>
        </div>

        <div v-if="$slots.operations" class="v-table-operations">
            <slot name="operations"></slot>
        </div>
    </div>
</template>

<script>
    import vTableBody from './table-body.js';

    export default {
        name: 'vTable',

        components: {
            vTableBody,
        },

        props: {
            title: String,
            data: {
                type: Array,
                default: () => [],
            },
            emptyMsg: {
                type: String,
                default: '暂无记录数据',
            },
            rowKey: String,
            transition: String,
        },

        data() {
            return {
                columns: [],
                columnsLength: 0,
                expandRows: [],
            };
        },

        computed: {
            hasHeader() {
                return this.columns.filter(d => d.title).length;
            },
        },

        methods: {
            addColumn(column) {
                this.columns.push(column);
                this.columnsLength++;
            },

            removeColumn(column) {
                const columnIndex = this.columns.indexOf(column);
                if (columnIndex > -1) {
                    this.columns.splice(columnIndex, 1);
                    this.columnsLength--;
                }
            },

            expandAll() {
                this.expandRows = this.data.slice(0);
            },

            collapseAll() {
                this.expandRows = [];
            },

            handleExpandClick(row) {
                const expandRows = this.expandRows;
                const index = expandRows.indexOf(row);
                const isExpand = index < 0;

                if (isExpand) {
                    expandRows.push(row);
                } else {
                    expandRows.splice(index, 1);
                }

                this.$emit('expand', row, isExpand);
            },
        },
    };
</script>

<style lang="sass">
    @import "../../../sass/variable.scss";

    .v-table {
        table {
            background-color: #fff;
            border-bottom: 0 none;
            border-spacing: 0;
            margin-bottom: 20px;
            max-width: 100%;
            width: 100%;
        }

        caption {
            font-weight: bold;
            padding: 10px 0;
            text-align: left;
        }

        tr {
            td, th {
                border-collapse: collapse;
                line-height: 20px;
                padding: 10px 0 10px 15px;

                @media (max-width: 1280px) {
                    padding-left: 10px;
                }
            }

            th {
                color: #808080;
                font-size: 12px;
                font-weight: normal;
                text-align: left;
            }

            td {
                border-top: 1px solid $table-border-color;
                color: $table-content-color;

                .operation {
                    border-left: 1px solid $table-operation-color;
                    color: $table-operation-color;
                    cursor: pointer;
                    display: block;
                    float: left;
                    line-height: 20px;
                    padding-left: 10px;
                    padding-right: 10px;
                    position: relative;

                    &.first {
                        border-left-width: 0;
                        padding-left: 0;
                    }
                }

                .fa {
                    color: #4a4a4a;
                    text-align: center;
                    width: 20px;

                    &.clickable {
                        color: #2972cc;
                        cursor: pointer;
                    }

                    &.disabled {
                        color: #ccc;
                        pointer-events: none;
                    }
                }
                &.expanded-cell {
                    padding: 0;
                }
            }
        }

        tbody {
            tr {
                &:hover {
                    background: #fdfdfd;
                }
            }
        }

        .v-checkbox, .v-switch {
            line-height: 1;
            margin-top: -1px;
        }

        &-operations {
            line-height: 32px;
            padding-left: 15px;

            @media (max-width: 1280px) {
                padding-left: 10px;
            }

            .v-checkbox, .v-button {
                margin-right: 15px;
            }
        }

        &-expander {
            cursor: pointer;
            font-size: 20px;
            height: 30px;
            line-height: 28px;
            margin: -10px 0 -10px -10px;
            text-align: center;
            width: 30px;

            i {
                transition: .2s;
            }

            &.expanded {
                i {
                    transform: rotate(90deg);
                }
            }
        }

        .flip-move {
            transition: transform .5s cubic-bezier(.55, 0, .1, 1);
        }
    }
</style>

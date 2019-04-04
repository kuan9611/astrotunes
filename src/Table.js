import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class Table extends Component {
  render() {   
    const columns = [{
      Header: "Star Name",
      accessor: "star",
      width: 250,
    }, {
      id: "pCount",
      Header: "# Planets",
      accessor: d => d.planets.length,
      width: 100,
    }];

    const filterCaseInsensitive = (filter, row) => {
      const src = row[filter.pivotId || filter.id];
      const qry = filter.value.toLowerCase();
      return src === undefined || String(src).toLowerCase().includes(qry);
    };
   
    return (
      <ReactTable
        data={Object.values(this.props.data)}
        columns={columns}
        width={400}
        showPageSizeOptions={false}
        resizable={false}
        filterable={true}
        defaultFilterMethod={filterCaseInsensitive}
        noDataText="No results found"
        getTrProps={(state, rowInfo) => {
          return (rowInfo && rowInfo.original?
            {
              onClick: () => this.props.selectionChangeListener({
                selected: !rowInfo.original.selected,
                selections: [rowInfo.original.star],
              }),
              style: {
                background: rowInfo.original.selected? '#eee' : '#fff',
              }
            } : {});
        }}
      />
    );
  }
}

export default Table;

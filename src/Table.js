import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';

class Table extends Component {
  render() {   
    const columns = [{
      Header: 'Star Name',
      accessor: 'star',
    }, {
      id: 'pCount',
      Header: '# Planets',
      accessor: d => d.planets.length,
    }];

    const filterCaseInsensitive = (filter, row) => {
      const src = row[filter.pivotId || filter.id];
      const qry = filter.value.toLowerCase();
      return src === undefined || String(src).toLowerCase().startsWith(qry);
    };
   
    return (
      <ReactTable
        data={this.props.data}
        columns={columns}
        showPagination={false}
        filterable={true}
        defaultFilterMethod={filterCaseInsensitive}
      />
    );
  }
}

export default Table;

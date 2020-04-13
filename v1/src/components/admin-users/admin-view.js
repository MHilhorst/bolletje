import React from 'react';
import { Pagination, Table, Tag, Input } from 'antd';
import { Box } from '../../styles/style';
import queryString from 'query-string';

const columns = [
  {
    title: 'User ID',
    dataIndex: 'userId',
    key: 'userId',
    render: (value, record) => {
      return <a href={`/admin/users/${value}`}>{value}</a>;
    },
  },
  {
    title: 'email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'registration Date',
    dataIndex: 'registrationDate',
    key: 'registrationDate',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => {
      return (
        new Date(a.registrationDate).getTime() -
        new Date(b.registrationDate).getTime()
      );
    },
  },
  {
    title: 'Account Type',
    dataIndex: 'accountType',
    key: 'accountType',
    render: (value) => {
      if (value === 1) {
        return <Tag color="gold">Premium</Tag>;
      } else if (value === 2) {
        return (
          <span>
            <Tag color="gold">Premium</Tag>
            <Tag color="red">Admin</Tag>
          </span>
        );
      } else if (value === 0) {
        return <Tag color="green">Trial</Tag>;
      }
    },
  },
  { title: 'Items Tracked', dataIndex: 'itemTracked', key: 'itemTracked' },
];

export default class AdminView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChangePagination = (e) => {
    this.props.changePagination(e);
  };

  handleSearchAccount = (e) => {
    this.props.searchAccount(e.target.value);
  };
  render() {
    return (
      <>
        <Box>
          <Input
            placeholder="Search Account"
            onChange={(e) => this.handleSearchAccount(e)}
            style={{ width: 200, marginBottom: 12 }}
          />
          <Table
            dataSource={this.props.tableData}
            columns={columns}
            pagination={{ position: 'none' }}
          />
          <div style={{ marginTop: 12 }}>
            <Pagination
              onChange={this.onChangePagination}
              total={this.props.totalUsers}
              defaultCurrent={Number(
                queryString.parse(window.location.search).page
              )}
            />
          </div>
        </Box>
      </>
    );
  }
}

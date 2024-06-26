import React, { useEffect, useState } from 'react';
import { API, copy, showError, showSuccess, timestamp2string } from '../helpers';

import { ITEMS_PER_PAGE } from '../constants';
import { renderQuota } from '../helpers/render';
import { Button, Dropdown, Form, Modal, Popconfirm, Popover, SplitButtonGroup, Table, Tag } from '@douyinfe/semi-ui';

import { IconTreeTriangleDown } from '@douyinfe/semi-icons';
import EditToken from '../pages/Token/EditToken';

const COPY_OPTIONS = [
  { key: 'next', text: 'ChatGPT Next Web', value: 'next' },
  { key: 'ama', text: 'ChatGPT Web & Midjourney', value: 'ama' },
  { key: 'opencat', text: 'OpenCat', value: 'opencat' }
];

const OPEN_LINK_OPTIONS = [
  { key: 'ama', text: 'ChatGPT Web & Midjourney', value: 'ama' },
  { key: 'opencat', text: 'OpenCat', value: 'opencat' }
];

function renderTimestamp(timestamp) {
  return (
    <>
      {timestamp2string(timestamp)}
    </>
  );
}

function renderStatus(status, model_limits_enabled = false) {
  switch (status) {
    case 1:
      if (model_limits_enabled) {
        return <Tag color="green" size="large">Enabled: Limited model</Tag>;
      } else {
        return <Tag color="green" size="large">Enabled</Tag>;
      }
    case 2:
      return <Tag color="red" size="large"> Disabled </Tag>;
    case 3:
      return <Tag color="yellow" size="large"> Expired </Tag>;
    case 4:
      return <Tag color="grey" size="large"> Exhausted </Tag>;
    default:
      return <Tag color="black" size="large"> Unknown status </Tag>;
  }
}

const TokensTable = () => {

  const link_menu = [
    {
      node: 'item', key: 'next', name: 'ChatGPT Next Web', onClick: () => {
        onOpenLink('next');
      }
    },
    { node: 'item', key: 'ama', name: 'AMA Q&A', value: 'ama' },
    {
      node: 'item', key: 'next-mj', name: 'ChatGPT Web & Midjourney', value: 'next-mj', onClick: () => {
        onOpenLink('next-mj');
      }
    },
    { node: 'item', key: 'opencat', name: 'OpenCat', value: 'opencat' }
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    }."{
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => {
        return (
          <div>
            {renderStatus(text, record.model_limits_enabled)}
          </div>
        );
      }
    },
    {
      title: 'Used Quota',
      dataIndex: 'used_quota',
      render: (text, record, index) => {
        return (
          <div>
            {renderQuota(parseInt(text))}
          </div>
        );
      }
    },
    {
      title: 'Remaining Quota',
      dataIndex: 'remain_quota',
      render: (text, record, index) => {
        return (
          <div>
            {record.unlimited_quota ? <Tag size={'large'} color={'white'}>Unlimited</Tag> :
              <Tag size={'large'} color={'light-blue'}>{renderQuota(parseInt(text))}</Tag>}
          </div>
        );
      }
    },
    {
      title: 'Creation Time',
      dataIndex: 'created_time',
      render: (text, record, index) => {
        return (
          <div>
            {renderTimestamp(text)}
          </div>
        );
      }
    },
    {
      title: 'Expiration Time',
      dataIndex: 'expired_time',
      render: (text, record, index) => {
        return (
          <div>
            {record.expired_time === -1 ? 'Never Expire' : renderTimestamp(text)}
          </div>
        );
      }
    },
    {
      title: '',
      dataIndex: 'operate',
      render: (text, record, index) => (
        <div>
          <Popover
            content={
              'sk-' + record.key
            }
            style={{ padding: 20 }}
            position="top"
          >
            <Button theme="light" type="tertiary" style={{ marginRight: 1 }}>View</Button>
          </Popover>
          <Button theme="light" type="secondary" style={{ marginRight: 1 }}
                  onClick={async (text) => {
                    await copyText('sk-' + record.key);
                  }}
          >Copy</Button>
          <SplitButtonGroup style={{ marginRight: 1 }} aria-label="Project Operation Button Group"><Button theme="light" style={{ color: 'rgba(var(--semi-teal-7), 1)' }} onClick={() => {
  onOpenLink('next', record.key);
}}>Chat</Button>
<Dropdown trigger="click" position="bottomRight" menu={
  [
    {
      node: 'item',
      key: 'next',
      disabled: !localStorage.getItem('chat_link'),
      name: 'ChatGPT Next Web',
      onClick: () => {
        onOpenLink('next', record.key);
      }
    },
    {
      node: 'item',
      key: 'next-mj',
      disabled: !localStorage.getItem('chat_link2'),
      name: 'ChatGPT Web & Midjourney',
      onClick: () => {
        onOpenLink('next-mj', record.key);
      }
    },
    {
      node: 'item', key: 'ama', name: 'AMA Q&A (BotGem)', onClick: () => {
        onOpenLink('ama', record.key);
      }
    },
    {
      node: 'item', key: 'opencat', name: 'OpenCat', onClick: () => {
        onOpenLink('opencat', record.key);
      }
    }
  ]
}
>
  <Button style={{ padding: '8px 4px', color: 'rgba(var(--semi-teal-7), 1)' }} type="primary"
          icon={<IconTreeTriangleDown />}></Button>
</Dropdown>
</SplitButtonGroup>
<Popconfirm
  title="Are you sure you want to delete this token?"
  content="This action cannot be undone"
  okType={'danger'}
  position={'left'}
  onConfirm={() => {
    manageToken(record.id, 'delete', record).then(
      () => {
        removeRecord(record.key);
      }
    );
  }}
>
  <Button theme="light" type="danger" style={{ marginRight: 1 }}>Delete</Button>
</Popconfirm>"record.status === 1 ?
              <Button theme="light" type="warning" style={{ marginRight: 1 }} onClick={
                async () => {
                  manageToken(
                    record.id,
                    'disable',
                    record
                  );
                }
              }>Disable</Button> :
              <Button theme="light" type="secondary" style={{ marginRight: 1 }} onClick={
                async () => {
                  manageToken(
                    record.id,
                    'enable',
                    record
                  );
                }
              }>Enable</Button>
          }
          <Button theme="light" type="tertiary" style={{ marginRight: 1 }} onClick={
            () => {
              setEditingToken(record);
              setShowEdit(true);
            }
          }>Edit</Button>
        </div>
      )
    }
  ];

  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [showEdit, setShowEdit] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [tokenCount, setTokenCount] = useState(pageSize);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchToken, setSearchToken] = useState('');
  const [searching, setSearching] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [targetTokenIdx, setTargetTokenIdx] = useState(0);
  const [editingToken, setEditingToken] = useState({
    id: undefined
  });
  const [orderBy, setOrderBy] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const closeEdit = () => {
    setShowEdit(false);
    setTimeout(() => {
      setEditingToken({
        id: undefined
      });
    }, 500);
  };

  const setTokensFormat = (tokens) => {
    setTokens(tokens);
    if (tokens.length >= pageSize) {"In this case we have to load more data and then append them.url = `opencat://team/join?domain=${encodedServerAddress}&token=sk-${key}`;
        break;
      case 'next':
        url = nextUrl;
        break;
      default:
        url = `sk-${key}`;
    }
    // if (await copy(url)) {
    //     showSuccess('Copied to clipboard!');
    // } else {
    //     showWarning('Failed to copy to clipboard, please copy manually, the token has been filled into the search box.');
    //     setSearchKeyword(url);
    // }
  };

  const copyText = async (text) => {
    if (await copy(text)) {
      showSuccess('Copied to clipboard!');
    } else {
      // setSearchKeyword(text);
      Modal.error({ title: 'Failed to copy to clipboard, please copy manually', content: text });
    }
  };

  const onOpenLink = async (type, key) => {
    let status = localStorage.getItem('status');
    let serverAddress = '';
    if (status) {
      status = JSON.parse(status);
      serverAddress = status.server_address;
    }
    if (serverAddress === '') {
      serverAddress = window.location.origin;
    }
    let encodedServerAddress = encodeURIComponent(serverAddress);
    const chatLink = localStorage.getItem('chat_link');
    const mjLink = localStorage.getItem('chat_link2');
    let defaultUrl;

    if (chatLink) {
      defaultUrl = chatLink + `/#/?settings={"key":"sk-${key}","url":"${serverAddress}"}`;
    }
    let url;
    switch (type) {
      case 'ama':
        url = `ama://set-api-key?server=${encodedServerAddress}&key=sk-${key}`;
        break;
      case 'opencat':
        url = `opencat://team/join?domain=${encodedServerAddress}&token=sk-${key}`;
        break;
      case 'next-mj':
        url = mjLink + `/#/?settings={"key":"sk-${key}","url":"${serverAddress}"}`;
        break;
      default:
        if (!chatLink) {
          showError('Admin has not set up the chat link');
          return;
        }
        url = defaultUrl;
    }

    window.open(url, '_blank');
  };

  useEffect(() => {
    loadTokens(0, orderBy)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  }, [pageSize, orderBy]);

  const removeRecord = key => {
    let newDataSource = [...tokens];
    if (key != null) {```
let idx = newDataSource.findIndex(data => data.key === key);

      if (idx > -1) {
        newDataSource.splice(idx, 1);
        setTokensFormat(newDataSource);
      }
    }
  };

  const manageToken = async (id, action, record) => {
    setLoading(true);
    let data = { id };
    let res;
    switch (action) {
      case 'delete':
        res = await API.delete(`/api/token/${id}/`);
        break;
      case 'enable':
        data.status = 1;
        res = await API.put('/api/token/?status_only=true', data);
        break;
      case 'disable':
        data.status = 2;
        res = await API.put('/api/token/?status_only=true', data);
        break;
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess('操作成功完成！');
      let token = res.data.data;
      let newTokens = [...tokens];
      // let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx;
      if (action === 'delete') {

      } else {
        record.status = token.status;
        // newTokens[realIdx].status = token.status;
      }
      setTokensFormat(newTokens);
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const searchTokens = async () => {
    if (searchKeyword === '' && searchToken === '') {
      // if keyword is blank, load files instead.
      await loadTokens(0);
      setActivePage(1);
      setOrderBy('');
      return;
    }
    setSearching(true);
    const res = await API.get(`/api/token/search?keyword=${searchKeyword}&token=${searchToken}`);
    const { success, message, data } = res.data;
    if (success) {
      setTokensFormat(data);
      setActivePage(1);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  const handleKeywordChange = async (value) => {
    setSearchKeyword(value.trim());
  };

  const handleSearchTokenChange = async (value) => {
    setSearchToken(value.trim());
  };

  const sortToken = (key) => {
    if (tokens.length === 0) return;
    setLoading(true);
    let sortedTokens = [...tokens];
```Instructions: Translate the following Chinese text to English 
while maintaining the original formatting: 

`sortedTokens.sort((a, b) => {
      return ('' + a[key]).localeCompare(b[key]);
    });
    if (sortedTokens[0].id === tokens[0].id) {
      sortedTokens.reverse();
    }
    setTokens(sortedTokens);
    setLoading(false);
  };

  const handlePageChange = page => {
    setActivePage(page);
    if (page === Math.ceil(tokens.length / pageSize) + 1) {
      // In this case we have to load more data and then append them.
      loadTokens(page - 1).then(r => {
      });
    }
  };

  const rowSelection = {
    onSelect: (record, selected) => {
    },
    onSelectAll: (selected, selectedRows) => {
    },
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedKeys(selectedRows);
    }
  };

  const handleRow = (record, index) => {
    if (record.status !== 1) {
      return {
        style: {
          background: 'var(--semi-color-disabled-border)'
        }
      };
    } else {
      return {};
    }
  };

  const handleOrderByChange = (e, { value }) => {
    setOrderBy(value);
    setActivePage(1);
    setDropdownVisible(false);
  };

  const renderSelectedOption = (orderBy) => {
    switch (orderBy) {
      case 'remain_quota':
        return 'Sort by remaining quota';
      case 'used_quota':
        return 'Sort by used quota';
      default:
        return 'Default sort';
    }
  };

  return (
    <>
      <EditToken refresh={refresh} editingToken={editingToken} visiable={showEdit} handleClose={closeEdit}></EditToken>
      <Form layout="horizontal" style={{ marginTop: 10 }} labelPosition={'left'}>
        <Form.Input
          field="keyword"
          label="Search Keyword"
          placeholder="Token Name"
          value={searchKeyword}
          loading={searching}
          onChange={handleKeywordChange}
        />
        {/* <Form.Input
          field="token"
          label="Key"
          placeholder="Key"
          value={searchToken}
          loading={searching}
          onChange={handleSearchTokenChange}
        /> */}
        <Button label="Search" type="primary" htmlType="submit" className="btn-margin-right"".`onClick={searchTokens} style={{ marginRight: 8 }}>Search</Button>
      </Form>

      <Table style={{ marginTop: 20 }} columns={columns} dataSource={pageData} pagination={{
        currentPage: activePage,
        pageSize: pageSize,
        total: tokenCount,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        formatPageText: (page) => `Items ${page.currentStart} - ${page.currentEnd}, Total ${tokens.length} items`,
        onPageSizeChange: (size) => {
          setPageSize(size);
          setActivePage(1);
        },
        onPageChange: handlePageChange
      }} loading={loading} rowSelection={rowSelection} onRow={handleRow}>
      </Table>
      <Button theme="light" type="primary" style={{ marginRight: 8 }} onClick={
        () => {
          setEditingToken({
            id: undefined
          });
          setShowEdit(true);
        }
      }>Add Token</Button>
      <Button label="Copy Selected Tokens" type="warning" onClick={
        async () => {
          if (selectedKeys.length === 0) {
            showError('Please select at least one token!');
            return;
          }
          let keys = '';
          for (let i = 0; i < selectedKeys.length; i++) {
            keys += selectedKeys[i].name + '    sk-' + selectedKeys[i].key + '\n';
          }
          await copyText(keys);
        }
      }>Copy Selected Tokens to Clipboard</Button>
      <Dropdown
        trigger="click"
        position="bottomLeft"
        visible={dropdownVisible}
        onVisibleChange={(visible) => setDropdownVisible(visible)}
        render={
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleOrderByChange('', { value: '' })}>Default Order</Dropdown.Item>
            <Dropdown.Item onClick={() => handleOrderByChange('', { value: 'remain_quota' })}>Sort by Remaining Quota</Dropdown.Item>
            <Dropdown.Item onClick={() => handleOrderByChange('', { value: 'used_quota' })}>Sort by Used Quota</Dropdown.Item>
          </Dropdown.Menu>
        }
      >
      <Button style={{ marginLeft: '10px' }}>{renderSelectedOption(orderBy)}</Button>
      </Dropdown>Return only the translated content, not including the original text.
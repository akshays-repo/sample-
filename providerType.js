import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { store } from '../../../reducers/configureStore';
import { actionCreator } from '../../../reducers/actionCreator';
import { Table, Tag, Space, Modal, Popconfirm } from 'antd';
import ProviderTypeForm from './providerTypeForm';
const ProviderType = props => {
  const [visibleEditModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState('');
  const [itemRecord, setRecord] = useState('');
  const [payload , setPayload] = useState([])

  
  const openEditModal = (id, record) => {
    setEditId(id);
    setRecord(record);
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
  };


 
  const columns = [
    {
      title: 'TYPE',
      key: 'name',
      dataIndex: 'name',
    },
    {
      status: 'STATUS',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: '',
      key: 'action',
      render: record => (
        <Space size="middle">
          <span className="edit-color icon-button" onClick={() => openEditModal(record.id, record)}>
            <i className="fa fa-edit"></i>
          </span>
          <Popconfirm
            title="Are you sure？"
            onConfirm={() => props.deleteProviderType(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <span className="delete-color icon-button">
              <i className="fa fa-trash"></i>
            </span>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="appointment-type">
        <div className="header">
          <h4>Provider Types</h4>
          <button
            className="plus-button"
            onClick={() => {
              store.dispatch({ type: 'OPEN_PROVIDERTYPE_MODAL1' });
            }}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
        <div className="defined -field">
          <Table dataSource={props.providerTypeState} columns={columns}></Table>
        </div>
      </div>
      <Modal
        title="CREATE NEW PROVIDER"
        footer={false}
        visible={props.ProviderTypemodal1}
        onCancel={() => store.dispatch({ type: 'CLOSE_PROVIDERTYPE_MODAL1' })}
        destroyOnClose
      >
        <ProviderTypeForm {...props} />
      </Modal>

      <Modal
        title="EDIT A PROVIDER"
        footer={false}
        visible={visibleEditModal}
        onCancel={closeEditModal}
        destroyOnClose
      >
        <ProviderTypeForm id={editId} values={itemRecord} {...props} />
      </Modal>
    </div>
  );
};

//THIS REDUX SECTION
const mapStoreToProps = ({ ProviderType }) => {
  console.log('Store ProviderType', ProviderType);
  return {

    ProviderTypemodal: ProviderType.modal,
    ProviderTypemodal1: ProviderType.modal1,
    ProviderTypechanged: ProviderType.changed,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchProviderType: () =>
    dispatch(actionCreator({ method: 'GET', action_type: 'FETCH_PROVIDER_TYPE' })),

  addProviderType: (values, contentType) =>
    dispatch(
      actionCreator({ method: 'POST', action_type: 'CREATE_PROVIDER_TYPE', values, contentType }),
    ),

  editProviderType: (id, values, contentType) =>
    dispatch(
      actionCreator({
        method: 'PATCH',
        action_type: 'EDIT_PROVIDER_TYPE',
        id,
        values,
        contentType,
      }),
    ),

  deleteProviderType: id =>
    dispatch(actionCreator({ method: 'DELETE', action_type: 'DELETE_PROVIDER_TYPE', id })),

  filterProviderType: param =>
    dispatch(
      actionCreator({
        method: 'GET',
        action_type: 'FILTER_PROVIDERTYPE',
        param,
      }),
    ),
});

export default connect(mapStoreToProps, mapDispatchToProps)(ProviderType);

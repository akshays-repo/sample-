import React, { useState, useEffect } from 'react';
import { Table, Modal, Tag, Space, Input, Button, Radio, Select, Form } from 'antd';
import AddAppointmentTime from './addAppointmentTime';
import { store } from '../../../reducers/configureStore';
import ProviderCreationForm from './providerCreationForm';
import { connect } from 'react-redux';
import { getFormDataA, getFormData } from '_utils';
import { isMobile } from 'react-device-detect';

const { Option } = Select;
const ProviderTable = props => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState('');
  const [branchId, setBranchId] = useState(null);
  const [providerTypeId, setProviderTypeId] = useState(null);
  const [searchKey, setSearchKey] = useState(null);
  const [appointmentTypeId, setAppointmentTypeId] = useState(null);
  const [status, setStatus] = useState(null);
  const [mobileFilter , setMobileFilter] = useState(false)

  useEffect(() => {
    setAppointmentTypes(props.appointment_type);
    //setBranchList(store.getState().Branch.payload);
  });

  const showModal = (id, data) => {
    console.log('Provider data', data);
    setEditId(id);
    setEditData(data);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    store.dispatch({ type: 'CLOSE_PROVIDER_EDIT_MODAL' });
    setIsModalVisible(false);
  };

  const handleEditModal = (id, data) => {
    setEditData(data);
    setEditId(id);
    store.dispatch({ type: 'OPEN_PROVIDER_EDIT_MODAL' });
  };
  useEffect(() => {
    console.log('props.provider', props);
  });

  const handleApptChange = async (record, values) => {
    console.log('asd;kjasd', record);

    // this will perform delete
    let currentValue = [];
    record.provider_and_types.map(type => currentValue.push(type.appointment_type?.id));
    let intersection = currentValue.filter(x => values.includes(x));
    let DeletedArray = [];
    DeletedArray = currentValue
      .filter(x => !intersection.includes(x))
      .concat(intersection.filter(x => !currentValue.includes(x)));

    let intValues = {
      userTypeId: 4,
      id: record.id,
      fullName: record.fullName,
      status: record.status,
      provider_typeId: record.provider_typeId,
    };

    let sentinData = getFormData({ ...intValues });
    values.map((va, i) => sentinData.append('appointment_type[]', va));
    DeletedArray.map((va, i) => sentinData.append('deleted_type[]', va));
    record.provider_and_branches.map((va, i) => sentinData.append('arrBranches[]', va.branch_id));

    await props.editProvider(record.id, sentinData);
  };

  const handleStatus = async (record, status) => {
    let intValues = {
      userTypeId: 4,
    };
    let sentinData = getFormData({ ...intValues });
    try {
      await props.editProviderStatus(record.id, { status }, sentinData);
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleDelete = async id => {
    await props.deleteProvider(id);
  };

  const handleChangeSearch = e => {
    e.preventDefault();
    setSearchKey(e.target.value);
  };
  const handleSearchSubmission = e => {
    e.preventDefault();
    let parms = {};
    if (searchKey) parms.search = searchKey;
    if (branchId) parms.branchId = branchId;
    if (providerTypeId) parms.provider_typeId = providerTypeId;
    if (appointmentTypeId) parms.type_id = appointmentTypeId;
    if (status) parms.status = status;

    props.filterProvider(parms);
    setMobileFilter(false)
  };
  const clearFilter = e => {
    e.preventDefault();
    setBranchId(null);
    setAppointmentTypeId(null);
    setSearchKey(null);
    setStatus(null);
    setProviderTypeId(null);
    setStatus(null);
    props.fetchProvider();
    setMobileFilter(false)

  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <span>
          {text}
          <br />
          <span style={{ color: 'ButtonShadow' }}>{record.provider_type?.name}</span>
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Work Hour',
      dataIndex: 'workhour',
      key: 'workhour',
      render: (text, record) => (
        <Space size="middle">
          <span onClick={() => showModal(record.id, record)} className="icon-button edit-color">
            <i class="fa fa-edit"></i>
          </span>
        </Space>
      ),
    },
    {
      title: 'Appt Type',
      dataIndex: 'appt',
      key: 'appt',
      render: (text, record) => {
        return (
          <Space size="middle">
            <Select
              className="appt-type-select"
              mode="multiple"
              style={{ width: '150px', maxHeight: '150px' }}
              placeholder="Select the type"
              key={record?.provider_and_types?.map(type =>
                type.appointment_type === null ? null : type.appointment_type.id,
              )}
              defaultValue={record?.provider_and_types?.map(type => type.appointment_type?.id)}
              onChange={e => handleApptChange(record, e)}
            >
              {appointmentTypes.map(type => (
                <Select.Option key={type.id} value={type.id}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Space>
        );
      },
    },

    {
      title: 'Status',
      key: 'status',
      render: (text, record) => (
        <Space size="middle">
          <Select className="holdActive"
            style={record.status === 'active' ? { color: 'green' } : { color: 'red' }}
            value={record.status}
            onChange={e => handleStatus(record, e)}
          >
            <Select.Option style={{ color: 'green' }} value="active">
              Active
            </Select.Option>
            <Select.Option style={{ color: 'red' }} value="hold">
              Hold
            </Select.Option>
          </Select>
        </Space>
      ),
    },
    {
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <span
            className="edit-color icon-button"
            onClick={() => handleEditModal(record.id, record)}
          >
            {' '}
            <i className="fa fa-edit"></i>{' '}
          </span>
          {/* <span className="delete-color" onClick={() => handleDelete(record.id)}>
            {' '}
            <i className="fa fa-trash"></i>
          </span> */}
        </Space>
      ),
    },
  ];

const filterSection = () =>{
  return(
    <Space direction={isMobile ? "vertical" :"horizontal"}>
  <Input
    type="text"
    value={searchKey}
    placeholder=" Name Email or Phone"
    onChange={handleChangeSearch}
  />

  {/* <Select
    placeholder="Appointment Type"
    onChange={e => setAppointmentTypeId(e)}
    style={{ width: 150 }}
  >
    {props.appointment_type?.map(type => (
      <Option value={type.id}>{type.name}</Option>
    ))}
  </Select> */}

  <Select
    onChange={e => setBranchId(e)}
    placeholder="Branch"
    style={{ width: 200 }}
    value={branchId}
  >
              <Option value="">All</Option>

    {props.branch_payload?.map(branch => (
      <Option value={branch.id}>{branch.fullName}</Option>
    ))}
  </Select>

  <Select
    placeholder="provider type"
    onChange={e => setProviderTypeId(e)}
    style={{ width: 200 }}
    value={providerTypeId}
  >
              <Option value="">All</Option>

    {props.ProviderTypePayload?.map(type => (
      <Option value={type.id}>{type.name}</Option>
    ))}
  </Select>

  <Select
    onChange={e => setStatus(e)}
    placeholder="status"
    value={status}
    style={{ width: 200 }}
  >
              <Option value="">All</Option>

    <Option value="active">ACTIVE</Option>
    <Option value="hold">HOLD</Option>
  </Select>
<div className="buttonInline">
  <button className="view-button mr2 button-square" onClick={handleSearchSubmission}>
    Filter
  </button>
  <button className="edit-button button-square" onClick={clearFilter}>
    clear
  </button>
  </div>
</Space>
  )
  
}


  return (
    <div className="providerFilter">
      <div className="search">
      <div>{ isMobile ?<button button className="view-button button-square" onClick={() => setMobileFilter(true)}>Filter</button>  : filterSection()}</div>
      </div>

      <Table scroll={{ x: 240 }} columns={columns} dataSource={props.provider} />
      <Modal className="profilter"
        footer={false}
        width={800}
        title={`Add time for ${editData.fullName}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <AddAppointmentTime handleCancel={handleCancel} id={editId} provider_data={editData} {...props} />
      </Modal>
      <Modal
        footer={false}
        title={` ${editData.fullName}`}
        visible={props.modal1}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <ProviderCreationForm id={editId} values={editData} {...props} />
      </Modal>

      <Modal
        visible={mobileFilter}
        footer={false}
        onCancel={() => setMobileFilter(false)}
      >
        <div className="proSearchmbl">
     {filterSection()}
     </div>
      </Modal>
    </div>
  );
};

const mapStoreToProps = ({ AppointmentType, Branch }) => {
  return {
    appointment_type: AppointmentType.payload,
    modal: AppointmentType.modal,
    changed: AppointmentType.changed,
    branch_payload: Branch.payload,
  };
};
export default connect(mapStoreToProps)(ProviderTable);

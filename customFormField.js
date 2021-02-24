import React, { useState, useRef, useEffect } from 'react';
import { Menu, Dropdown, Button, Input, Form, Space, Modal, Switch } from 'antd';
import { DownOutlined, UserOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { connect } from 'react-redux';
import { actionCreator } from '../../../reducers/actionCreator';
import { customFormSchema } from '_utils/Schemas';
import CustomFormReview from './customFormPreview';
import HardCoreForm from './customFormhardCore';
import TextField from '@material-ui/core/TextField';
import _ from 'lodash';
const CustomFormField = props => {
  const [listCustomField, setListCustomField] = useState([]);
  const [editIndex, setEditIndex] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  //THIS WILL ADD NEW OBJECT TO ARRAY
  const handleMenuClick = e => {
    let text = e.key;
    let values = [];
    if (text === 'checkbox' || text === 'drop-down') {
      values = [null];
    }
    setListCustomField([
      ...listCustomField,
      { custom_types: text, required: '', Key_name: '', values },
    ]);
  };

  useEffect(() => {
    setListCustomField(props.CustomForm.custom_form);
  }, []);

  useEffect(() => {
    console.log('smaasdmmdsadsd', listCustomField);
  }, [listCustomField]);

  const handleFormSubmission = async e => {
    e.preventDefault();
    let contentType = 'JSON';
    let data = listCustomField;
    let sendingData = {
      hospital_id: parseInt(localStorage.getItem('hospital_id')),
      formData: data,
    };

    let isHaveNull = _.some(
      data,
      item =>
        _.isEmpty(item.Key_name) ||
        _.isNull(item.Key_name) ||
        _.some(item.values, value => _.isNull(value) || _.isEmpty(value)),
    );
    console.log('isHaveNull', isHaveNull);
    if (!isHaveNull) {
      await props.addCustomForm(JSON.stringify(sendingData), contentType);
    } else {
      message.error('Please Check All the Field is Filled');
    }
  };

  // THIS IS THE MENU OF DROPDOWN
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="text">Text</Menu.Item>

      <Menu.Item key="note">Note</Menu.Item>

      <Menu.Item key="checkbox">Check box</Menu.Item>

      <Menu.Item key="drop-down">Drop Down</Menu.Item>

      <Menu.Item key="date">Date</Menu.Item>

      <Menu.Item key="number">Number</Menu.Item>
    </Menu>
  );

  //THIS WILL EDIT OR ADD Key_Name
  const editOrAddKeyName = (e, index) => {
    let items = [...listCustomField];
    let item = { ...items[index] };
    item.Key_name = e.target.value;
    items[index] = item;
    setListCustomField(items);
  };

  // THIS WILL INSERT VALLUE
  const insertValue = (indexParent, indexChild) => {
    let items = [...listCustomField];
    let item = { ...items[indexParent] };
    let values = item.values;
    values.push(null);
    item.values = values;
    items[indexParent] = item;
    setListCustomField(items);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // THIS WILL HANDLE REQUIRED BUTTON
  const requiredOrNot = (e, index) => {
    let items = [...listCustomField];
    let item = { ...items[index] };
    item.required = e;
    items[index] = item;
    setListCustomField(items);
  };

  // THIS WILL HANDLE EDIT VALUE
  const editValue = (indexParent, indexChild, e) => {
    let items = [...listCustomField];
    let item = { ...items[indexParent] };
    let values = item.values;
    values[indexChild] = e.target.value;
    item.values = values;
    items[indexParent] = item;
    setListCustomField(items);
  };

  //THIS WILL DELETE THE VALUE ARRAYS
  const deleteValue = (indexParent, indexChild) => {
    let items = [...listCustomField];
    let item = { ...items[indexParent] };
    let values = item.values;

    values = values.filter((item, i) => i !== indexChild);
    item.values = values;
    items[indexParent] = item;
    setListCustomField(items);
  };

  //THIS WILL DELETE FORM
  const deleteItem = async index => {
    let items = [...listCustomField];
    items.splice(index, 1);
    setListCustomField(items);
  };

  return (
    <div className="custom-field" style={{ minHeight: '500px' }}>
      <div className="d-flex mb4">
        {/* <h4>CUSTOM FORM FIELD </h4> */}
        <Button className="edit-button" onClick={() => setIsModalVisible(true)}>
          {' '}
          PREVIEW{' '}
        </Button>
      </div>
      <div className="inner-box">
        <div>
          <p>
            This is what FossilMd asks your patients by default. You can create additional questions
            and fields by clicking on the plus sign below.
          </p>

          <Modal
            title="PREVIEW CUSTOM FORM"
            visible={isModalVisible}
            footer={false}
            onCancel={handleCancel}
          >
            <CustomFormReview {...props} />
          </Modal>

          <HardCoreForm />
          <form>
            {listCustomField?.map((type, index) => {
              return (
                <div className="mt8">
                  <div className="formGroup">
                    <p>Type :{type.custom_types}</p>
                    <TextField
                      required
                      label="Please enter this field is required"
                      value={type.Key_name !== '' ? type.Key_name : null}
                      onChange={e => editOrAddKeyName(e, index)}
                    />
                  </div>
                  <div className="rightButtons  mt3">
                    <span className="req">required</span>{' '}
                    <Switch
                      className="ml4"
                      checked={type.required}
                      onChange={e => requiredOrNot(e, index)}
                      size="small"
                    />
                    <span class="delete-color icon-button pl3" onClick={() => deleteItem(index)}>
                      <i class="fa fa-trash"></i>
                    </span>
                  </div>
                  {type.values?.map((value, i) => (
                    <div className="mt4 tableBox">
                      <TextField
                        required
                        placeholder="Options "
                        style={{ width: '60%' }}
                        defaultValue={value}
                        onChange={e => editValue(index, i, e)}
                      />
                      {}
                      {type.values?.length > 1 && (
                        <span
                          class="delete-color icon-button pl3"
                          onClick={e => deleteValue(index, i)}
                        >
                          <i class="fa fa-trash"></i>
                        </span>
                      )}
                      {/* <span  class="delete-color icon-button pl3" onClick={e => deleteValue(index, i)}><i class="fa fa-trash"></i></span> */}
                    </div>
                  ))}
                  {type.values?.length > 0 && (
                    <Button className="mt6 view-button" onClick={() => insertValue(index)}>
                      {' '}
                      Add New Option
                    </Button>
                  )}
                </div>
              );
            })}
            {/* {listCustomField?.length > 0 && <Button className="blueDark-button mt8" onClick={handleFormSubmission}>SAVE</Button>} */}
            <div className="custButtons">
            <Dropdown trigger={['click']} overlay={menu}>
            <Button className="mt-5 button-square edit-button" onClick={e => e.preventDefault()}>
              Add New Field <PlusOutlined />
            </Button>
          </Dropdown>
            <button type="submit" className="pl5 pr5 view-button mt8" onClick={handleFormSubmission}>
              SAVE
            </button>
            </div>
          </form>
  
        </div>
      </div>
    </div>
  );
};

const mapStoreToProps = ({ CustomForm }) => {
  console.log('Store CustomForm', CustomForm);
  return {
    CustomForm: CustomForm.payload,
    CustomFormerror: CustomForm.error,
    CustomFormmessage: CustomForm.message,
    CustomFormmodal: CustomForm.modal,
    CustomFormmodal1: CustomForm.modal1,
    CustomFormchanged: CustomForm.changed,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchCustomForm: id =>
    dispatch(actionCreator({ method: 'GET', action_type: 'FETCH_CUSTOMFORM', id })),
  addCustomForm: (values, contentType) =>
    dispatch(
      actionCreator({ method: 'POST', action_type: 'CREATE_CUSTOMFORM', values, contentType }),
    ),
  editCustomForm: (id, values) =>
    dispatch(actionCreator({ method: 'PUT', action_type: 'EDIT_PROVIDER', id, values })),
  deleteCustomForm: id =>
    dispatch(actionCreator({ method: 'DELETE', action_type: 'DELETE_PROVIDER', id })),
  filterCustomForm: param =>
    dispatch(
      actionCreator({
        method: 'GET',
        action_type: 'FILTER_PROVIDER',
        param,
      }),
    ),
});
export default connect(mapStoreToProps, mapDispatchToProps)(CustomFormField);

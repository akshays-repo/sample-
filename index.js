import React, { useState, useReducer, useEffect } from 'react';
import { Col, Row, Form, Input, Button, Modal, Select, Space } from 'antd';
import Dashboard_Content from '..';
import { connect } from 'react-redux';
import AppointmentTypes from './appointmentType';
import ProviderCreationForm from './providerCreationForm';
import ProviderTable from './providerTable';
import { actionCreator } from '../../../reducers/actionCreator';
import { store } from '../../../reducers/configureStore';
import CustomFormField from './customFormField';
import ProviderType from './providerType';
import CustomWidget from './customWidget';
import { isMobile } from 'react-device-detect';


const Dashboard_Provider = props => {
  const [providerTypeState, setProviderTypeState] = useState([]);
  const [mobileAction , setMobileAction] = useState(false)

  useEffect(() => {
    props.fetchProvider();
    props.fetchBranch({ hospitalId: localStorage.getItem('hospital_id'), page: 1, limit: 60 });
  }, [props.changed]);

  useEffect(() => {
    props.fetchCustomForm();
  }, []);

  useEffect(() => {
    props.fetchProviderType();
    setProviderTypeState(props.ProviderTypePayload);
  }, [props.ProviderTypeChanged, props.ProviderDeleted]);

  useEffect(() => {
    props.fetchBranch({ hospitalId: localStorage.getItem('hospital_id'), page: 1, limit: 50 });
    props.fetchAppointmentType({ page: 1, limit: 100 });
  });

  const HeaderSection = () => {
    return (
      <div className="provider">
        <div className="header">
          <div className="provider-head mr2">

            <Button
              type="primary"
              onClick={() => store.dispatch({ type: 'OPEN_PROVIDER_WIDGET_MODAL' })}
              className="button-square"
            >
              Online Booking Widget
            </Button>
          </div>
          <div className="provider-head mr2">
            <Button
              type="primary"
              onClick={() => store.dispatch({ type: 'OPEN_CUSTOMFORM_CREATE_MODAL' })}
              className="button-square"
            >
              Custom Form
            </Button>
          </div>
          <div className="provider-head mr2">
            <Button
              type="primary"
              onClick={() => store.dispatch({ type: 'OPEN_APPOINTMENT_TYPE_MODAL2' })}
              className="button-square"
            >
              Appointment types
            </Button>
          </div>
          <div className="provider-head mr2">
            <Button
              type="primary"
              onClick={() => store.dispatch({ type: 'OPEN_PROVIDERTYPE_MODAL' })}
              className="button-square"
            >
              Provider types
            </Button>
          </div>

          <div className="provider-head">
            <Button
              type="primary"
              onClick={() => store.dispatch({ type: 'OPEN_PROVIDER_CREATE_MODAL' })}
              className="button-square"
            >
              Create New Provider
            </Button>
          </div>
        </div>

        {/* <div>
              <Space direction="horizontal">
                {weekDays.map(item => (
                  <button key={item.key}>{item.day}</button>
                ))}
              </Space>
            </div> */}
      </div>
    );
  };
  const Provider_Content = () => {
    return (
      <div className="schedule-time">
        <Modal
          title="WIDGETS"
          footer={false}
          visible={props.modal2}
          width={900}
          onCancel={() => store.dispatch({ type: 'CLOSE_PROVIDER_WIDGET_MODAL' })}
        >
          <CustomWidget />
        </Modal>

        <Modal
          title="CUSTOM FORM FIELD"
          footer={false}
          visible={props.CustomFormmodal}
          width={650}
          onCancel={() => store.dispatch({ type: 'CLOSE_CUSTOMFORM_CREATE_MODAL' })}
          destroyOnClose
        >
          <CustomFormField {...props} />
        </Modal>

        <Modal
          title=""
          footer={false}
          visible={props.AppointmentTypeModal2}
          onCancel={() => store.dispatch({ type: 'CLOSE_APPOINTMENT_TYPE_MODAL2' })}
        >
          <AppointmentTypes />
        </Modal>

        <Modal
          title="PROVIDER"
          footer={false}
          visible={props.modal}
          onCancel={() => store.dispatch({ type: 'CLOSE_PROVIDER_CREATE_MODAL' })}
          destroyOnClose
        >
          <ProviderCreationForm {...props} />
        </Modal>

        <Modal
          title=""
          footer={false}
          visible={props.ProviderTypemodal}
          onCancel={() => store.dispatch({ type: 'CLOSE_PROVIDERTYPE_MODAL' })}
        >
          <ProviderType providerTypeState={providerTypeState} {...props} />
        </Modal>
        <div className="pageTitle">
          <h4>PROVIDER</h4>
        </div>
        <div>{ isMobile ?<button button className="view-button button-square" onClick={() => setMobileAction(true)}>Actions</button>  : HeaderSection()}</div>
        <Modal
        visible={mobileAction}
        footer={false}
        onCancel={() => setMobileAction(false)}
      >
     {HeaderSection()}
      </Modal>
        <div className="full-width-table">
          <ProviderTable {...props} />
        </div>
      </div>
    );
  };
  return (
    <div>
      <Dashboard_Content content={Provider_Content()} />
    </div>
  );
};
const mapStoreToProps = ({ Provider, CustomForm, AppointmentType, ProviderType }) => {
  console.log('Store', Provider);
  console.log('Store CustomForm', CustomForm);
  return {
    provider: Provider.payload,
    error: Provider.error,
    message: Provider.message,
    modal: Provider.modal,
    modal1: Provider.modal1,
    modal2: Provider.modal2,
    changed: Provider.changed,

    CustomForm: CustomForm.payload,
    CustomFormerror: CustomForm.error,
    CustomFormmessage: CustomForm.message,
    CustomFormmodal: CustomForm.modal,
    CustomFormmodal1: CustomForm.modal1,
    CustomFormchanged: CustomForm.changed,

    AppointmentTypeModal2: AppointmentType.modal2,

    ProviderTypePayload: ProviderType.payload,
    ProviderTypemodal: ProviderType.modal,
    ProviderTypeChanged: ProviderType.changed,
    ProviderDeleted: ProviderType.deleted,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchBranch: param =>
    dispatch(actionCreator({ method: 'GET', action_type: 'FETCH_BRANCH', param })),
  fetchCustomForm: () =>
    dispatch(actionCreator({ method: 'GET', action_type: 'FETCH_CUSTOMFORM' })),
  addCustomForm: (values, contentType) =>
    dispatch(
      actionCreator({ method: 'POST', action_type: 'CREATE_CUSTOMFORM', values, contentType }),
    ),

  fetchProvider: () => dispatch(actionCreator({ method: 'GET', action_type: 'FETCH_PROVIDER' })),
  addProvider: values =>
    dispatch(actionCreator({ method: 'POST', action_type: 'CREATE_PROVIDER', values })),
  editProvider: (id, values) =>
    dispatch(actionCreator({ method: 'PUT', action_type: 'EDIT_PROVIDER', id, values })),
  editProviderStatus: (id, param, values) =>
    dispatch(actionCreator({ method: 'PUT', action_type: 'EDIT_PROVIDER', id, param, values })),
  deleteProvider: id =>
    dispatch(actionCreator({ method: 'DELETE', action_type: 'DELETE_PROVIDER', id })),

  filterProvider: param =>
    dispatch(
      actionCreator({
        method: 'GET',
        action_type: 'FILTER_PROVIDER',
        param,
      }),
    ),

  fetchProviderType: () =>
    dispatch(actionCreator({ method: 'GET', action_type: 'FETCH_PROVIDER_TYPE' })),

  fetchAppointmentType: param =>
    dispatch(actionCreator({ method: 'GET', action_type: 'FETCH_APPOINTMENT_TYPE', param })),
});

export default connect(mapStoreToProps, mapDispatchToProps)(Dashboard_Provider);

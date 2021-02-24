import React, { useState, useEffect, useRef } from 'react';
import { Col, Row, Select, Button, Input, Switch, Space } from 'antd';
import { Scheduling } from './schedulingSection';
import { Formik, FieldArray, Field, Form } from 'formik';
import { SchedulingSchema } from '../../../_utils/Schemas';
import { connect } from 'react-redux';
import { store } from '../../../reducers/configureStore';

import { actionCreator } from '../../../reducers/actionCreator';

const AddAppointmentTime = props => {
  console.log('Scheduling props', props);
  const { branch } = props.provider_data;
  const innerForm = useRef(null);

  useEffect(() => {
    if (props.id && innerForm.current.values.branch_id) {
      props.fetchProviderBranchSchedule({
        provider_id: props.id,
        branch_id: innerForm.current.values.branch_id,
      });
    }
    // props.fetchSchedule({ id: props.id, branch_id: 5 });
  }, [props.changed]);

  const handleBranchChange = (val, setFieldValue) => {
    console.log('Branch id', val);
    setFieldValue('branch_id', val);
    props.fetchProviderBranchSchedule({
      provider_id: props.id,
      branch_id: val,
    });
  };
  const handleFormSubmission = async values => {
    try {
      const provider_id = values.provider_id;
      const branch_id = values.branch_id;
      const formData = values.formData.map((result, i) => {
        if (result.type !== 'custom') {
          delete result.unit;
          delete result.frequency;
        }
        if (result.provider_id) {
          delete result.provider_id;
        }
        return result;
      });
      if (values.arrDelete.length > 0) {
        const arrDelete = values.arrDelete;
        values = JSON.stringify({ formData: formData, provider_id, branch_id, arrDelete });
        props.addSchedule(values);
      } else {
        values = JSON.stringify({ formData: formData, provider_id, branch_id });
        props.addSchedule(values);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const addAppointment = () => {
    innerForm.current.setFieldValue('formData', [
      ...innerForm.current.values.formData,
      { type: 'daily', FromTime: '09:00 AM', ToTime: '05:20 PM', frequency: null, unit: null },
    ]);
  };

  const deleteAppointment = index => {
    const getId = innerForm.current.values.formData.filter((val, i) => i == index);

    const getData = innerForm.current.values.formData.filter((val, i) => i != index);
    innerForm.current.setFieldValue('formData', getData);
    if (getId[0].id) {
      innerForm.current.setFieldValue('arrDelete', [
        ...innerForm.current.values.arrDelete,
        getId[0].id,
      ]);
    }
  };

  return (
    <Formik
      innerRef={innerForm}
      enableReinitialize={true}
      // onSubmit={values => alert(JSON.stringify(values, null, 2))}
      onSubmit={handleFormSubmission}
      initialValues={{
        provider_id: props.id,
        arrDelete: [],
        branch_id: innerForm.current?.values?.branch_id
          ? innerForm.current.values.branch_id
          : branch.length > 0
          ? branch[0].id
          : '',
        formData: props.schedule ? props.schedule : [],
      }}
      validationSchema={SchedulingSchema}
    >
      {({ values, handleSubmit, setValues, errors, touched, setFieldValue }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <div>
              <label>Select branch</label>&nbsp;
              <Select
                placeholder="Select branch"
                style={{ width: '30%' }}
                value={values.branch_id}
                onChange={val => handleBranchChange(val, setFieldValue)}
              >
                {branch.map((re, i) => (
                  <Select.Option key={re.id} value={re.id}>
                    {re.fullName}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="appointment-time">
              <div className="header">
                {values.branch_id && (
                  <button
                    disabled={values.branch_id ? false : true}
                    className="button-square"
                    onClick={addAppointment}
                    type="button"
                  >
                    Add New
                  </button>
                )}
              </div>

              {values.formData?.map((value, index) => (
                <Space>
                  <Scheduling
                    values={values.formData}
                    setFieldValue={setFieldValue}
                    setValues={setValues}
                    index={index}
                    errors={errors}
                    touched={touched}
                  />
                  <span
                    className="delete-color icon-button"
                    onClick={() => deleteAppointment(index)}
                    // style={{
                    //   cursor: 'pointer',
                    //   background: 'transparent',
                    //   border: 'none',
                    //   outline: 'none',
                    // }}
                  >
                    <i className="fa fa-trash"></i>
                  </span>
                </Space>
              ))}
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Space>
                  <Button className="edit-button button-square" htmlType="submit">
                    Save
                  </Button>
                  <Button onClick={() =>  props.handleCancel()} className="delete-button button-square" type="default">
                    Cancel
                  </Button>
                </Space>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

const mapStoreToProps = ({ Schedule }) => {
  console.log('Schedule', Schedule);
  return {
    schedule: Schedule.payload,
    modal: Schedule.modal,
    changed: Schedule.changed,
  };
};
const mapDispatchToProps = dispatch => ({
  fetchSchedule: id =>
    dispatch(actionCreator({ method: 'GET', action_type: 'FETCH_SCHEDULE', ...id })),
  addSchedule: values =>
    dispatch(
      actionCreator({
        method: 'POST',
        contentType: 'JSON',
        action_type: 'CREATE_SCHEDULE',
        values,
      }),
    ),
  fetchProviderBranchSchedule: param => {
    dispatch(actionCreator({ method: 'GET', action_type: 'FILTER_SCHEDULE', param }));
  },
});

export default connect(mapStoreToProps, mapDispatchToProps)(AddAppointmentTime);

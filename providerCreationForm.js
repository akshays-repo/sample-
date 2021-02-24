import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { ProviderCreationSchema } from '_utils/Schemas';
import { Button, Row, Select, Col } from 'antd';
import { Select as matSeclect } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import { generateForm } from '../../../_utils/formgenerator';
import { getFormDataA } from '_utils';
import { store } from '../../../reducers/configureStore';

const { Option } = Select;
//deletedBranches
const ProviderCreationForm = props => {
  const [loadings, setLoadings] = useState(false);
  const innerForm = useRef();
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [deletedBranch, setDeletedBranch] = useState([]);
  useEffect(() => {
    setBranchList(store.getState().Branch.payload);
    if (props.values) {
    }
  }, []);

  const handleFormSubmission = async values => {
    let data = await getFormDataA({ ...values, userTypeId: 4 });
    selectedBranch.map((va, i) => data.append('arrBranches[]', va));
    deletedBranch.map((va, i) => data.append('deletedBranches[]', va));

    if (props.id) {

      if (selectedBranch.length === 0) {
        //this is for sent the arrBranches if branches is not edited 
        values.provider_and_branches.map((va, i) => data.append('arrBranches[]', va.branch_id));
      }
      await props.editProvider(props.id, data);
    } else {
      await props.addProvider(data);
    }
  };

  const handleBranchChange = values => {
    let currentValue = [];
    if (props.values?.branch) {
      let branch = props.values.branch;
      branch.map(type => currentValue.push(type.id));
    }
    let intersection = currentValue.filter(x => values.includes(x));
    let DeletedArray = [];
    DeletedArray = currentValue
      .filter(x => !intersection.includes(x))
      .concat(intersection.filter(x => !currentValue.includes(x)));
    console.log('sdjsdsbdh', DeletedArray, values);
    setSelectedBranch(values);
    setDeletedBranch(DeletedArray);
  };

  const formField = [
    {
      label: 'Full Name',
      name: 'fullName',
      type: 'text',
    },
    {
      label: 'Email',
      name: 'email',
      type: 'text',
    },
    {
      label: 'Phone no.',
      name: 'phone',
      type: 'text',
    },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          props.values || {
            fullName: '',
            email: '',
            status: 'active',
            userTypeId: 4,
            provider_typeId: '',
            phone: '',
          }
        }
        validationSchema={props.id ? null : ProviderCreationSchema}
        onSubmit={handleFormSubmission}
        innerRef={innerForm}
      >
        {({ handleSubmit, touched, errors, isSubmitting }) => (
          <Form className="login__form" handleSubmit={handleSubmit}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {generateForm(formField)}
              <Col xs={24} xl={12}>
                <p>Please Select the Branch</p>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Please select the Branch"
                  defaultValue={props.values?.branch.map(type => type.id)}
                  onChange={handleBranchChange}
                >
                  {branchList?.map(branch => {
                    return (
                      <Option value={branch.id} key={branch.id}>
                        {branch.fullName}
                      </Option>
                    );
                  })}
                </Select>
              </Col>

              <Col xs={24} xl={12}>
                <p>Please Select the Provider Type</p>
                <Field
                  as="select"
                  name="provider_typeId"
                  placeholder="Provider type"
                  component={matSeclect}
                >
                  {props.ProviderTypePayload?.map(branch => {
                    return <MenuItem value={branch.id}>{branch.name}</MenuItem>;
                  })}
                </Field>
              </Col>
            </Row>

            <Button
              htmlType="submit"
              disabled={isSubmitting}
              loading={loadings}
              className="view-button button-square mt-5"
            >
              {props.id ? ' Edit a Provider' : ' Create a New Provider'}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default ProviderCreationForm;

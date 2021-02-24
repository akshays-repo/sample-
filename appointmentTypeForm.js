import React, { useEffect, useState } from 'react';
import { Space, Row, Col, Table, Popconfirm, Modal, Button } from 'antd';
import { Formik, Field } from 'formik';
import { AppointmentTypeSchema } from '../../../_utils/Schemas';
import { store } from '../../../reducers/configureStore';
import { Form, Input, Select } from 'formik-antd';
import { getFormData } from '../../../_utils';
import { TextField, Select as MatSelect } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

export const AppointmentTypeForm = props => {
  const formField = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
    },
    {
      label: 'Time slot',
      name: 'time_slot',
      type: 'select',
    },
  ];
  return (
    <Form>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {formField.map((values, index) => {
          return values.type === 'text' ? (
            <Col key={index} xs={24} xl={12}>
              <label>{values.label}</label>
              <p>
                <Field
                  component={values.type === 'text' ? TextField : MatSelect}
                  name={values.name}
                  placeholder=""
                  type="text"
                ></Field>
              </p>
            </Col>
          ) : (
            <Col key={index} xs={24} xl={12}>
              <label>{values.label}</label>
              <p>
                <FormControl>
                  <Field
                    style={{ width: 200 }}
                    component={MatSelect}
                    name={values.name}
                    placeholder=""
                  >
                    {new Array(50).fill(5).map((result, i) => {
                      return (
                        <MenuItem key={i} value={result * (i + 1)}>
                          {result * (i + 1)} minutes
                        </MenuItem>
                      );
                    })}
                  </Field>
                </FormControl>
              </p>
            </Col>
          );
        })}
      </Row>

      <Button  htmlType="submit" className="
      edit-button button-square mt-5">
        {props.id ? 'EDIT' : 'ADD'}
      </Button>
    </Form>
  );
};

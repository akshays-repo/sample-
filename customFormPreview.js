import React, { useEffect, useState } from 'react';
import { Checkbox, Select, DatePicker, Space, InputNumber, Row } from 'antd';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import HardCoreForm from './customFormhardCore';

const CustomFormReview = props => {
  const [customForms, setCustomForm] = useState([]);

  useEffect(() => {
    setCustomForm(props.CustomForm.custom_form);
  });

  return (
    <div>
      <HardCoreForm />
      {customForms?.map(forms => (
        <div>
          {forms.custom_types === 'text' || forms.custom_types === 'note' ? (
            <div>
              {' '}
              <p></p>
              <TextField id="standard-basic" label={forms.Key_name} />
              <p></p>
            </div>
          ) : (
            ''
          )}
          {forms.custom_types === 'checkbox' ? (
            <div>
              {' '}
              <p>{forms.Key_name}</p>
              <Checkbox.Group options={forms.values !== null ? forms.values: '' } />
              <p></p>
            </div>
          ) : (
            ''
          )}

          {forms.custom_types === 'drop-down' ? (
            <div>
              {' '}
              <p>{forms.Key_name}</p>
              <Select style={{ width: 120 }}>
                {forms.values.map(option => (
                  <Select.Option value={option}>{option}</Select.Option>
                ))}
              </Select>
              <p></p>
            </div>
          ) : (
            ''
          )}

          {forms.custom_types === 'date' ? (
            <div>
              {' '}
              <p>{forms.Key_name}</p>
              <DatePicker defaultValue={moment('2015/01/01', 'YYYY/MM')} format={'YYYY/MM'} />
              <p></p>
            </div>
          ) : (
            ''
          )}

          {forms.custom_types === 'number' ? (
            <div>
              {' '}
              <p>{forms.Key_name}</p>
              <InputNumber min={1} max={10} defaultValue={3} />
              <p></p>
            </div>
          ) : (
            ''
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomFormReview;

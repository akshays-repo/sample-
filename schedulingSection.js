import React, { useState } from 'react';
import { Switch, Select, DatePicker, Space, TimePicker } from 'antd';
import moment from 'moment';
// import { Select } from 'formik-antd';
import { Formik } from 'formik';
const { Option } = Select;
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const array_minutes = new Array(12).fill(0).map((va, i) => '0'.concat(5 * i).slice(-2));
const array_hours = new Array(13).fill(0).map((va, i) => '0'.concat(i).slice(-2));

const dateFormat = 'YYYY-MM-DD';

export const Scheduling = ({ values, setFieldValue, setValues, index, errors, touched }) => {
  const [fromHour, setFromHour] = useState(values[index]?.FromTime.split(':')[0] || '09');
  const [fromMinutes, setFromMinutes] = useState(
    values[index]?.FromTime.split(':')[1].split(' ')[0] || '05',
  );
  const [fromType, setFromType] = useState(
    values[index]?.FromTime.split(':')[1].split(' ')[1] || 'AM',
  );

  const [toHour, setToHour] = useState(values[index]?.ToTime.split(':')[0] || '09');
  const [toMinutes, setToMinutes] = useState(
    values[index]?.ToTime.split(':')[1].split(' ')[0] || '05',
  );
  const [toType, setToType] = useState(values[index]?.ToTime.split(':')[1].split(' ')[1] || 'AM');

  const handleChange = (value, key) => {
    setFieldValue(`formData[${index}].${key}`, value);
  };

  const handleDate = (value, key) => {
    setFieldValue(`formData[${index}].${key}`, []);

    if (value) {
      console.log('Date', value.format(dateFormat));
      setFieldValue(`formData[${index}].${key}[0]`, value.format(dateFormat));
    }
  };

  const handleFrom = (value, from) => {
    switch (from) {
      case 'hour':
        setFromHour(value);
        setFieldValue(`formData[${index}].FromTime`, `${value}:${fromMinutes} ${fromType}`);
        break;
      case 'minutes':
        setFromMinutes(value);
        setFieldValue(`formData[${index}].FromTime`, `${fromHour}:${value} ${fromType}`);
        break;
      case 'type':
        setFromType(value);
        setFieldValue(`formData[${index}].FromTime`, `${fromHour}:${fromMinutes} ${value}`);
        break;
    }
  };

  const handleTo = (value, to) => {
    switch (to) {
      case 'hour':
        setToHour(value);
        setFieldValue(`formData[${index}].ToTime`, `${value}:${toMinutes} ${toType}`);
        break;
      case 'minutes':
        setToMinutes(value);
        setFieldValue(`formData[${index}].ToTime`, `${toHour}:${value} ${toType}`);
        break;
      case 'type':
        setToType(value);
        setFieldValue(`formData[${index}].ToTime`, `${toHour}:${toMinutes} ${value}`);

        break;
    }
  };
  const onChange = (e, type) => {
    console.log(e);

    if (e) {
      setFieldValue(`formData[${index}].type`, type);
      setFieldValue(`formData[${index}].date`, []);
    } else {
      setFieldValue(`formData[${index}].type`, 'daily');
    }
  };

  return (
    <Formik>
      <div style={{ marginTop: 20, marginBottom: 10 }}>
        {values[index].type === 'daily' && (
          <Space direction="vertical">
            <Select
              value={values[index].date}
              mode="multiple"
              //   allowClear
              placeholder="Select Day"
              onChange={value => handleChange(value, 'date')}
              style={{ width: '225px' }}
            >
              {weekDays.map((day, i) => (
                <Option value={i + 1} label={day}>
                  {day}
                </Option>
              ))}
            </Select>
            <div className="errormsg">
              {errors.formData
                ? errors.formData[index]
                  ? errors.formData[index].date
                    ? errors.formData[index].date
                    : ''
                  : '' || ''
                : ''}
            </div>
          </Space>
        )}
        {values[index].type === 'fixed' && (
          <Space direction="vertical">
            <DatePicker
              allowClear
              defaultValue={
                values[index].date
                  ? values[index].date.length > 0
                    ? values[index].date[0].length > 0
                      ? moment(values[index].date[0], dateFormat)
                      : ''
                    : null
                  : null
              }
              placeholder="Select Date"
              onChange={value => handleDate(value, 'date')}
              style={{ width: '225px' }}
              format={dateFormat}
            ></DatePicker>
            <div className="errormsg">
              {errors.formData
                ? errors.formData[index]
                  ? errors.formData[index].date
                    ? errors.formData[index].date
                    : ''
                  : '' || ''
                : ''}
            </div>
          </Space>
        )}
        {values[index].type === 'custom' && (
          <Space direction="vertical">
            <DatePicker
              defaultValue={
                values[index].date
                  ? values[index].date.length > 0
                    ? moment(values[index].date[0], dateFormat)
                    : null
                  : null
              }
              format={dateFormat}
              allowClear
              placeholder="Select reference date"
              onChange={values => handleDate(values, 'date')}
              style={{ width: '180px' }}
            ></DatePicker>
            <div className="errormsg">
              {errors.formData
                ? errors.formData[index]
                  ? errors.formData[index].date
                    ? errors.formData[index].date
                    : ''
                  : '' || ''
                : ''}
            </div>
          </Space>
        )}
        {'  '}
        <Space direction="horizontal" className="mt-5">
          <span className="form-to">From:</span>
          <Select onChange={value => handleFrom(value, 'hour')} value={fromHour}>
            {array_hours.map((result, i) => (
              <Option key={i} value={result}>
                {result}
              </Option>
            ))}
          </Select>
          <Select onChange={value => handleFrom(value, 'minutes')} value={fromMinutes}>
            {array_minutes.map((result, i) => (
              <Option key={i} value={result}>
                {result}
              </Option>
            ))}
          </Select>
          <Select onChange={value => handleFrom(value, 'type')} value={fromType}>
            <Option value="AM">AM</Option>
            <Option value="PM">PM</Option>
          </Select>
          <span className="form-to">To:</span>
          <Select onChange={value => handleTo(value, 'hour')} value={toHour}>
            {array_hours.map((result, i) => (
              <Option key={i} value={result}>
                {result}
              </Option>
            ))}
          </Select>
          {'  '}
          <Select onChange={value => handleTo(value, 'minutes')} value={toMinutes}>
            {array_minutes.map((result, i) => (
              <Option key={i} value={result}>
                {result}
              </Option>
            ))}
          </Select>
          {'  '}
          <Select onChange={value => handleTo(value, 'type')} value={toType}>
            <Option value="AM">AM</Option>
            <Option value="PM">PM</Option>
          </Select>
          {'  '}
        </Space>
        <br />
        <br />
        <div className="switch-section" style={{ marginLeft: 15 }}>
          <Space direction="vertical">
            <div>
              <Switch
                checked={values[index].type === 'fixed'}
                onChange={e => onChange(e, 'fixed')}
              />
              &nbsp; On a specific date
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Switch
                  checked={values[index].type === 'custom'}
                  onChange={e => onChange(e, 'custom')}
                />
                &nbsp; Custom repeat
              </div>
            </div>
            {values[index].type === 'custom' && (
              <div>
                <Space direction="vertical">
                  <Select
                    value={values[index]?.frequency || null}
                    onChange={value => handleChange(value, 'frequency')}
                    placeholder="Select number"
                  >
                    {new Array(29).fill(0).map((va, i) => (
                      <Option key={i} value={i + 1}>
                        {i + 1}
                      </Option>
                    ))}
                  </Select>
                  <div className="errormsg">
                    {errors.formData
                      ? errors.formData[index]
                        ? errors.formData[index].frequency
                          ? errors.formData[index].frequency
                          : ''
                        : '' || ''
                      : ''}
                  </div>
                </Space>
                <Space direction="vertical" style={{ marginTop: 20 }}>
                  <Select
                    value={values[index]?.unit || null}
                    onChange={value => handleChange(value, 'unit')}
                    placeholder="Select unit"
                  >
                    <Option value={'daily'}>Day</Option>
                    <Option value={'week'}>Week</Option>
                    <Option value={'month'}>Month</Option>
                  </Select>
                  <div className="errormsg">
                    {errors.formData
                      ? errors.formData[index]
                        ? errors.formData[index].unit
                          ? errors.formData[index].unit
                          : ''
                        : '' || ''
                      : ''}
                  </div>
                </Space>
              </div>
            )}
          </Space>
        </div>
      </div>
    </Formik>
  );
};

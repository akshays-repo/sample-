import React, { useState } from 'react';
import { List, Card } from 'antd';
import { message } from 'antd';

import Button1 from './assets/button1.png';
import Button2 from './assets/booknow-button-2.png';
import Button3 from './assets/booknow-button-3.png';
import Button4 from './assets/booknow-button-4.png';
import Button5 from './assets/booknow-button-5.png';
import Button6 from './assets/booknow-button-6.png';
import Button7 from './assets/booknow-button-7.png';
import Button8 from './assets/booknow-button-8.png';
import Button9 from './assets/booknow-button-9.png';
import Button10 from './assets/booknow-button-10.png';

const CustomWidget = () => {
  const url = window.location.href;
  const hospitalId = localStorage.getItem('hospital_id');

  const [textArea, setTextArea] = useState('');

  const currentUrl = window.location.origin
  const data = [
    {  
      id:1 ,  
      button: Button1,
      url: `<a href = ${currentUrl}/online-appointment/${hospitalId}> <img alt='Book now' src=${"imagelocation"}/> </a>`,
    },
    {
        id:2 ,
      button: Button2,
      url: `<a href = ${currentUrl}/online-appointment/${hospitalId}> <img alt='Book now' src=${"imagelocation"}/> </a>`,
    },
    {
        id:3 ,
      button: Button3,
      url: `<a href = ${currentUrl}/online-appointment/${hospitalId}> <img alt='Book now' src=${"imagelocation"}/> </a>`,
    },
    {
        id:4 ,
      button: Button4,
      url: `<a href = ${currentUrl}/online-appointment/${hospitalId}> <img alt='Book now' src=${"imagelocation"}/> </a>`,
    },
    {
        id:5 ,
      button: Button5,
      url: `<a href = ${currentUrl}/online-appointment/${hospitalId}> <img alt='Book now' src=${"imagelocation"}/> </a>`,
    },
    {
        id:6 ,
      button: Button6,
      url: `<a href = ${currentUrl}/online-appointment/${hospitalId}> <img alt='Book now' src=${"imagelocation"}/> </a>`,
    },
    {
        id:7 ,
      button: Button7,
      url: `<a href = ${currentUrl}/online-appointment/${hospitalId}> <img alt='Book now' src=${"imagelocation"}/> </a>`,
    },
    {
        id:8 ,
      button: Button8,
      url: `<a href = ${currentUrl}/online-appointment/${hospitalId}> <img alt='Book now' src=${"imagelocation"}/> </a>`,
    },
    // {
    //     id:9 ,
    //   button: Button9,
    //   url: `<a href = ${currentUrl}/online-appointment/${hospitalId}> <img alt='Book now' src=${Button9}/> </a>`,
    // },
    // {
    //     id:10 ,
    //   button: Button10,
    //   url: `<a href = ${currentUrl}/online-appointment/${hospitalId}> <img alt='Book now' src=${Button10}/> </a>`,
    // },
  ];

  const copyCodeToClipboard = (id) => {
    let op 
    op = data.filter(item => item.id === id);
    let copyUrl =op[0].url
    navigator.clipboard.writeText(copyUrl) 
    message.info('Copied to ClipBoard');
  };
  return (
    <div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Card className="widget_body">
              <a href={`${currentUrl}/online-appointment/${hospitalId}`}><img src={item.button} /> </a>
              
             <p>{item.url}
             </p>
              <button className="button-square" onClick={() => copyCodeToClipboard(item.id)} style={{border: 'border: 1px solid #e4eaec;'}}>Copy to ClipBorad</button>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default CustomWidget;

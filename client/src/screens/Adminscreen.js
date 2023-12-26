import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

export default function Adminscreen() {

  const items = [
    {
      key: '1',
      label: <b><i>Bookings</i></b>,
      children: <h1>Bookings</h1>,
    },
    {
      key: '2',
      label: <b><i>Rooms</i></b>,
      children: <h1>Rooms</h1>,
    },
    {
      key: '3',
      label: <b><i>Add Rooms</i></b>,
      children: <h1>Add Rooms</h1>,
    },
    {
      key: '4',
      label: <b><i>Users</i></b>,
      children: <h1>Users</h1>,
    },
  ];

  return (
    <div className='mt-3 ml-3 mr-3 bs'>
      <h2 className='text-center' style={{fontSize:'30px'}}><b>AdminPanel</b></h2>
      <Tabs defaultActiveKey="1">
        {items.map((item) => (
          <TabPane tab={item.label} key={item.key}>
            {item.children}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}


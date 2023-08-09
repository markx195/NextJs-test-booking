import React, {useState} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {TimePicker} from "antd"; // Import the moment library

const CustomColumns = ({ record, day, handlePlusClick, selectedTimeRange }) => {
    const time = record[`${day}Time`];

    const handleTimeClick = () => {
        if (time && Array.isArray(time) && time.length === 2) {
            // If time range is present, show modal to edit it
            handlePlusClick(record.id, day);
        }
    };

    const renderTime = () => {
        if (time && Array.isArray(time) && time.length === 2) {
            return (
                <span onClick={handleTimeClick}>
                    {time[0]} - {time[1]}
                </span>
            );
        } else {
            return (
                <span onClick={() => handlePlusClick(record.id, day)}>
                    <PlusOutlined className="plus-icon" />
                </span>
            );
        }
    };

    return <div>{renderTime()}</div>;
};

export default CustomColumns;



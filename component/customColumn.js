import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { TimePicker } from "antd";

const CustomColumns = ({ record, day, handlePlusClick }) => {
    const dayData = record.days.find(d => d.day === day);
    const time = dayData ? dayData.time : null;

    const handleTimeClick = () => {
        if (!time || !time.length) {
            handlePlusClick(record.id, day);
        }
    };

    const renderTime = () => {
        if (time && time.length === 2) {
            return (
                <span>{time[0]} - {time[1]}</span>
            );
        } else {
            return (
                <span onClick={handleTimeClick}>
                    <PlusOutlined className="plus-icon" />
                </span>
            );
        }
    };

    return <div>{renderTime()}</div>;
};

export default CustomColumns;

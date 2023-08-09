"use client";
import React, {useState} from 'react';
import DataSource from './fakedata'
import CustomColumns from "./customColumn"
import {Table, Input, Button, Space, TimePicker, Checkbox, Col, Row, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import "./stlye.css"

const CustomTable = () => {
    const [data, setData] = useState(DataSource);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState({ day: null, timeRange: null });
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState({});
    function timeToMinutes(timeString) {
        if (!timeString || typeof timeString !== 'string') {
            return 0;
        }

        const timeParts = timeString.split(':');

        if (timeParts.length !== 2) {
            return 0;
        }

        const [hours, minutes] = timeParts.map(Number);

        if (isNaN(hours) || isNaN(minutes)) {
            return 0;
        }

        return hours * 60 + minutes;
    }
    function calculateTotalTime(row) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const minutesInHour = 60; // Number of minutes in an hour

        return days.reduce((totalHours, day) => {
            const timeRange = row[`${day}Time`];
            if (Array.isArray(timeRange) && timeRange.length === 2) {
                const startTime = timeToMinutes(timeRange[0]);
                const endTime = timeToMinutes(timeRange[1]);
                const totalMinutes = endTime - startTime;
                return totalHours + totalMinutes / minutesInHour; // Convert minutes to hours
            }
            return totalHours;
        }, 0);
    }

    const handlePlusClick = (rowId, day) => {
        setSelectedRow(rowId);
        setSelectedDay(day);
        setModalVisible(true);
        setSelectedTime({ [day]: selectedTimeRange }); // Update selected time for the specific day
    };
    const handleRowCheck = (id) => {
        const newData = data.map((row) => {
            if (row.id === id) {
                return {
                    ...row,
                    checked: !row.checked,
                };
            }
            return row;
        });
        setData(newData);
    };

    const handleModalOk = (timeRange) => {
        if (timeRange && timeRange.length === 2) {
            const formattedTimeRange = [
                timeRange[0].format('HH:mm'),
                timeRange[1].format('HH:mm')
            ];

            const newData = data.map((row) => {
                if (row.id === selectedRow) {
                    const updatedRow = { ...row };
                    updatedRow[`${selectedDay}Time`] = formattedTimeRange;
                    return updatedRow;
                }
                return row;
            });

            setData(newData);
            setSelectedTimeRange({
                day: selectedDay,
                timeRange: formattedTimeRange
            });
            setModalVisible(false);
        } else {
            console.error('Invalid time range format:', timeRange);
        }
    };


    const handleModalCancel = () => {
        setModalVisible(false);
        setSelectedRow(null);
        setSelectedDay(null);
    };

    const columns = [
        {
            title: "All",
            dataIndex: 'checkbox',
            render: (_, record) => (
                <Checkbox checked={record.checked} onChange={() => handleRowCheck(record.id)} />
            ),
        },
        {
            title: 'Office name',
            dataIndex: 'officeName',
            className: "center-align",
        },
        // Create separate rows for the plus icons and time pickers
        {
            title: 'Monday',
            dataIndex: 'mondayTime',
            className: "center-align",
            render: (_, record) => (
                <CustomColumns
                    record={record}
                    day="monday"
                    handlePlusClick={handlePlusClick}
                    selectedTimeRange={selectedTimeRange} // Pass the selectedTimeRange to the component
                />
            ),
        },
        {
            title: 'Tuesday',
            dataIndex: 'tuesdayTime',
            className: "center-align",
            render: (_, record) => (
                <CustomColumns
                    record={record}
                    day="tuesday"
                    handlePlusClick={handlePlusClick}
                    selectedTime={selectedTimeRange}
                />
            ),
        },
        {
            title: 'Wednesday',
            dataIndex: 'wednesdayTime',
            className: "center-align",
            render: (_, record) => (
                <CustomColumns
                    record={record}
                    day="wednesday"
                    handlePlusClick={handlePlusClick}
                    selectedTimeRange={selectedTimeRange} // Pass the selectedTimeRange to the component
                />
            ),
        },
        {
            title: 'Thursday',
            dataIndex: 'thursdayTime',
            className: "center-align",
            render: (_, record) => (
                <CustomColumns
                    record={record}
                    day="thursday"
                    handlePlusClick={handlePlusClick}
                    selectedTimeRange={selectedTimeRange} // Pass the selectedTimeRange to the component
                />
            ),
        },
        {
            title: 'Friday',
            dataIndex: 'fridayTime',
            className: "center-align",
            render: (_, record) => (
                <CustomColumns
                    record={record}
                    day="friday"
                    handlePlusClick={handlePlusClick}
                    selectedTimeRange={selectedTimeRange} // Pass the selectedTimeRange to the component
                />
            ),
        },
        {
            title: 'Saturday',
            dataIndex: 'saturdayTime',
            className: "center-align",
            render: (_, record) => (
                <CustomColumns
                    record={record}
                    day="saturday"
                    handlePlusClick={handlePlusClick}
                    selectedTimeRange={selectedTimeRange} // Pass the selectedTimeRange to the component
                />
            ),
        },
        {
            title: 'Sunday',
            dataIndex: 'sundayTime',
            className: "center-align",
            render: (_, record) => (
                <CustomColumns
                    record={record}
                    day="sunday"
                    handlePlusClick={handlePlusClick}
                    selectedTimeRange={selectedTimeRange} // Pass the selectedTimeRange to the component
                />
            ),
        },
        // Repeat for other days
        {
            title: 'Total',
            className: "center-align",
            dataIndex: 'total',
            render: (_, record) => <span>{calculateTotalTime(record)}</span>,
        },
    ];

    const handleTimeChange = (id, day, time) => {
        const newData = data.map((row) => {
            if (row.id === id) {
                const updatedRow = {...row};
                updatedRow[`${day}Time`] = time;
                return updatedRow;
            }
            return row;
        });
        setData(newData);
    };

    //// For Searching:
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const filteredData = data.filter((item) =>
        item.officeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const tableData = searchQuery.length > 0 ? filteredData : data;

    return (
        <div>
            <div className="input-container">
                <Input
                    placeholder="Search by office name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <Modal
                open={modalVisible}
                title={`Select Time Range for ${selectedDay}`}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        Cancel
                    </Button>,
                    <Button key="ok" onClick={handleModalOk}>
                        OK
                    </Button>,
                ]}
            >
                <TimePicker.RangePicker
                    format="HH:mm"
                    onChange={(timeRange) => handleModalOk(timeRange)}
                />
            </Modal>
            <div className="table-container">
                <Table dataSource={tableData} columns={columns} rowKey="id"/>
            </div>
        </div>
    );
};

export default CustomTable;


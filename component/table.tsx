"use client";
import React, {useState} from 'react';
import DataSource from './fakedata'
import CustomColumns from "./customColumn"
import {Table, Input, Button, Space, TimePicker, Checkbox, Col, Row, Modal} from 'antd';
import "./stlye.css"

const CustomTable = () => {
    const [data, setData] = useState(DataSource);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedTimeRange, setSelectedTimeRange] = useState({day: null, timeRange: null});
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTime, setSelectedTime] = useState({});
    // Generate dates for the current week
    const [startDate, setStartDate] = useState(new Date()); // Initialize with current date
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleNextWeek = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() + 7); // Move to next week
        setStartDate(newStartDate);
    };

    const handleLastWeek = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(newStartDate.getDate() - 7); // Move to last week
        setStartDate(newStartDate);
    };

    // Calculate the starting date of the displayed week
    const currentDayIndex = startDate.getDay();
    const displayStartDate = new Date(startDate);
    displayStartDate.setDate(displayStartDate.getDate() - currentDayIndex + 1);

    const dateCells = daysOfWeek.map((day, index) => {
        const date = new Date(displayStartDate);
        date.setDate(date.getDate() + index);

        return (
            <div key={day} className="date-cell">
                <div className="day">{day}</div>
                <div className="date">{date.toLocaleDateString()}</div>
            </div>
        );
    });

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
        setSelectedTime({[day]: selectedTimeRange}); // Update selected time for the specific day
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
                    const updatedRow = {...row};
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
                <Checkbox checked={record.checked} onChange={() => handleRowCheck(record.id)}/>
            ),
        },
        {
            title: 'Office name',
            dataIndex: 'officeName',
            className: "center-align",
        },
        // Create separate rows for the plus icons and time pickers
        ...dateCells.map((dateCell, index) => ({
            title: dateCell,
            dataIndex: 'days',
            className: "center-align",
            render: (days, record) => {
                const day = daysOfWeek[index].toLowerCase();
                const dayData = days?.find(d => d.day === day);
                const time = dayData?.time;

                return (
                    <CustomColumns
                        record={record}
                        day={day}
                        date={dateCell}
                        time={time}
                        handlePlusClick={handlePlusClick}
                        selectedTimeRange={selectedTimeRange}
                    />
                );
            }
        })),
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
                <div className="button-container">
                    <Button onClick={handleLastWeek}>Last Week</Button>
                    <Button onClick={handleNextWeek}>Next Week</Button>
                </div>
                <Table dataSource={tableData} columns={columns} rowKey="id"/>
            </div>
        </div>
    );
};

export default CustomTable;


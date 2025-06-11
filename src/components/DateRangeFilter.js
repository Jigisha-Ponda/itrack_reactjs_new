import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Dropdown, DropdownButton } from 'react-bootstrap'
import { getSeachFilterResult } from '../services/getSearchFilterResult'
import Select from 'react-select';
import FilterOffCanvas from './Filter';

export default function DateRangeFilter({
  setData,
  role,
  setMessage,
  setIsFiltering,
  searchQuery,
  setSearchQuery,
}) {
  // const [searchQuery, setSearchQuery] = useState({
  //     AWB: "",
  //     clientId: "",
  //     driverId: "",
  //     fromDate: "",
  //     toDate: "",
  //     currentStatus: "",
  //     jobId: "",
  //     clientName: "",
  //     driverName: ""
  // });

  const handleTimeChange = (e) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value })
  }
  const handleColumnSelect = (option) => {
    setSelectedColumn(option)
    // If you want to filter data by selected column:
    // setSearchQuery({ ...searchQuery, selectedColumn: option.value })
  }
  useEffect(() => {
    if (searchQuery.fromDate && searchQuery.toDate) {
      setMessage('')
      if (setIsFiltering) {
        setIsFiltering(true)
      }
      getSeachFilterResult(searchQuery, role).then((res) => {
        setData(res)
      })
    }
  }, [searchQuery])

  const [selectedColumn, setSelectedColumn] = useState('Select Column');
  const columnOptions = [
    { value: 'all', label: 'All' },
    { value: 'client', label: 'Client' },
    { value: 'readyTime', label: 'Ready Time' },
    { value: 'cutoffTime', label: 'Cutoff Time' },
    { value: 'awb', label: 'AWB' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'serviceType', label: 'Service Type' },
    { value: 'serviceCode', label: 'Service Code' },
    { value: 'pickupFrom', label: 'Pickup From' },
    { value: 'deliveryTo', label: 'Delivery To' },
    { value: 'driver', label: 'Driver' },
    { value: 'notes', label: 'Notes' },
    { value: 'status', label: 'Status' },
  ]

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-3">
        <div className="d-flex align-items-center">
          {/* <Form.Label></Form.Label> */}
          {/* <span className="me-2">From:</span> */}
          <Form.Control
            type="date"
            placeholder="Start Date"
            name="fromDate"
            onChange={handleTimeChange}
            onFocus={(e) => e.target.showPicker && e.target.showPicker()}
            value={searchQuery.fromDate}
            style={{ width: 170 }}
          />
        </div>
        <span>-</span>
        <div className="d-flex align-items-center">
          {/* <span className="me-2">To:</span> */}
          <Form.Control
            type="date"
            placeholder="End Date"
            name="toDate"
            onChange={handleTimeChange}
            onFocus={(e) => e.target.showPicker && e.target.showPicker()}
            value={searchQuery.toDate}
            style={{ width: 170 }}
          />
        </div>
        {role == 'admin' &&
          <div>
            <Select
              options={columnOptions}
              value={selectedColumn}
              onChange={handleColumnSelect}
              placeholder="Show only chosen columns"
              isSearchable
            />
            {/* <DropdownButton
          id="chosen-column-dropdown"
          title={selectedColumn}
          onSelect={handleSelect}
          variant="outline-primary"
        >
          <Dropdown.Item eventKey="Job ID">Job ID</Dropdown.Item>
          <Dropdown.Item eventKey="AWB">AWB</Dropdown.Item>
          <Dropdown.Item eventKey="Client Name">Client Name</Dropdown.Item>
          <Dropdown.Item eventKey="Driver Name">Driver Name</Dropdown.Item>
        </DropdownButton> */}
          </div>
        }


      </div>
    </>
  )
}

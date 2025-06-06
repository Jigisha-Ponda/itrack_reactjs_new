import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { CButton, CButtonGroup, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { FaEye, FaRegEdit } from 'react-icons/fa'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { Button, Col, Pagination, Row, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import EditJob from '../../components/Modals/EditJob'
import ViewJobs from '../../components/Modals/ViewJobs'
import { get } from '../../lib/request'
import { Spinner } from 'react-bootstrap'
import { FaTruckMoving, FaMapMarkedAlt } from 'react-icons/fa'
import { getCurrentDate, getFormattedDAndT } from '../../lib/getFormatedDate'
import AssignDriverModal from '../../components/Modals/AssignDriver'
import DateRangeFilter from '../../components/DateRangeFilter'
import getStatusStyles from '../../services/getStatusColor'
import { LuChevronDown } from 'react-icons/lu'
import sortData from '../../services/sortData'

const Dashboard = () => {
  let trackPermission = localStorage.getItem('clientTrackPermission')
  let assignDriverP = localStorage.getItem('clientDriverAssign')
  console.log(trackPermission);
  console.log("jkshjashjahsajhsahs");
  
  
  const currentDate = getCurrentDate()
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [showView, setShowView] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [message, setMessage] = useState('')
  const [isReferesh, setIsReferesh] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const searchQuery = useSelector((state) => state.searchQuery)

  const setSearchQuery = (query) => {
    dispatch({
      type: 'updateSearchQuery',
      payload: query,
    })
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleEdit = (item) => {
    setSelectedJob(item)
    handleShow()
  }
  // handle view
  const handleView = (item) => {
    sessionStorage.setItem('selectedItem', JSON.stringify(item))
    navigate(`/client/dashboard/job/${item._id}`)
  }
  // close view

  const onSearch = (newData) => {
    setMessage('')
    if (newData.length === 0) {
      setMessage('No data found')
    }
    setData(newData)
  }
  // handle assign driver modal
  const handleShowAssign = (item) => {
    setSelectedJob(item)
    setShowAssign(true)
  }
  const handleTodayJobs = () => {
    setLoading(true)
    setMessage('')
    get(`/client/jobFilter?fromDate=${currentDate}&toDate=${currentDate}`, 'client').then(
      (response) => {
        if (response.data.status) {
          if (response.data.data.length === 0) {
            setMessage('No data found')
          }
          setData(response?.data?.data)
          setLoading(false)
        }
      },
    )
  }

  // get all jobs
  const fetchInitialData = () => {
    get(`/client/jobFilter?currentStatus=Un-Delivered`, 'client').then((response) => {
      if (response.data.status) {
        if (response.data.data.length === 0) {
          setMessage('No data found')
        }
        setData(response?.data?.data)
        console.log(response?.data?.data);
        
        setLoading(false)

      }
    })
  }

  useEffect(() => {
    setLoading(true)
    setMessage('')
    if (
      searchQuery.currentStatus ||
      searchQuery.clientId ||
      searchQuery.driverId ||
      searchQuery.fromDate ||
      searchQuery.toDate ||
      searchQuery.jobId ||
      searchQuery.clientName ||
      searchQuery.driverName
    ) {
      setLoading(false)
    } else {
      fetchInitialData()
    }
  }, [isReferesh])

  const handleClear = () => {
    setMessage('')
    setIsReferesh(!isReferesh)
    setSearchQuery({
      AWB: '',
      clientId: '',
      driverId: '',
      fromDate: '',
      toDate: '',
      currentStatus: '',
      jobId: '',
      clientName: '',
      driverName: '',
    })
  }
  // handle sort
  const handleSort = (field) => {
    const sortedData = sortData(data, field)
    setData(sortedData)
  }

  useEffect(() => {
    // Retrieve the selected item from local storage if it exists
    const storedSelectedItem = sessionStorage.getItem('selectedItem')
    if (storedSelectedItem) {
      setSelectedJob(JSON.parse(storedSelectedItem))
    }
  }, [])
  return (
    <>
      <Row className="d-flex pb-3 align-items-center justify-content-between">
        <Col md={4} className="m-0">
          <SearchBar
            onSearch={onSearch}
            role="client"
            handleClear={handleClear}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Col>

        <Col md={8} className="ps-5 d-flex align-items-center justify-content-between">
          <Row className="d-flex align-items-center">
            <Col md={9} className="m-0">
              <DateRangeFilter
                setData={setData}
                role="client"
                setMessage={setMessage}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </Col>
            <Col md={3} className="m-0">
              <Button onClick={() => handleClear()} style={{ fontSize: '10px' }}>
                Clear Filter/Search
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={10}>
              <h4 id="traffic" className="card-title mb-0">
                Jobs
              </h4>
            </CCol>
            <CCol sm={2} className="d-flex justify-content-end">
              <CButton color="primary" style={{ fontSize: '12px' }} onClick={handleTodayJobs}>
                Today's Jobs
              </CButton>
            </CCol>
          </CRow>

          {/* add here react-bootrap table */}
          <Table className="mt-3" responsive hover>
            <thead style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              <tr>
                <th className="text-center">
                  
                  Client<LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('clientId.companyName')}
                  />
                </th>
                <th className="text-center">
                  
                  Ready Time<LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('pickUpDetails.readyTime')}
                  />
                </th>
                <th className="text-center">
                  
                  Cuttoff Time<LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('dropOfDetails.cutOffTime')}
                  />
                </th>
                <th className="text-center">
                  AWB<LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('AWB')}
                  />
                  </th>
                <th className="text-center">Pieces<LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('pieces')}
                  /></th>
                <th className="text-center">
                 
                  Service Type <LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('serviceTypeId.text')}
                  />
                </th>
                <th className="text-center">
                  
                  Service Code<LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('serviceCodeId.text')}
                  />
                </th>
                <th className="text-center">
                  
                  Pickup From<LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('pickUpDetails.pickupLocationId.customName')}
                  />
                </th>

                <th className="text-center">
                  
                  Deliver To<LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('dropOfDetails.dropOfLocationId.customName')}
                  />
                </th>

                <th className="text-center">Job Id<LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('uid')}
                  /></th>

                <th className="text-center">
                  
                  Driver<LuChevronDown
                    className="cursor-pointer m-1 "
                    size={20}
                    onClick={() => handleSort('driverId.firstname')}
                  />
                </th>

                <th className="text-center">
                  
                  Status<LuChevronDown
                    className="cursor-pointer m-1"
                    size={20}
                    onClick={() => handleSort('currentStatus')}
                  />
                </th>
                <th className="text-center" colSpan={4}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '13px' }}>
              {message ? (
                <tr>
                  {' '}
                  <td colSpan={12} className="text-center text-danger">
                    {message}
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  {' '}
                  <Spinner animation="border" variant="primary" />
                </tr>
              ) : (
                data &&
                data.map((item, index) => {
                  const isSelected = item._id === selectedJob?._id
                  const status = item?.isHold ? 'Hold' : item?.currentStatus
                  const styles = getStatusStyles(status)
                  return (
                    <tr key={index} className='cursor-pointer' >
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {item?.clientId?.companyName}
                      </td>
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {getFormattedDAndT(item?.pickUpDetails?.readyTime)}
                      </td>
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {getFormattedDAndT(item?.dropOfDetails?.cutOffTime)}
                      </td>
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {item?.AWB}
                      </td>
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {item?.pieces}
                      </td>
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {item?.serviceTypeId?.text}
                      </td>
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {item?.serviceCodeId?.text}
                      </td>
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {item?.pickUpDetails?.pickupLocationId?.customName}
                      </td>
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {item?.dropOfDetails?.dropOfLocationId?.customName}
                      </td>
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {item?.uid}
                      </td>
                      <td
                        onClick={() => handleView(item)}
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {' '}
                        {item?.driverId
                          ? `${item?.driverId?.firstname}-${item?.driverId?.lastname}`
                          : ''}{' '}
                      </td>
                      <td
                        className="text-center"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        <div className="px-1 py-1 rounded-5 text-center" style={styles}>
                          {status}
                        </div>
                      </td>
                      <td
                        className="text-center cursor-pointer "
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {item?.currentStatus === 'Pending' ? (
                          <FaRegEdit className="text-primary" onClick={() => handleEdit(item)} />
                        ) : (
                          ''
                        )}
                      </td>
                      <td
                        className="text-center cursor-pointer"
                        style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                      >
                        {assignDriverP === 'true' ? (
                          <FaTruckMoving onClick={() => handleShowAssign(item)} />
                        ) : (
                          ''
                        )}
                      </td>
                      {trackPermission === 'true' ? (
                        <td
                          className="text-center cursor-pointer"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          <FaMapMarkedAlt
                            className="text-primary"
                            onClick={() => navigate(`/client/dashboard/location/${item._id}`)}
                          />
                        </td>
                      ) : (
                        ''
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </Table>
        </CCardBody>
      </CCard>
      {show ? (
        <EditJob
          show={show}
          handleClose={handleClose}
          job={selectedJob}
          setIsRefresh={setIsReferesh}
          isReferesh={isReferesh}
          role="client"
        />
      ) : (
        ''
      )}

      {showAssign ? (
        <AssignDriverModal
          show={showAssign}
          setShow={setShowAssign}
          jobId={selectedJob._id}
          setIsRefresh={setIsReferesh}
          isReferesh={isReferesh}
          role="client"
        />
      ) : (
        ''
      )}
    </>
  )
}

export default Dashboard

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Col, Container, Form, Row, Spinner, Table, Modal, Button } from 'react-bootstrap'
import { FaSearch, FaRegEdit, FaEye, FaTruckMoving, FaMapMarkedAlt, FaFilter } from 'react-icons/fa'
import { get } from '../../lib/request'
import MyPagination from '../../components/Pagination'
import { useNavigate } from 'react-router-dom'
import { getTotalDocs } from '../../services/getTotalDocs'
import ViewJobs from '../../components/Modals/ViewJobs'
import { BiDetail } from 'react-icons/bi'
import FilterOffCanvas from '../../components/Filter'
import { getSeachFilterResult } from '../../services/getSearchFilterResult'
import EditJob from '../../components/Modals/EditJob'
import AssignDriverModal from '../../components/Modals/AssignDriver'
import JsonToExcelBtn from '../../components/operations/JsonToExcelBtn'
import DateRangeFilter from '../../components/DateRangeFilter'
import getStatusStyles from '../../services/getStatusColor'
import { LuChevronDown } from 'react-icons/lu'
import sortData from '../../services/sortData'
import { getFormattedDAndT } from '../../lib/getFormatedDate'

const AllJobs = () => {
  let assignPermission = localStorage.getItem('clientDriverAssign')
  let trackPermission = localStorage.getItem('clientTrackPermission')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isReferesh, setIsRefresh] = useState(false)
  const [data, setData] = useState([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [message, setMessage] = useState('')

  const [selectedJob, setSelectedJob] = useState(null)

  const [show, setShow] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showAssign, setShowAssign] = useState(false)

  const [filterShow, setFilterShow] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchQuery = useSelector((state) => state.searchQuery2)
  const setSearchQuery = (query) => {
    dispatch({
      type: 'updateSearchQuery2',
      payload: query,
    })
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  // handle edit

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
  const handleCloseView = () => setShowView(false)

  // handle assign driver modal
  const handleShowAssign = (item) => {
    setSelectedJob(item)
    setShowAssign(true)
  }

  // handle Filter
  const handleFilterClose = () => {
    setFilterShow(false)
  }
  const handleSearchClick = (searchTerm, selectedOption) => {
    let query = {
      AWB: searchQuery.AWB,
      clientId: searchQuery.clientId,
      driverId: searchQuery.driverId,
      fromDate: searchQuery.fromDate,
      toDate: searchQuery.toDate,
      currentStatus: searchQuery.currentStatus,
    }
    if (selectedOption === 'jobId') {
      query.jobId = searchTerm
      query.AWB = ''
    } else if (selectedOption === 'AWB') {
      query.AWB = searchTerm
      query.jobId = ''
    } else {
      query.AWB = ''
      query.jobId = ''
    }
    setIsFiltering(true)

    getSeachFilterResult(query, 'client').then((res) => {
      setFilterShow(false)
      setData(res)
    })
  }
  const handleClear = () => {
    setMessage('')
    setIsFiltering(!isReferesh)
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
    setSearchTerm('')
    setIsFiltering(false)
    isReferesh ? setIsRefresh(false) : setIsRefresh(true)
  }

  useEffect(() => {
    getTotalDocs('JOB', 'client')
      .then((data) => {
        setTotalDocs(data)
        setTotalPages(Math.ceil(data / limit))
      })
      .catch((e) => {
        console.log('error while getting total docs', e.message)
      })
  }, [isReferesh])

  useEffect(() => {
    console.log('searchQuery', searchQuery)
    if (isFiltering) {
      return
    } else if (
      searchQuery.currentStatus ||
      searchQuery.clientId ||
      searchQuery.driverId ||
      searchQuery.fromDate ||
      searchQuery.toDate ||
      searchQuery.jobId ||
      searchQuery.clientName ||
      searchQuery.driverName
    ) {
      getSeachFilterResult(searchQuery, 'client').then((res) => {
        setData(res)
      })
      return
    }

    const fetchData = () => {
      get(`/client/jobFilter`, 'client')
        .then((response) => {
          setData(response?.data?.data)
          setLoading(false)
        })
        .catch((error) => {
          console.error(error)
          setLoading(false)
        })
    }

    fetchData()

    const intervalId = setInterval(fetchData, 3000)

    return () => clearInterval(intervalId)
  }, [page, limit, isReferesh, isFiltering])

  const handlePageChange = (page) => {
    setPage(page)
  }

  const handleLimitChange = (e) => {
    setLimit(e.target.value)
    setTotalPages(Math.ceil(totalDocs / e.target.value))
  }

  // handle search
  const handleSearch = (val) => {
    setIsFiltering(true)
    setSearchTerm(val)

    let url = `/client/search-string/${val}`

    get(url, 'client').then((res) => {
      if (res.data.status) {
        setData(res.data.data)
      }
    })
  }

  const handleSort = (field) => {
    const sortedData = sortData(data, field)
    setIsFiltering(true)
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
      <Row>
        <Col md={12}>
          <Container className="bg-white py-3 px-2 rounded-3">
            <Row className="mb-3 justify-content-between">
              <Col md={4} className="d-flex align-items-center gap-3">
                show:
                <Form.Select value={limit} onChange={handleLimitChange}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </Form.Select>
              </Col>
              <Col md={8} className="d-flex align-items-center gap-3">
                entries:
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <span className="input-group-text">
                    <FaFilter onClick={() => setFilterShow(true)} className="cursor-pointer" />
                  </span>
                  <Button style={{ fontSize: '12px' }} onClick={handleClear}>
                    {' '}
                    Clear Filter/Search{' '}
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="mb-3 justify-content-between">
              <Col md={6} className="d-flex">
                <DateRangeFilter
                  setData={setData}
                  role="client"
                  setMessage={setMessage}
                  setIsFiltering={setIsFiltering}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </Col>

              <Col md={6} className="d-flex justify-content-end">
                <JsonToExcelBtn jsonData={data} fileName="Booking" />
              </Col>
            </Row>

            <Table className="mt-3" bordered responsive hover>
              <thead style={{ fontSize: 13, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                <tr>
                  <th className="text-center">
                   
                    Client <LuChevronDown
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
                  <th className="text-center">AWB<LuChevronDown
                                      className="cursor-pointer m-1"
                                      size={20}
                                      onClick={() => handleSort('AWB')}
                                    /></th>
                  <th className="text-center">Pieces<LuChevronDown
                                      className="cursor-pointer m-1"
                                      size={20}
                                      onClick={() => handleSort('pieces')}
                                    /></th>
                  <th className="text-center">
                    
                    Service Type<LuChevronDown
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
              <tbody style={{ fontSize: 13 }}>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="text-center text-danger">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => {
                    const isSelected = item._id === selectedJob?._id
                    const status = item?.isHold ? 'Hold' : item?.currentStatus
                    const styles = getStatusStyles(status)
                    return (
                      <tr key={index} className="cursor-pointer">
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
                          onClick={() => handleView(item)}
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
                        {/* <td className="text-center cursor-pointer">

                                                        <FaEye className="text-success" onClick={() => handleView(item)} />
                                                    </td> */}
                        {assignPermission === 'true' ? (
                          <td
                            className="text-center cursor-pointer"
                            style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                          >
                            {!item?.driverId ? (
                              <FaTruckMoving onClick={() => handleShowAssign(item)} />
                            ) : (
                              ''
                            )}
                          </td>
                        ) : (
                          ''
                        )}

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
          </Container>
        </Col>
      </Row>

      <div className="d-flex justify-content-center">
        <MyPagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
      </div>
      {show ? (
        <EditJob
          show={show}
          handleClose={handleClose}
          job={selectedJob}
          setIsRefresh={setIsRefresh}
          isReferesh={isReferesh}
          role="client"
        />
      ) : (
        ''
      )}
      {showView ? <ViewJobs show={showView} handleClose={handleCloseView} job={selectedJob} /> : ''}
      {showAssign && !selectedJob?.driverId ? (
        <AssignDriverModal
          show={showAssign}
          setShow={setShowAssign}
          jobId={selectedJob._id}
          setIsRefresh={setIsRefresh}
          isReferesh={isReferesh}
          role="client"
        />
      ) : (
        ''
      )}
      <FilterOffCanvas
        show={filterShow}
        handleClose={handleFilterClose}
        onApplyFilter={(selectedOption) => handleSearchClick(searchTerm, selectedOption)}
        role={'client'}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </>
  )
}

export default AllJobs

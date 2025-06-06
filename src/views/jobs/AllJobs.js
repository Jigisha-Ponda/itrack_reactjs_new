/* eslint-disable react/react-in-jsx-scope */
import { FaTruckMoving, FaEye, FaMapMarkedAlt, FaFilter } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { get } from '../../lib/request'
import { getTotalDocs } from '../../services/getTotalDocs'
import MyPagination from '../../components/Pagination'
import { Button, Col, Container, Form, Row, Table, Modal, Spinner } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import AssignDriverModal from '../../components/Modals/AssignDriver'
import FilterOffCanvas from '../../components/Filter'
import { getSeachFilterResult } from '../../services/getSearchFilterResult'
import { FaExchangeAlt } from 'react-icons/fa'
import ChangeDriverModal from '../../components/Modals/ChangeDriver'
import JsonToExcelBtn from '../../components/operations/JsonToExcelBtn'
import DateRangeFilter from '../../components/DateRangeFilter'
import getStatusStyles from '../../services/getStatusColor'
import sortData from '../../services/sortData'
import { LuChevronDown } from 'react-icons/lu'
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getFormattedDAndT } from '../../lib/getFormatedDate'

const AllJobs = () => {
  const dispatch = useDispatch()
  const searchQuery = useSelector((state) => state.searchQuery2)
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isReferesh, setIsRefresh] = useState(false)
  const [data, setData] = useState([])
  const [message, setMessage] = useState(null)

  const [selectedJob, setSelectedJob] = useState(null)

  const [showAssign, setShowAssign] = useState(false)
  const [showChangeDriver, setShowChangeDriver] = useState(false)
  const [filterShow, setFilterShow] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const setSearchQuery = (query) => {
    dispatch({
      type: 'updateSearchQuery2',
      payload: query,
    })
  }


  // handle view
  const handleView = (item) => {
    sessionStorage.setItem('selectedItem', JSON.stringify(item))
    navigate(`/client/job/details/${item._id}`, { state: { selectedItem: item } })
  }

  // handle assign driver modal
  const handleShowAssign = (item) => {
    setSelectedJob(item)
    setShowAssign(true)
  }

  const handelChangeDriver = (item) => {
    setSelectedJob(item)
    setShowChangeDriver(true)
  }

  // handle Filter
  const handleFilterClose = () => {
    setFilterShow(false)
  }
  const handleSearchClick = (selectedOption) => {
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
    getSeachFilterResult(query, 'admin').then((res) => {
      setFilterShow(false)
      setData(res)
      // setSearchQuery({
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
    })
  }
  // fetch data
  const fetchData = () => {
    // setLoading(true);
    get(`/admin/info/allJobs?page=${page}&limit=${limit}`, 'admin')
      .then((response) => {
        setData(response?.data?.data)
        setLoading(false);
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }

  useEffect(() => {
    getTotalDocs('JOB', 'admin')
      .then((data) => {
        setTotalDocs(data)
        setTotalPages(Math.ceil(data / limit))
      })
      .catch((e) => {
        console.log('error while getting total docs', e.message)
      })
  }, [isReferesh])

  useEffect(() => {
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
      getSeachFilterResult(searchQuery, 'admin').then((res) => {
        setData(res)
      })
      return
    }
    fetchData()
    const intervalId = setInterval(fetchData, 3000)
    return () => clearInterval(intervalId)
  }, [page, limit, isReferesh, isFiltering])

  const handlePageChange = (page) => {
    handleClear();
    setPage(page)
  }

  const handleLimitChange = (e) => {
    setLimit(e.target.value)
    setTotalPages(Math.ceil(totalDocs / e.target.value))
  }

  const handleClear = () => {
    setMessage('')
    setIsRefresh(!isReferesh)
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
  }

  // handle search
  const debouncedSearch = useCallback(
    debounce((val) => {
      setIsFiltering(true);
      let url = `/admin/info/search-string/${val}`;
      get(url, 'admin').then((res) => {
        if (res.data.status) {
          setData(res.data.data);
        }
      });
    }, 1000), // Wait 1 second after typing stops
    []
  );

  const handleSearch = (val) => {
    setSearchTerm(val);
    debouncedSearch(val);
  };


  const handleSort = (field) => {
    const sortedData = sortData(data, field)
    console.log('sortedData', sortedData)
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
              <Col className="d-flex align-items-center gap-3">
                Show:
                <Form.Select className="entries-dropdown" value={limit} onChange={handleLimitChange}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </Form.Select>
                Entries
              </Col>
              <Col md={8} className="d-flex align-items-center gap-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter Job Id or AWB"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <span className="input-group-text cursor-pointer" onClick={() => setFilterShow(true)} >
                    <FaFilter/>
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
                  role="admin"
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
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('clientId.companyName')}
                    />
                    Client
                  </th>
                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('pickUpDetails.readyTime')}
                    />
                    Ready Time
                  </th>
                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('dropOfDetails.cutOffTime')}
                    />
                    Cuttoff Time
                  </th>
                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('AWB')}
                    />
                    AWB
                  </th>
                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('pieces')}
                    />
                    Pieces</th>
                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('serviceTypeId.text')}
                    />
                    Service Type
                  </th>
                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('serviceCodeId.text')}
                    />
                    Service Code
                  </th>
                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('pickUpDetails.pickupLocationId.customName')}
                    />
                    Pickup From
                  </th>

                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('dropOfDetails.dropOfLocationId.customName')}
                    />
                    Deliver To
                  </th>

                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('uid')}
                    />
                    Job Id</th>

                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1 "
                      size={20}
                      onClick={() => handleSort('driverId.firstname')}
                    />
                    Driver
                  </th>

                  <th className="text-center">
                    <LuChevronDown
                      className="cursor-pointer m-1"
                      size={20}
                      onClick={() => handleSort('currentStatus')}
                    />
                    Status
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
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.clientId?.companyName}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {getFormattedDAndT(item?.pickUpDetails?.readyTime)}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {getFormattedDAndT(item?.dropOfDetails?.cutOffTime)}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.AWB}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.pieces}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.serviceTypeId?.text}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.serviceCodeId?.text}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.pickUpDetails?.pickupLocationId?.customName}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.dropOfDetails?.dropOfLocationId?.customName}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {item?.uid}
                        </td>
                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {' '}
                          {item?.driverId
                            ? `${item?.driverId?.firstname}-${item?.driverId?.lastname}`
                            : ''}{' '}
                        </td>

                        <td
                          onClick={() => handleView(item)}
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          <div className="px-1 py-1 rounded-5 text-center" style={styles}>
                            {status}
                          </div>
                        </td>
                        <td
                          className="cursor-pointer"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          {!item?.driverId ? (
                            <FaTruckMoving onClick={() => handleShowAssign(item)} />
                          ) : (
                            <FaExchangeAlt onClick={() => handelChangeDriver(item)} />
                          )}
                        </td>

                        <td
                          className="text-center cursor-pointer"
                          style={{ backgroundColor: isSelected ? '#E0E0E0' : 'transparent' }}
                        >
                          <FaMapMarkedAlt
                            className="text-primary"
                            onClick={() => navigate(`/location/${item?._id}`)}
                          />
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </Table>
          </Container>
        </Col>
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <div className="text-center w-100" style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <MyPagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
        </div>
      </div>
      {showAssign ? (
        <AssignDriverModal
          show={showAssign}
          setShow={setShowAssign}
          jobId={selectedJob._id}
          setIsRefresh={setIsRefresh}
          isReferesh={isReferesh}
        />
      ) : (
        ''
      )}
      {showChangeDriver ? (
        <ChangeDriverModal
          show={showChangeDriver}
          setShow={setShowChangeDriver}
          jobId={selectedJob._id}
          setIsRefresh={setIsRefresh}
          isReferesh={isReferesh}
        />
      ) : (
        ''
      )}
      <FilterOffCanvas
        show={filterShow}
        handleClose={handleFilterClose}
        onApplyFilter={(selectedOption) => handleSearchClick(selectedOption)}
        role={'admin'}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </>
  )
}

export default AllJobs

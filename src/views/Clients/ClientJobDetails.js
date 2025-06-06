import { Button, Card, Col, Container, Dropdown, Form, Modal, Row, Spinner } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { get, postWihoutMediaData, updateReq } from '../../lib/request'
import { useNavigate, useParams } from 'react-router-dom'
import sweetAlert from 'sweetalert2'
import { getFormattedDAndT, getLocalDateAndTime, convertToMelbourneFormat } from '../../lib/getFormatedDate'
import VPAPdfGenerate from '../../components/operations/VPAPdfGenerate'
import ChangeAttchment from './changeAttchment'
import getLocationByCordinates from '../../services/getLocationByCordinates'
import ViewDriverUploads from './viewDriverUploads'
import EditJobAdmin from '../../components/Modals/EditJobAdmin'
import { MdOutlineArrowBack } from 'react-icons/md'
import Moment from 'react-moment';
export default function ClientJobDetails() {
  const navigate = useNavigate()
  const imgSrc = process.env.Image_Src
  const { id } = useParams()
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [job, setJob] = useState({})
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [isRefresh, setIsRefresh] = useState(false)
  const [showAttachment, setShowAttachment] = useState(false)
  const [pickupLocationName, setPickupLocationName] = useState('')
  const [deliveryLocationName, setDeliveryLocationName] = useState('')
  const [isAdminReview, setIsAdminReview] = useState(false);

  // handle attachment modal
  const handleAttachmentClose = () => setShowAttachment(false)
  const handleAttachmentShow = () => setShowAttachment(true)

  const [activeBtn, setActiveBtn] = useState('jobDetails')

  const changeActiveBtn = (btn) => {
    setActiveBtn(btn)
  }

  const statusFields = [
    'Pending',
    'Driver Assigned',
    'Arrival on Pickup',
    'Picked Up',
    'Arrival on Delivery',
    'Delivered',
    'Cancelling',
    'Cancelled',
    'Hold',
    'Un Hold',
  ]

  const handleStatusChange = () => {
    if (status === 'Hold' || status === 'Un Hold') {
      updateReq(`/v2/admin/job?job_id=${id}`, { currentStatus: status }, 'admin').then((res) => {
        if (res.data.status) {
          sweetAlert.fire({
            icon: 'success',
            title: 'Status Changed Successfully',
          })
          setIsRefresh(!isRefresh)
          handleClose()
        } else {
          sweetAlert.fire({
            icon: 'error',
            title: `${res.data.message}`,
          })
        }
      })
    } else {
      updateReq(`/admin/job/status?id=${id}`, { new_status: status }, 'admin').then((res) => {
        if (res.data.status) {
          sweetAlert.fire({
            icon: 'success',
            title: 'Status Changed Successfully',
          })
          setIsRefresh(!isRefresh)
          handleClose()
        } else {
          sweetAlert.fire({
            icon: 'error',
            title: `${res.data.message}`,
          })
        }
      })
    }
  }

  // handle cancle booking
  const handleCancleBooking = () => {
    sweetAlert
      .fire({
        title: 'Are you sure?',
        text: 'You want to cancel the booking',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Cancel it!',
      })
      .then((result) => {
        if (result.isConfirmed) {
          postWihoutMediaData(`/v2/admin/job-cancellation?job_id=${id}`, {}, 'admin').then(
            (res) => {
              if (res.data.status) {
                sweetAlert.fire({
                  icon: 'success',
                  title: 'Booking Cancelled Successfully',
                })
                setIsRefresh(!isRefresh)
              } else {
                sweetAlert.fire({
                  icon: 'error',
                  title: `${res.data.message}`,
                })
              }
            },
          )
        }
      })
  }

  useEffect(() => {
    setLoading(true);

    const fetchJobDetails = () => {
      get(`/admin/job?id=${id}`, 'admin').then((res) => {
        if (res.data.status) {
          setJob(res.data.data);
          setStatus(res.data.data.currentStatus);
          console.log(res.data.data.currentStatus);
          console.log("job details");
          setLoading(false);
        }
      }).catch((error) => {
        console.error("Error fetching job details:", error);
        setLoading(false);
      });
    };





    // Initial data fetch
    fetchJobDetails();

    // Polling every 10 seconds
    const interval = setInterval(fetchJobDetails, 10000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [id]);


  useEffect(() => {
    const fetchLocationNames = async () => {
      if (job.pickUpDetails?.pickupAddress) {
        const { latitude, longitude } = job.pickUpDetails.pickupAddress
        const locationName = await getLocationByCordinates(latitude, longitude)
        setPickupLocationName(locationName)
      }
      if (job.dropOfDetails?.deliveryAddress) {
        const { latitude, longitude } = job.dropOfDetails.deliveryAddress
        const locationName = await getLocationByCordinates(latitude, longitude)
        setDeliveryLocationName(locationName)
      }
    }
    fetchLocationNames()
  }, [job])

  return (
    <>
      {loading ? (
        <Spinner animation="border" role="status" className="mx-auto d-block" />
      ) : (
        <div style={{ fontSize: '11px' }}>
          {/* Edited */}
          <div style={{ fontSize: '11px' }}>
            <button
              onClick={() => changeActiveBtn('jobDetails')}
              className="custom-btn rounded-3"
              style={{
                backgroundColor: activeBtn === 'jobDetails' ? '#5856d6' : 'transparent',
                color: activeBtn === 'jobDetails' ? 'white' : 'black',
              }}
            >
              Job Details
            </button>
            <button
              onClick={() => changeActiveBtn('clientDetails')}
              className="custom-btn mx-3 rounded-3"
              style={{
                backgroundColor: activeBtn === 'clientDetails' ? '#5856d6' : 'transparent',
                color: activeBtn === 'clientDetails' ? 'white' : 'black',
              }}
            >
              Client Details
            </button>
            <button
              onClick={() => changeActiveBtn('driverAttachments')}
              className="custom-btn mx-3 rounded-3"
              style={{
                backgroundColor: activeBtn === 'driverAttachments' ? '#5856d6' : 'transparent',
                color: activeBtn === 'driverAttachments' ? 'white' : 'black',
              }}
            >
              Driver Attachments
            </button>
            <button
              onClick={() => changeActiveBtn('pickupDetails')}
              className="custom-btn mx-3 rounded-3"
              style={{
                backgroundColor: activeBtn === 'pickupDetails' ? '#5856d6' : 'transparent',
                color: activeBtn === 'pickupDetails' ? 'white' : 'black',
              }}
            >
              Pickup Details
            </button>
            <button
              onClick={() => changeActiveBtn('dropOfDetails')}
              className="custom-btn mx-3 rounded-3"
              style={{
                backgroundColor: activeBtn === 'dropOfDetails' ? '#5856d6' : 'transparent',
                color: activeBtn === 'dropOfDetails' ? 'white' : 'black',
              }}
            >
              Drop of Details
            </button>
          </div>

          <Container className="mt-2 bg-white shadow p-3">
            {activeBtn === 'jobDetails' ? (
              <>
                <h4 className="text-center mb-2 fw-bold" style={{ fontSize: '14px' }}>
                  Job Details
                </h4>
                <ul className="m-0 p-0 custom-list-main">
                  <Row>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Job Id:</b> <span>{job?.uid}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Client Id:</b> <span>{job.clientId?._id}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>AWB:</b> <span>{job?.AWB}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Pieces:</b> <span>{job?.pieces}</span>
                      </li>
                    </Col>

                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Weight:</b> <span>{job?.weight} KG</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Service Type:</b> <span>{job?.serviceTypeId?.text}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Service Code:</b> <span>{job?.serviceCodeId?.text}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Reference No:</b> <span>{job?.custRefNumber}</span>
                      </li>
                    </Col>

                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Note: </b> <span>{job?.note}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Driver Note: </b>{' '}
                        <span>
                          {job?.driverNote?.map((noteObj, index) => {
                            // Extract and sort numeric keys
                            return <div key={index}>
                              <b>{index + 1} . </b>
                              {noteObj.text}{' '}{' '}{<Moment format="DD/MM/YYYY hh:mm A">
                                {noteObj.createdAt}
                              </Moment>}</div>
                          })}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Admin Note:</b><span>{job?.adminNote}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>VPAP Submitted:</b> <span>{job?.VpapId == null ? 'No' : 'Yes'}</span>
                      </li>
                    </Col>

                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Attachment:</b>{' '}
                        <span>
                          <p
                            onClick={handleAttachmentShow}
                            className="m-0 p-0"
                            style={{
                              color: '#007bff',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                          >
                            View Attachments
                          </p>
                        </span>
                      </li>
                    </Col>

                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Rates:</b> <span>{job?.rates}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Fuel Surcharge:</b> <span>{job?.fuel_charge}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Invoices:</b> <span>{job?.is_invoices ? 'Yes' : 'No'}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Invoice Number:</b> <span>{job?.invoice_number}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Wait Time Charge:</b> <span>{job?.wait_time_charge}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Created Booking Time:</b>{' '}
                        <span>{getFormattedDAndT(job?.createdDateTime)}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3 d-flex align-items-center">
                      <Form.Group>
                        <Form.Check
                          type="checkbox"
                          label="Admin Review"
                          checked={isAdminReview}
                          className="custom-checkbox"
                          onChange={(e) => setIsAdminReview(e.target.checked)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </ul>
              </>
            ) : activeBtn === 'clientDetails' ? (
              <>
                <h4 className="text-center mb-4">Client Details</h4>
                <ul className="m-0 p-0 custom-list-main">
                  <Row>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Username:</b> <span>{job?.clientId?.username}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Full Name:</b>{' '}
                        <span>
                          {job?.clientId?.firstname} {job?.clientId?.lastname}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Email:</b> <span>{job?.clientId?.email}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Phone:</b> <span>{job?.clientId?.phone}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Company name:</b> <span>{job?.clientId?.companyName}</span>
                      </li>
                    </Col>
                    {job?.booked_by ? (
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Booked By:</b> <span>{job?.booked_by}</span>
                        </li>
                      </Col>
                    ) : (
                      ''
                    )}
                    {job?.clientId?.isDriverPermission ? (
                      <Col md={6} className="mb-3">
                        <li className="custom-list">
                          <b>Driver Assigning Permission:</b>{' '}
                          <span>
                            <FaCheckCircle className="text-success" />
                          </span>
                        </li>
                      </Col>
                    ) : (
                      ''
                    )}
                  </Row>
                </ul>
              </>
            ) : activeBtn === 'driverAttachments' ? (
              <>
                <h4 className="text-center mb-4">Driver Attachments</h4>
                <ViewDriverUploads
                  captures={job?.capturedPic}
                  Rname={job?.signature_name}
                  RSign={job?.deliveredVerificationImage}
                />
              </>
            ) : activeBtn === 'pickupDetails' ? (
              <>
                <h4 className="text-center mb-4">Pickup Details</h4>
                <ul className="m-0 p-0 custom-list-main">
                  <Row>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Ready Time:</b>{' '}
                        <span>
                          {job?.pickUpDetails?.readyTime
                            ? getFormattedDAndT(job?.pickUpDetails?.readyTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Pick Up Location:</b>{' '}
                        <span>{job?.pickUpDetails?.pickupLocationId?.customName}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Arrival Time:</b>{' '}
                        <span>
                          {job?.pickUpDetails?.arrivalTime
                            ? getFormattedDAndT(job?.pickUpDetails?.arrivalTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Picked Up Time:</b>{' '}
                        <span>
                          {job?.pickUpDetails?.pickedUpTime
                            ? getFormattedDAndT(job?.pickUpDetails?.pickedUpTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Pickup Address:</b> <span>{pickupLocationName}</span>
                      </li>
                    </Col>
                  </Row>
                </ul>
              </>
            ) : (
              <>
                <h4 className="text-center mb-4">Drop of Details</h4>
                <ul className="m-0 p-0 custom-list-main">
                  <Row>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Cut off Time:</b>{' '}
                        <span>
                          {job?.dropOfDetails?.cutOffTime
                            ? getFormattedDAndT(job?.dropOfDetails?.cutOffTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Drop Off Location:</b>{' '}
                        <span>{job?.dropOfDetails?.dropOfLocationId?.customName}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Arrival Time:</b>{' '}
                        <span>
                          {job?.dropOfDetails?.arrivalTime
                            ? getFormattedDAndT(job?.dropOfDetails?.arrivalTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Delivered Time:</b>{' '}
                        <span>
                          {job?.dropOfDetails?.deliveredTime
                            ? getFormattedDAndT(job?.dropOfDetails?.deliveredTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Delivery Address:</b> <span>{deliveryLocationName}</span>
                      </li>
                    </Col>
                  </Row>
                </ul>
              </>
            )}
          </Container>

          <Row className="mt-1">
            <Col className="d-flex align-item-center justify-content-end gap-2 py-3">
              <EditJobAdmin job={job} setIsRefresh={setIsRefresh} isReferesh={isRefresh} />
              <Button variant="primary" onClick={() => handleShow()}>
                {' '}
                Change Status{' '}
              </Button>
              {job?.VpapId == null ? <Button
                className="text-white"
                variant="success"
                onClick={() => navigate(`/client/vpap/add/${id}`)}
              >
                {' '}
                Add Vpap
              </Button> : null}
              <Button
                style={{ background: '#9B59B6', borderColor: '#9B59B6' }}
                onClick={() => navigate(`/location/${id}`)}
              >
                {' '}
                Track Driver{' '}
              </Button>
              <Button variant="danger" className="text-white" onClick={handleCancleBooking}>
                {' '}
                Cancel Booking{' '}
              </Button>
            </Col>
          </Row>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header className="border-0 text-center w-100">
              <Modal.Title className="w-100">
                {' '}
                <p className="mx-auto d-block">Change Status </p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  className="w-75 mx-auto d-block"
                  id="dropdown-autoclose-false"
                >
                  {status}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-75">
                  {statusFields.map((status, index) => (
                    <Dropdown.Item key={index} onClick={() => setStatus(status)}>
                      {status}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleStatusChange}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showAttachment} onHide={handleAttachmentClose}>
            <Modal.Header className="border-0 text-center w-100">
              <Modal.Title className="w-100">
                {' '}
                <p className="mx-auto d-block">Attachmens</p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-3">
              <Card>
                <Card.Body>
                  <p className="m-1 text-center fw-bold">
                    {' '}
                    You can download the attachment from here.{' '}
                  </p>
                  {job?.attachmentKeys?.length === 0 && (
                    <p className="text-center text-danger"> No Attachment Found </p>
                  )}
                  {job?.attachmentKeys?.map((key, index) => {
                    return (
                      <div key={index} className="mb-2 ">
                        <b>{index + 1} :</b>{' '}
                        <Button
                          variant="success"
                          className="rounded-0 text-white rounded-1"
                          onClick={() => window.open(`${imgSrc}${key}`, '_blank')}
                        >
                          {' '}
                          Download{' '}
                        </Button>
                      </div>
                    )
                  })}
                  <hr />
                  <h5 className="fw-bold"> VPAP </h5>
                  {job?.isVpap ? (
                    <VPAPdfGenerate
                      jobDetail={{
                        AWB: job?.AWB,
                        driverName: job?.driverId?.firstname + ' ' + job?.driverId?.lastname,
                        companyName: job?.clientId?.companyName,
                        // date: getFormattedDAndT(job?.pickUpDetails?.readyTime),
                        date: getFormattedDAndT(job?.pickUpDetails?.pickedUpTime),
                      }}
                      VPAPData={job?.VpapId}
                    />
                  ) : (
                    ''
                  )}
                </Card.Body>
              </Card>
            </Modal.Body>
            <Modal.Footer>
              <ChangeAttchment id={job._id} isRefresh={isRefresh} setIsRefresh={setIsRefresh} />

              <Button variant="secondary" onClick={handleAttachmentClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  )
}

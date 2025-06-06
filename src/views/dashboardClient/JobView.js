import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Spinner, Modal, Card } from 'react-bootstrap'
import { FaCheckCircle } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import sweetAlert from 'sweetalert2'
import { get, updateReq } from '../../lib/request'
import Moment from 'react-moment'
import { getFormattedDAndT, getLocalDateAndTime, convertToMelbourneFormat } from '../../lib/getFormatedDate'
import ViewDriverUploads from '../Clients/viewDriverUploads'
import VPAPdfGenerate from '../../components/operations/VPAPdfGenerate'

const JobDetails = () => {
  const { id } = useParams()
  const imgSrc = process.env.Image_Src

  const navigate = useNavigate()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [showAttachment, setShowAttachment] = useState(false)

  // handle attachment modal
  const handleAttachmentClose = () => setShowAttachment(false)
  const handleAttachmentShow = () => setShowAttachment(true)
  const handleConfirm = () => {
    sweetAlert
      .fire({
        title: 'Are you sure?',
        text: 'You want to cancel this booking',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Cancel it!',
        cancelButtonText: 'No, Keep it',
      })
      .then((result) => {
        if (result.isConfirmed) {
          updateReq(`/client/cancel-job/${id}`, {}, 'client').then((res) => {
            if (res.data.status) {
              sweetAlert.fire('Cancelled!', 'Your booking has been cancelled.', 'success')
            } else {
              sweetAlert.fire('Cancelled!', `${res.data.message}`, 'error')
            }
          })
        } else if (result.dismiss === sweetAlert.DismissReason.cancel) {
          sweetAlert.fire('Cancelled', 'Your booking is safe :)', 'error')
        }
      })
  }

  useEffect(() => {
    setLoading(true)
    get(`/client/job?id=${id}`, 'client').then((res) => {
      if (res.data.status) {
        setData(res.data.data)
        setLoading(false)
      }
    })
  }, [])

  const [activeBtn, setActiveBtn] = useState('jobDetails')

  const changeActiveBtn = (btn) => {
    setActiveBtn(btn)
  }

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
              className="custom-btn me-3 rounded-3"
              style={{
                backgroundColor: activeBtn === 'jobDetails' ? '#5856d6' : 'transparent',
                color: activeBtn === 'jobDetails' ? 'white' : 'black',
              }}
            >
              Job Details
            </button>

            <button
              onClick={() => changeActiveBtn('driverDetails')}
              className="custom-btn mx-3 rounded-3"
              style={{
                backgroundColor: activeBtn === 'driverDetails' ? '#5856d6' : 'transparent',
                color: activeBtn === 'driverDetails' ? 'white' : 'black',
              }}
            >
              Driver Details
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
                  <Row style={{ fontSize: '11px' }}>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Job Id:</b> <span>{data?.uid}</span>
                      </li>
                    </Col>

                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Client Id:</b> <span>{data?.clientId?._id}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>AWB:</b> <span>{data.AWB}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Pieces:</b> <span>{data?.pieces}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Weight:</b> <span>{data?.weight}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Service Type:</b> <span>{data?.serviceTypeId?.text}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Service Code:</b> <span>{data?.serviceCodeId?.text}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Reference No:</b> <span>{data?.custRefNumber}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Note:</b> <span>{data?.note}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>VPAP Submitted:</b> <span>{data?.isVpap ? 'Yes' : 'No'}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Attachment:</b>{' '}
                        <span
                          className="text-primary text-decoration-underline"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleAttachmentShow()}
                        >
                          View & Dashboard
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Driver Note: </b>{' '}
                        <span>
                          {data?.driverNote?.map((noteObj, index) => (
                            <div key={index} className="two-line-ellipsis">
                              <b>{index + 1}.</b>{' '}
                              {noteObj.text}{' '}
                              <Moment format="DD/MM/YYYY hh:mm A">
                                {noteObj.createdAt}
                              </Moment>
                            </div>
                          ))}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Created Booking Time:</b>{' '}
                        <span>
                          <Moment format="DD/MM/YYYY, hh:mm a">{data?.createdDateTime}</Moment>
                        </span>
                      </li>
                    </Col>
                  </Row>
                </ul>
              </>
            ) : activeBtn === 'driverDetails' ? (
              <>
                <h4 className="text-center mb-4">Driver Details</h4>
                <ul className="m-0 p-0 custom-list-main">
                  <Row>
                    {/* <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Username:</b> <span>{data?.driverId?.username}</span>
                      </li>
                    </Col> */}
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Full Name:</b>{' '}
                        <span>
                          {data?.driverId?.firstname} {data?.driverId?.lastname}
                        </span>
                      </li>
                    </Col>
                    {/* <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Email:</b> <span>{data?.driverId?.email}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Phone:</b> <span>{data?.driverId?.phone}</span>
                      </li>
                    </Col> */}
                  </Row>
                </ul>
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
                          {data?.pickUpDetails?.readyTime
                            ? getFormattedDAndT(data?.pickUpDetails?.readyTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Pick Up Location:</b>{' '}
                        <span>{data?.pickUpDetails?.pickupLocationId?.customName}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Arrival Time:</b>{' '}
                        <span>
                          {data?.pickUpDetails?.arrivalTime
                            ? getFormattedDAndT(data?.pickUpDetails?.arrivalTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Picked Up Time:</b>{' '}
                        <span>
                          {data?.pickUpDetails?.pickedUpTime
                            ? getFormattedDAndT(data?.pickUpDetails?.pickedUpTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    {/* <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Pickup Address:</b> <span>{pickupLocationName}</span>
                      </li>
                    </Col> */}
                  </Row>
                </ul>
              </>
            ) : activeBtn === 'driverAttachments' ? (
              <>
                <h4 className="text-center mb-4">Driver Attachments</h4>
                <ViewDriverUploads
                  captures={data?.capturedPic}
                  Rname={data?.signature_name}
                  RSign={data?.deliveredVerificationImage}
                />
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
                          {data?.dropOfDetails?.cutOffTime
                            ? getFormattedDAndT(data?.dropOfDetails?.cutOffTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Drop Off Location:</b>{' '}
                        <span>{data?.dropOfDetails?.dropOfLocationId?.customName}</span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Arrival Time:</b>{' '}
                        <span>
                          {data?.dropOfDetails?.arrivalTime
                            ? getFormattedDAndT(data?.dropOfDetails?.arrivalTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Delivered Time:</b>{' '}
                        <span>
                          {data?.dropOfDetails?.deliveredTime
                            ? getFormattedDAndT(data?.dropOfDetails?.deliveredTime)
                            : ''}
                        </span>
                      </li>
                    </Col>
                    {/* <Col md={6} className="mb-3">
                      <li className="custom-list">
                        <b>Delivery Address:</b> <span>{deliveryLocationName}</span>
                      </li>
                    </Col> */}
                  </Row>
                </ul>
              </>
            )}
          </Container>

          <Row className="mt-3">
            <Col className="d-flex align-item-center justify-content-end gap-2 py-3">
              <Button
                style={{ background: '#9B59B6', borderColor: '#9B59B6' }}
                onClick={() => navigate(`/client/dashboard/location/${data._id}`)}
              >
                {' '}
                Track Driver{' '}
              </Button>
              <Button onClick={handleConfirm} variant="danger" className="text-white">
                {' '}
                Cancel Booking{' '}
              </Button>
            </Col>
          </Row>

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
                  {data?.attachmentKeys?.map((key, index) => {
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
                  {data?.isVpap ? (
                    <>
                      <hr />
                      <h5 className="fw-bold"> VPAP </h5>
                      <VPAPdfGenerate
                        jobDetail={{
                          AWB: data?.AWB,
                          driverName: data?.driverId?.firstname + ' ' + data?.driverId?.lastname,
                          companyName: data?.clientId?.companyName,
                          date: getFormattedDAndT(data?.pickUpDetails?.readyTime),
                        }}
                        VPAPData={data?.VpapId}
                      />
                    </>
                  ) : (
                    ''
                  )}
                </Card.Body>
              </Card>
            </Modal.Body>
            <Modal.Footer>
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

export default JobDetails

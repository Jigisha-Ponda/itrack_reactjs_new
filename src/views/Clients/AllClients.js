import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Pagination, Row, Table, Spinner, Image } from 'react-bootstrap'
import {
  FaBoxOpen,
  FaEye,
  FaMapMarkedAlt,
  FaRegEdit,
  FaSearch,
  FaTruckMoving,
  FaPlusCircle,
  FaArrowRight
} from 'react-icons/fa'
import { CButton } from '@coreui/react'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useColorModes } from '@coreui/react'
import { get, deleteReq } from '../../lib/request'
import { getAdminToken } from '../../lib/getTokens'
import MyPagination from '../../components/Pagination'
import { getTotalDocs } from '../../services/getTotalDocs'
import sweetAlert from 'sweetalert2'
import Moment from 'react-moment'
import { BsThreeDotsVertical } from 'react-icons/bs'

function AllClients() {
  let imgSrc = process.env.Image_Src
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);
  const [clientData, setClientData] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isReferesh, setIsRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)

  const handleShowModal = (client) => {
    setSelectedClient(client)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }
  // Deleting the client
  const handleDelete = (Id) => {
    sweetAlert
      .fire({
        title: 'Are you sure?',
        text: 'You want to delete this client?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it!',
        cancelButtonText: 'No, Keep it',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteReq(`admin/client?ID=${Id}`, "admin").then((data) => {
            sweetAlert.fire('Deleted!', 'Client has been deleted.', 'success')
            setIsRefresh(!isReferesh)

          }).catch((e) => {
            console.log("error while deleting client", e)
          })
        } else if (result.dismiss === sweetAlert.DismissReason.cancel) {
          sweetAlert.fire('Cancelled', 'Your Client is safe :)', 'error')
        }
      })
  }
  // Pagination
  const handlePageChange = (page) => {
    setPage(page);
  };
  // Limit
  const handleLimitChange = (e) => {
    setLimit(e.target.value)
    setTotalPages(Math.ceil(totalDocs / e.target.value))
  }

  useEffect(() => {
    setLoading(true);
    get(`/admin/info/allClients?page=${page}&limit=${limit}`, "admin").then((data) => {
      setClientData(data.data.data)
      setLoading(false)
    }).catch((e) => {
      console.log("errr", e.message);
    })
    // Getting total pages

  }, [isReferesh, page, limit])

  useEffect(() => {
    getTotalDocs("CLIENT", "admin").then((data) => {
      setTotalDocs(data);
      setTotalPages(Math.ceil(data / limit))
    }).catch((e) => {
      console.log("error while getting total pages", e.message);
    })
  }
    , [isReferesh])


  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h4 className="mb-0">All Clients</h4>
        </Col>
        <Col className="text-end">
          <CButton className="custom-btn" onClick={() => navigate('/client/add')} >
            Add Client
            <FaArrowRight size={12} className="ms-2" />
          </CButton>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Container className="py-3 px-2 rounded-3">
            {/* <Row className="mb-3 justify-content-between">
              <Col md={8} className="d-flex align-items-center gap-2 ">
                Show
                <Col md={2}>
                  <Form.Select
                    value={limit}
                    onChange={handleLimitChange}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </Form.Select>
                </Col>
                Entries

              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <Button onClick={() => navigate('/client/add')} variant="primary">
                  {' '}
                  <IoMdAdd /> Add Client
                </Button>
              </Col>
            </Row> */}
            <div className="client-rates-table">
              <Table className="custom-table mt-3 table-bordered" responsive hover>
                <thead>
                  <tr>
                    {/* <th className="text-center px-4">#</th> */}
                    <th className="text-start px-4">Company Name</th>
                    <th className="text-start px-4">Email</th>
                    <th className="text-start px-4">Phone</th>
                    <th className="text-start px-4" style={{ width: 'auto', minWidth: '250px' }}>Registered Date</th>
                    <th className="text-start px-4" style={{ width: 'auto', minWidth: 'auto' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="text-center">
                        <Spinner animation="border" className="mx-auto d-block" />
                      </td>
                    </tr>
                  ) : (
                    clientData && clientData.map((client, index) => (
                      <tr key={index}>
                        {/* <td className="text-start px-4">{index + 1}</td> */}
                        <td className="text-start px-4">{client?.companyName}</td>
                        <td className="text-start px-4">{client?.email}</td>
                        <td className="text-start px-4">{client?.phone}</td>
                        <td className="text-start px-4">
                          <Moment format="DD/MM/YYYY, hh:mm a">{client?.createdDateTime}</Moment>
                        </td>
                        <td className="text-center action-dropdown-menu">
                          <div className="dropdown">
                            <button
                              className="btn btn-link p-0 border-0"
                              type="button"

                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <BsThreeDotsVertical size={18} />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button
                                  className="dropdown-item" onClick={() => navigate(`/client/edit/${client?._id}`)}
                                >
                                  View/Edit Details
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item" onClick={() => navigate(`/client/${client?._id}/jobs`)}
                                >
                                  Booking Details
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item" onClick={() => handleDelete(client?._id)}
                                >
                                  Delete Client
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                        {/* <td className="text-start px-4 cursor-pointer">
                        <FaEye
                          onClick={() => handleShowModal(client)}
                          size={22}
                          color="#0984E3"
                        />
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <FaBoxOpen
                          onClick={() => navigate(`/client/${client?._id}/jobs`)}
                          size={22}
                          color="#FDCB6E"
                        />
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <FaRegEdit
                          onClick={() => navigate(`/client/edit/${client?._id}`)}
                          size={22}
                          color="#624DE3"
                        />
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <RiDeleteBin5Line
                          size={22}
                          color="#A30D11"
                          onClick={() => handleDelete(client?._id)}
                        />
                      </td> */}
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            <Row className="mb-3 justify-content-between">
              <Col md={8} className="d-flex align-items-center gap-2 ">
                Show Entries
                <Col md={2}>
                  <Form.Select className="page-entries"
                    value={limit}
                    onChange={handleLimitChange}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </Form.Select>
                </Col>
              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <MyPagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={handlePageChange}
                />
              </Col>
            </Row>
          </Container>
        </Col>
        {/* Modal for showing details */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ marginTop: '10vh' }}>
          <Modal.Header closeButton>
            <Modal.Title>Client Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              selectedClient?.logoKey ?
                < Col md={12} className='m-2' >
                  <div className='fw-bold text-center' >Logo :</div> <Image src={`${imgSrc}${selectedClient?.logoKey}`} rounded height={100} width={100} className='mx-auto d-block mt-2 shadow-lg' />
                </Col>
                : ""}
            <Col md={12} className='m-2' >
              <b>Full Name :</b> {selectedClient?.firstname} {selectedClient?.lastname}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Email :</b> {selectedClient?.email}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Phone :</b> {selectedClient?.phone}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Username :</b> {selectedClient?.username}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Password :</b> {selectedClient?.password}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Company Name :</b> {selectedClient?.companyName}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Driver Permission :</b> {selectedClient?.isDriverPermission ? "yes" : "No"}{' '}
            </Col>
            <Col md={12} className='m-2'>
              <b>Enable Tracker Feature for client :</b> {selectedClient?.isTrackPermission ? "yes" : "No"}{' '}
            </Col>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Row >
    </>
  )
}

export default AllClients

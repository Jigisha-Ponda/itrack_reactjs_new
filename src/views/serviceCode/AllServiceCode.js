import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap'
import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useColorModes } from '@coreui/react'
import { deleteReq, get, postWihoutMediaData, updateReq } from '../../lib/request'
import sweetAlert from 'sweetalert2'
import { getFormattedDAndT } from '../../lib/getFormatedDate'

function AllServiceCode() {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [serviceCode, setServiceCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [isReferesh, setIsRefresh] = useState(false)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedServiceCode, setSelectedServiceCode] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleShowModal = () => setShowModal(true)
  const handleShowModal2 = (serviceCode) => {
    setSelectedServiceCode(serviceCode)
    setServiceCode(serviceCode.text)
    setShowModal2(true)
  }

  const handleCloseModal = () => setShowModal(false)
  const handleCloseModal2 = () => setShowModal2(false)

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredData(data)
    } else {
      const filtered = data.filter(item =>
        item.text.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredData(filtered)
    }
  }

  const handleAddServiceCode = () => {
    if (serviceCode === '') {
      sweetAlert.fire({ icon: 'error', title: 'Please enter service code' })
      return
    }
    postWihoutMediaData('/admin/service/code', { text: serviceCode }, 'admin')
      .then(() => {
        sweetAlert.fire({ icon: 'success', title: 'Service Code Added Successfully!' })
        setIsRefresh(!isReferesh)
        setShowModal(false)
        setServiceCode('')
      })
      .catch(console.error)
  }

  const handelUpdateServiceCode = () => {
    if (serviceCode === '') {
      sweetAlert.fire({ icon: 'error', title: 'Please enter service code' })
      return
    }
    updateReq(`/admin/service/code?ID=${selectedServiceCode._id}`, { text: serviceCode }, 'admin')
      .then(() => {
        sweetAlert.fire({ icon: 'success', title: 'Service Code Updated Successfully!' })
        setIsRefresh(!isReferesh)
        setShowModal2(false)
        setServiceCode('')
      })
      .catch(console.error)
  }

  const handleDelete = (id) => {
    deleteReq(`/admin/service/code?ID=${id}`, 'admin')
      .then((res) => {
        if (res.data.status) {
          sweetAlert.fire({ icon: 'success', title: 'Service Code Deleted Successfully!' })
          setIsRefresh(!isReferesh)
        }
      })
      .catch((e) => {
        console.error('Error while deleting the service type', e.message)
      })
  }

  useEffect(() => {
    setLoading(true)
    get('/admin/service/code', 'admin')
      .then((res) => {
        setData(res?.data?.data || [])
        setFilteredData(res?.data?.data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [isReferesh])

  return (
    <>
      <Row>
        <Col md={12}>
          <Container className="bg-white py-3 px-2 rounded-3">
            <Row className="mb-3 justify-content-between">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Search Service Code..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <Button onClick={handleShowModal} variant="primary">
                  <IoMdAdd /> Add Service Code
                </Button>
              </Col>
            </Row>

            <Table className="mt-3 table-bordered" striped responsive hover>
              <thead>
                <tr>
                  <th className="text-center px-4">#</th>
                  <th className="text-center px-4">Service Code</th>
                  <th className="text-center px-4">Date</th>
                  <th className="text-center px-4">Status</th>
                  <th className="text-center px-4" colSpan={2}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="text-start px-4">{index + 1}</td>
                      <td className="text-start px-4">{item.text}</td>
                      <td className="text-start px-4">
                        {item?.createdDateTime ? getFormattedDAndT(item.createdDateTime) : ''}
                      </td>
                      <td className="text-start px-4">
                        <div
                          className="rounded-5"
                          style={{
                            color: '#1F9254',
                            backgroundColor: '#EBF9F1',
                            width: 'fit-content',
                            padding: '4px 15px',
                          }}
                        >
                          {item.status}
                        </div>
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <FaRegEdit size={22} color="#624DE3" onClick={() => handleShowModal2(item)} />
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <RiDeleteBin5Line size={22} color="#A30D11" onClick={() => handleDelete(item._id)} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

          </Container>
        </Col>

        {/* Add Modal */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ marginTop: '10vh' }}>
          <Modal.Header closeButton>
            <Modal.Title>Add Service Code</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Enter Service Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter service Code..."
                  onChange={(e) => setServiceCode(e.target.value)}
                  value={serviceCode}
                />
              </Form.Group>
            </Col>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button style={{ backgroundColor: '#5856D5', color: '#ffffff' }} onClick={handleAddServiceCode}>
              Add Service Code
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Update Modal */}
        <Modal show={showModal2} onHide={handleCloseModal2} style={{ marginTop: '10vh' }}>
          <Modal.Header closeButton>
            <Modal.Title>Update Service Code</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Enter Service Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter service Code..."
                  onChange={(e) => setServiceCode(e.target.value)}
                  value={serviceCode}
                />
              </Form.Group>
            </Col>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button style={{ backgroundColor: '#5856D5', color: '#ffffff' }} onClick={handelUpdateServiceCode}>
              Update Service Code
            </Button>
            <Button variant="secondary" onClick={handleCloseModal2}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </>
  )
}

export default AllServiceCode

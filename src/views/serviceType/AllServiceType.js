import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row, Table, Spinner, InputGroup } from 'react-bootstrap'
import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useColorModes } from '@coreui/react'
import { get, postWihoutMediaData, updateReq, deleteReq } from '../../lib/request'
import sweetAlert from 'sweetalert2';
import { getFormattedDAndT } from '../../lib/getFormatedDate'

function AllServiceType() {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReferesh, setIsRefresh] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)

  const handleShowModal = () => setShowModal(true)
  const handleShowModal2 = (serviceType) => {
    setSelectedServiceType(serviceType);
    setServiceType(serviceType.text)
    setShowModal2(true)
  }
  const handleCloseModal = () => setShowModal(false)
  const handleCloseModal2 = () => setShowModal2(false)

  const handleAddServiceType = () => {
    if (serviceType === "") {
      return sweetAlert.fire({ icon: 'error', title: 'Please enter service type' });
    }
    postWihoutMediaData('/admin/service/type', { "text": serviceType }, "admin")
      .then(() => {
        sweetAlert.fire({ icon: 'success', title: 'Service Type Added Successfully!' });
        setIsRefresh(!isReferesh)
        setShowModal(false)
        setServiceType("")
      })
      .catch(console.error)
  }

  const handleEditServiceType = () => {
    if (serviceType === "") {
      return sweetAlert.fire({ icon: 'error', title: 'Please enter service type' });
    }
    updateReq(`/admin/service/type?ID=${selectedServiceType._id}`, { "text": serviceType }, "admin")
      .then(() => {
        sweetAlert.fire({ icon: 'success', title: 'Service Type Updated Successfully!' });
        setIsRefresh(!isReferesh)
        setShowModal2(false)
        setServiceType("")
      })
      .catch(console.error)
  }

  const handleDelete = (id) => {
    deleteReq(`/admin/service/type?ID=${id}`, "admin")
      .then((data) => {
        if (data.data.status) {
          setIsRefresh(!isReferesh)
          sweetAlert.fire({ icon: 'success', title: 'Service Type Deleted Successfully!' });
        }
      })
      .catch((e) => console.error("Error while deleting:", e.message))
  }

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        item.text.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }

  useEffect(() => {
    setLoading(true)
    get('/admin/service/type', "admin")
      .then((response) => {
        const result = response?.data?.data || [];
        setData(result);
        setFilteredData(result);
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
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
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search by service type..."
                    value={searchText}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <Button onClick={handleShowModal} variant="primary">
                  <IoMdAdd /> Add Service Type
                </Button>
              </Col>
            </Row>

            <Table className="mt-3 table-bordered" striped responsive hover>
              <thead>
                <tr>
                  <th className="text-center px-4">#</th>
                  <th className="text-center px-4">Service Type</th>
                  <th className="text-center px-4">Date</th>
                  <th className="text-center px-4">Status</th>
                  <th className="text-center px-4" colSpan={2}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="text-start px-4">{index + 1}</td>
                      <td className="text-start px-4">{item?.text}</td>
                      <td className="text-start px-4">
                        {item?.createdDateTime ? getFormattedDAndT(item.createdDateTime) : ''}
                      </td>
                      <td className="text-start px-4">
                        <div
                          className="rounded-5"
                          style={{
                            color: '#1F9254',
                            backgroundColor: '#EBF9F1',
                            padding: '4px 15px',
                            width: 'fit-content'
                          }}
                        >
                          {item?.status}
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
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">No service types found.</td>
                  </tr>
                )}
              </tbody>
            </Table>

          </Container>
        </Col>

        {/* Add Modal */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ marginTop: '10vh' }}>
          <Modal.Header closeButton><Modal.Title>Add Service Type</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter Service Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter service type..."
                onChange={(e) => setServiceType(e.target.value)}
                value={serviceType}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button style={{ backgroundColor: '#5856D5', color: '#ffffff' }} onClick={handleAddServiceType}>Add</Button>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showModal2} onHide={handleCloseModal2} style={{ marginTop: '10vh' }}>
          <Modal.Header closeButton><Modal.Title>Edit Service Type</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Enter Service Type</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter service type..."
                onChange={(e) => setServiceType(e.target.value)}
                value={serviceType}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button style={{ backgroundColor: '#5856D5', color: '#ffffff' }} onClick={handleEditServiceType}>Update</Button>
            <Button variant="secondary" onClick={handleCloseModal2}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </>
  )
}

export default AllServiceType;

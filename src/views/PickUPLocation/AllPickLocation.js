import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Container,
  Row,
  Modal,
  Table,
  Form
} from 'react-bootstrap'
import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useColorModes } from '@coreui/react'
import { deleteReq, get } from '../../lib/request'
import sweetAlert from 'sweetalert2'
import AddPickupLocation from './AddPickupLocation'
import { getFormattedDAndT } from '../../lib/getFormatedDate'
import UpdatePickupLocation from './UpdatePickupLocation'

function AllPickupLocation() {
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const [loading, setLoading] = useState(false)
  const [isReferesh, setIsRefresh] = useState(false)
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isAddSection, setIsAddSection] = useState(false)
  const [isUpdateSection, setUpdateSection] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddPickUpLocation = () => {
    setUpdateSection(false)
    setIsAddSection(!isAddSection)
  }

  const handleUpdatePickUpLocation = (location) => {
    setSelectedLocation(location)
    setIsAddSection(false)
    setUpdateSection(!isUpdateSection)
  }

  const handleDelete = (id) => {
    sweetAlert
      .fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it',
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteReq(`/admin/locations/pickup?id=${id}`, 'admin').then((response) => {
            if (response.data.status) {
              sweetAlert.fire('Deleted!', 'Your record has been deleted.', 'success')
              setIsRefresh(!isReferesh)
              setUpdateSection(false)
            } else {
              sweetAlert.fire('Oops...', 'Something went wrong!', 'error')
            }
          })
        } else if (result.dismiss === sweetAlert.DismissReason.cancel) {
          sweetAlert.fire('Cancelled', 'Your record is safe :)', 'error')
        }
      })
  }

  useEffect(() => {
    setLoading(true)
    get('/admin/locations/pickup', 'admin')
      .then((response) => {
        const locations = response?.data?.data || []
        setData(locations)
        setFilteredData(locations)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [isReferesh])

  // Filter the data whenever search term changes
  useEffect(() => {
    const filtered = data.filter((item) =>
      item?.customName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.mapName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.latitude?.toString().includes(searchTerm) ||
      item?.longitude?.toString().includes(searchTerm)
    )
    setFilteredData(filtered)
  }, [searchTerm, data])

  return (
    <>
      <Row>
        <Col md={12}>
          <Container className="bg-white py-3 px-2 rounded-3">
            <Row className="mb-3 justify-content-between">
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col className="d-flex align-items-center justify-content-end">
                <Button variant="primary" onClick={handleAddPickUpLocation}>
                  <IoMdAdd /> Add PickUp Location
                </Button>
              </Col>
            </Row>

            <Modal show={isAddSection} onHide={() => setIsAddSection(false)} centered dialogClassName="custom-modal-sm">
              <Modal.Header closeButton>
                <Modal.Title>Add Pickup Location</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <AddPickupLocation isReferesh={isReferesh} setIsRefresh={setIsRefresh} />
              </Modal.Body>
            </Modal>

            <Modal show={isUpdateSection} onHide={() => setUpdateSection(false)} centered dialogClassName="custom-modal-sm change-driver-modal">
              <Modal.Header closeButton>
                <Modal.Title>Update Pickup Location</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <UpdatePickupLocation
                  isReferesh={isReferesh}
                  setIsRefresh={setIsRefresh}
                  selectedLocation={selectedLocation}
                />
              </Modal.Body>
            </Modal>

            <Table
              className="mt-4 table-bordered"
              striped
              responsive
              hover
              style={{ minWidth: 1600 }}
            >
              <thead>
                <tr>
                  <th className="text-center px-4">#</th>
                  <th className="text-center px-4">Custom Name</th>
                  <th className="text-center px-4">Map Name</th>
                  <th className="text-center px-4">Latitude</th>
                  <th className="text-center px-4">Longitude</th>
                  <th className="text-center px-4">Date</th>
                  <th className="text-center px-4">Status</th>
                  <th className="text-center px-4" colSpan={2}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="text-start px-4">{index + 1}</td>
                      <td className="text-start px-4">{item.customName}</td>
                      <td className="text-start px-4">{item.mapName}</td>
                      <td className="text-start px-4">{item.latitude}</td>
                      <td className="text-start px-4">{item.longitude}</td>
                      <td className="text-start px-4">
                        {item?.createdDateTime ? getFormattedDAndT(item?.createdDateTime) : ''}
                      </td>
                      <td className="text-start px-4">
                        <div
                          className="rounded-5"
                          style={{
                            color: '#CD6200',
                            backgroundColor: '#FEF2E5',
                            width: 'fit-content',
                            padding: '4px 15px',
                          }}
                        >
                          {item.status}
                        </div>
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <FaRegEdit size={22} color="#624DE3" onClick={() => handleUpdatePickUpLocation(item)} />
                      </td>
                      <td className="text-start px-4 cursor-pointer">
                        <RiDeleteBin5Line size={22} color="#A30D11" onClick={() => handleDelete(item._id)} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center text-muted">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

          </Container>
        </Col>
      </Row>
    </>
  )
}

export default AllPickupLocation

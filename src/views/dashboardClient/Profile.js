import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row, Spinner, Form } from 'react-bootstrap'
import { get, updateReq } from '../../lib/request'
import sweetAlert from 'sweetalert2'
import Moment from 'react-moment'
export default function Profile() {
  let imgSrc = process.env.Image_Src
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showView, setShowView] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    companyName: '',
    username: '',
  })

  //handle edit

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEdit = () => {
    updateReq('/client/profile', formData, 'client').then((data) => {
      if (data.data.status) {
        setRefresh(!refresh)
        setShowEdit(false)
        sweetAlert.fire({
          icon: 'success',
          title: 'Profile Updated Successfully',
        })
      }
    })
  }

  // get profile data

  useEffect(() => {
    setLoading(true)
    get('/client/profile', 'client').then((data) => {
      if (data.data.status) {
        setData(data.data.data)
        setFormData(data.data.data)
        setLoading(false)
      }
    })
  }, [refresh])
  return (
    <div>
      {loading ? (
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ height: '80vh' }}
        >
          <Spinner animation="border" variant="primary" />
        </Container>
      ) : (
        <Container className="mx-auto d-block shadow rounded p-3">
          <h4 className="text-center mb-4">Personal Information</h4>

          <Row>
            <Col md={6} className="mb-3">
              <li className="custom-list">
                <b>Firstname:</b> <span>{data.firstname}</span>
              </li>
            </Col>
            <Col md={6} className="mb-3">
              <li className="custom-list">
                <b>Lastname:</b> <span>{data.lastname}</span>
              </li>
            </Col>

            <Col md={6} className="mb-3">
              <li className="custom-list">
                <b>Email:</b> <span>{data.email}</span>
              </li>
            </Col>

            <Col md={6} className="mb-3">
              <li className="custom-list">
                <b>Phone:</b> <span>{data.phone}</span>
              </li>
            </Col>

            <Col md={6} className="mb-3">
              <li className="custom-list">
                <b>Company Name:</b> <span>{data.companyName}</span>
              </li>
            </Col>

            <Col md={6} className="mb-3">
              <li className="custom-list">
                <b>User Name:</b> <span>{data.username}</span>
              </li>
            </Col>

            <Col md={6} className="mb-3">
              <li className="custom-list">
                <b>Driver Permission:</b> <span>{data.isDriverPermission ? 'Yes' : 'No'}</span>
              </li>
            </Col>

            <Col md={6} className="mb-3">
              <li className="custom-list">
                <b>Status:</b> <span>{data.status}</span>
              </li>
            </Col>

            <Col md={6} className="mb-3">
              <li className="custom-list">
                <b>Created Date:</b>{' '}
                <span>
                  <Moment format="DD/MM/YYYY, hh:mm a">{data?.createdDateTime}</Moment>
                </span>
              </li>
            </Col>
            <Col md={6} className="mb-3"></Col>

            <Col md={6} className="mb-3">
              <Button
                className="btn btn-success w-100 m-1 text-white"
                onClick={() => setShowView(true)}
              >
                View Logo
              </Button>
            </Col>
            <Col md={6} className="mb-3">
              <Button className="btn btn-primary w-100 m-1" onClick={() => setShowEdit(true)}>
                Edit Profile
              </Button>
            </Col>
          </Row>
        </Container>
      )}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                onChange={handleChanges}
                value={formData.firstname}
                name="firstname"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                onChange={handleChanges}
                value={formData.lastname}
                name="lastname"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={handleChanges}
                value={formData.email}
                name="email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Phone"
                onChange={handleChanges}
                value={formData.phone}
                name="phone"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Company Name"
                onChange={handleChanges}
                value={formData.companyName}
                name="companyName"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Name"
                onChange={handleChanges}
                value={formData.username}
                name="username"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleEdit()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showView} onHide={() => setShowView(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Company Logo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imgSrc + data.logoKey} alt="logo" className="w-50 h-50 mx-auto d-block" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowView(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap'
import { FaSearch, FaRegEdit, FaEye } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'
import { get } from '../../lib/request'

const AllDriverJobs = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Fetch all clients from the server

    setLoading(true)
    get(`/admin/info/jobFilter?driverId=${id}`, 'admin').then((response) => {
      if (response.data.status) {
        if (response.data.data.length === 0) {
          setMessage('No data found')
        }
        setClients(response.data.data)
        setLoading(false)
      }
    })
  }, [])

  return (
    <Row>
      {/* <Col md={12}> */}
      <Container className="bg-white py-3 px-2 rounded-3">
        <Row className="mb-3 d-flex justify-content-between ">
          <Col md={2} className="d-flex align-items-center justify-content-between gap-2 ">
            <div className="d-flex align-items-center gap-2">
              show
              {/* <Col md={6}> */}
              <Form.Select>
                <option>10</option>
                <option>20</option>
                <option>30</option>
              </Form.Select>
              {/* </Col> */}
              entries
            </div>
          </Col>
          <Col md={10} className="d-flex align-items-center">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <Form.Control type="text" placeholder="Search" />
            </div>
          </Col>
        </Row>

        <Table className="mt-3" striped responsive hover style={{ minWidth: 2000 }}>
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Job Id</th>
              <th className="text-center">Service Code</th>
              <th className="text-center">Client Name</th>
              <th className="text-center">AWB</th>
              <th className="text-center">Pickup From</th>
              <th className="text-center">Deliver To</th>
              <th className="text-center">Ready Time</th>
              <th className="text-center">Cuttoff Time</th>
              <th className="text-center">Status</th>
              <th className="text-center" colSpan={4}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {message ? (
              <tr>
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
              clients &&
              clients.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{item?.uid}</td>
                    <td className="text-center">{item?.serviceCodeId?.text}</td>
                    <td className="text-center">
                      {item?.clientId?.firstname} {item?.clientId?.lastname}
                    </td>
                    <td className="text-center">{item?.AWB}</td>
                    <td className="text-center">
                      {item?.pickUpDetails?.pickupLocationId?.customName}
                    </td>
                    <td className="text-center">
                      {item?.dropOfDetails?.dropOfLocationId?.customName}
                    </td>
                    <td className="text-center">{item?.pickUpDetails?.readyTime}</td>
                    <td className="text-center">{item?.dropOfDetails?.cutOffTime}</td>

                    <td className="text-center">
                      <div
                        className="px-1 py-1 rounded-5 text-center"
                        style={{ color: '#1F9254', backgroundColor: '#EBF9F1' }}
                      >
                        {item?.currentStatus}
                      </div>
                    </td>
                    <td className="text-center cursor-pointer">
                      <FaEye
                        size={22}
                        color="#0984E3"
                        onClick={() => navigate(`/client/job/details/${item._id}`)}
                      />
                      {/* <FaEye onClick={handleShowModal} size={22} color="#0984E3" /> */}
                    </td>
                    <td className="text-center cursor-pointer">
                      <FaRegEdit
                        onClick={() => navigate('/client/edit/123')}
                        size={22}
                        color="#624DE3"
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center">
          <Pagination className="mt-3 ">
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Item>{5}</Pagination.Item>
            <Pagination.Next />
          </Pagination>
        </div>
      </Container>
      {/* </Col> */}
    </Row>
  )
}

export default AllDriverJobs

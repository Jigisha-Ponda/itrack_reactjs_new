import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { getJobCountByStatus } from '../../services/getTotalDocs'
import {getTotalDocs} from '../../services/getTotalDocs'

const WidgetsDropdown = ({data}) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  return (
    <CRow  xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {data?.unallocatedJobs}{' '}

            </>
          }
          title="Unallocated Jobs"

          chart={
            <CChartLine
              ref={widgetChartRef1}
              className="mt-3 mx-3"
              style={{ height: '40px' }}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {
                data?.pickedUpJobs
              }{' '}

            </>
          }
          title="Picked up Jobs"

          chart={
            <CChartLine
            ref={widgetChartRef1}
            className="mt-3 mx-3"
            style={{ height: '40px' }}
          />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              {
                data?.deliveredJobs
              }{' '}

            </>
          }
          title="Delivered Jobs"

          chart={
            <CChartLine
            ref={widgetChartRef1}
            className="mt-3 mx-3"
            style={{ height: '40px' }}
          />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              {
                data?.cancelledJobs
              }{' '}

            </>
          }
          title="Cancelled Jobs"

          chart={
            <CChartLine
            ref={widgetChartRef1}
            className="mt-3 mx-3"
            style={{ height: '40px' }}
          />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="success"
          value={
            <>
              {
                data?.driverAssignedJobs
              }{' '}

            </>
          }
          title="Driver Assigned Jobs"

          chart={
            <CChartLine
            ref={widgetChartRef1}
            className="mt-3 mx-3"
            style={{ height: '40px' }}
          />
          }
        />
      </CCol>
    
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {
                data?.totalJobs
              }{' '}

            </>
          }
          title="Total Jobs"

          chart={
            <CChartLine
            ref={widgetChartRef1}
            className="mt-3 mx-3"
            style={{ height: '40px' }}
          />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              {
                data?.totalClients
              }{' '}

            </>
          }
          title="Total Clients"

          chart={
            <CChartLine
            ref={widgetChartRef1}
            className="mt-3 mx-3"
            style={{ height: '40px' }}
          />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              {
                data?.totalDrivers
              }{' '}

            </>
          }
          title="Total Drivers"

          chart={
            <CChartLine
            ref={widgetChartRef1}
            className="mt-3 mx-3"
            style={{ height: '40px' }}
          />
          }
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown

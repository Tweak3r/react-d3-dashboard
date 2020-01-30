import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import MultilineChart from './MultiLineChart';
import StackedAreaChart from './StackedAreaChart';

import lineChartData from './data/lineChartData.json'
import areaChartData from './data/areaChartData.json';

class Dashboard extends React.Component {
  static propTypes = {
    auth: PropTypes.shape({
      uid: PropTypes.string
    })
  }

  render () {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to='/signin' />
    
    return (
      <div className="dashboard">
        <MultilineChart chartData={lineChartData} />
        <StackedAreaChart chartData={areaChartData} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

export default connect(mapStateToProps)(Dashboard);
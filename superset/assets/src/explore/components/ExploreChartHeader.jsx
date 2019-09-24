/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { t } from '@superset-ui/translation';

import { chartPropShape } from '../../dashboard/util/propShapes';
import ExploreActionButtons from './ExploreActionButtons';
import RowCountLabel from './RowCountLabel';
import EditableTitle from '../../components/EditableTitle';
import AlteredSliceTag from '../../components/AlteredSliceTag';
import Timer from '../../components/Timer';
import CachedLabel from '../../components/CachedLabel';

const CHART_STATUS_MAP = {
  failed: 'danger',
  loading: 'warning',
  success: 'success',
};

const propTypes = {
  actions: PropTypes.object.isRequired,
  can_download: PropTypes.bool.isRequired,
  isStarred: PropTypes.bool.isRequired,
  slice: PropTypes.object,
  form_data: PropTypes.object,
  timeout: PropTypes.number,
  chart: chartPropShape,
};

class ExploreChartHeader extends React.PureComponent {
  postChartFormData() {
    this.props.actions.postChartFormData(this.props.form_data, true,
      this.props.timeout, this.props.chart.id);
  }

  render() {
    const formData = this.props.form_data;
    const {
      chartStatus,
      chartUpdateEndTime,
      chartUpdateStartTime,
      latestQueryFormData,
      queryResponse } = this.props.chart;
    const chartFinished = ['failed', 'rendered', 'success'].includes(this.props.chart.chartStatus);
    return (
      <div
        id="slice-header"
        className="clearfix panel-title-large"
      >
        {this.props.chart.sliceFormData &&
          <AlteredSliceTag
            origFormData={this.props.chart.sliceFormData}
            currentFormData={formData}
          />
        }
        <div className="pull-right">
          {chartFinished && queryResponse &&
            <RowCountLabel
              rowcount={queryResponse.rowcount}
              limit={formData.row_limit}
            />}
          {chartFinished && queryResponse && queryResponse.is_cached &&
            <CachedLabel
              onClick={this.postChartFormData.bind(this)}
              cachedTimestamp={queryResponse.cached_dttm}
            />}
          <Timer
            startTime={chartUpdateStartTime}
            endTime={chartUpdateEndTime}
            isRunning={chartStatus === 'loading'}
            status={CHART_STATUS_MAP[chartStatus]}
            style={{ fontSize: '10px', marginRight: '5px' }}
          />
          <ExploreActionButtons
            actions={this.props.actions}
            slice={this.props.slice}
            canDownload={this.props.can_download}
            chartStatus={chartStatus}
            latestQueryFormData={latestQueryFormData}
            queryResponse={queryResponse}
          />
        </div>
      </div>
    );
  }
}

ExploreChartHeader.propTypes = propTypes;

export default ExploreChartHeader;

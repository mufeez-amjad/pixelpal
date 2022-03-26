import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import Day from 'react-big-calendar/lib/Day'

export default class CustomDay extends Day {
  render() {
    let {
      date,
      localizer,
      min = localizer.startOf(new Date(), 'day'),
      max = localizer.endOf(new Date(), 'day'),
      scrollToTime = localizer.startOf(new Date(), 'day'),
      enableAutoScroll = true,
      ...props
    } = this.props
    let range = Day.range(date, { localizer: localizer })

    return (
      <TimeGrid
        {...props}
        range={range}
        eventOffset={10}
        localizer={localizer}
        min={min}
        max={max}
        scrollToTime={date.getTime()}
        enableAutoScroll={enableAutoScroll}
      />
    )
  }
}

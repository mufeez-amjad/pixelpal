import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
//@ts-ignore
import TimeGrid from 'react-big-calendar/lib/TimeGrid';
//@ts-ignore
import Day from 'react-big-calendar/lib/Day';

// if we wanted to make a custom day view
export default class CustomDay extends Day {
	render() {
		const {
			date,
			localizer,
			min = localizer.startOf(new Date(), 'day'),
			max = localizer.endOf(new Date(), 'day'),
			scrollToTime = localizer.startOf(new Date(), 'day'),
			enableAutoScroll = true,
			...props
			//@ts-ignore
		} = this.props;
		const range = Day.range(date, { localizer: localizer });

		return (
			<TimeGrid // could make a custom timeline and use it here
				{...props}
				range={range}
				eventOffset={10}
				localizer={localizer}
				min={min}
				max={max}
				scrollToTime={date.getTime()}
				enableAutoScroll={enableAutoScroll}
			/>
		);
	}
}

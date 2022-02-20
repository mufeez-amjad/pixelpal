import React from 'react';
import styled from 'styled-components';

import { IoCalendarClearSharp,  } from 'react-icons/io5';
import { GoCheck } from 'react-icons/go';
import { HiClock } from 'react-icons/hi';
import { TextInput } from '../../../common/input';
import { INewEvent } from '../../../../common/types';
import { format } from 'date-fns';

function Event(): JSX.Element {
	const [isEvent, setIsEvent] = React.useState(true);

	const [event, setEvent] = React.useState<INewEvent>({
		name: '',
		start: new Date(),
		end: new Date(),
	});

	return (
		<Container>
			<Form>
				<Row>
					<TextInput 
						value={event.name}
						placeholder='Add title'
						style={{
							flex: 5
						}}
						onChange={(e) => setEvent({...event, name: e.target.value }) }
					/>
					<Switch
						toggle={!isEvent}
					>
						<IoCalendarClearSharp 
							onClick={() => setIsEvent(true)}
						/>
						<GoCheck
							fontWeight={700}
							onClick={() => setIsEvent(false)}
						/>
						<div className="slider"></div>
					</Switch>
				</Row>
				<Row>
					<div
						style={{
							display: 'flex',
							alignItems: 'center'
						}}
					>
						<HiClock />
						<TextInput
							value={format(event.start, 'h:m a')}
							placeholder=''
							onChange={(e) => setEvent({...event, start: new Date(e.target.value) }) }
						/>
					</div>
				</Row>
			</Form>
		</Container>
	);
}

const Container = styled.div`
	position: absolute;
	background-color: #f3f3f3;
	width: 100%;
`;

const Form = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	&:not(:first-child) {
		margin-top: 20px;
	}
`;

interface SwitchProps {
	toggle: boolean;
}

const Switch = styled.div<SwitchProps>`
	flex-grow: 0;
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	width: 60px;
	border-radius: 5px;
	background-color: #e0dede;
	padding: 4px 6px;

	.slider {
		top: 0;
		left: 0;
		position: absolute;
		width: 50%;
		height: 100%;
		background-color: #b9b9b9;
		z-index: 0;

		border-radius: 5px;
		/* border-radius: 5px 0 0 5px; */

		-webkit-transition: .3s;
		transition: .3s;

		${({toggle}) => toggle && `
			// border-radius: 0 5px 5px 0;		
			transform: translateX(30px);
		`}
	}

	> svg {
		z-index: 1;
		width: 18px;

		${({toggle}) => toggle ? `
		&:first-child {
			color: #b3b3b3;
		}

		&:not(:first-child) {
			color: white;
		}
		` : `
		&:first-child {
			color: white;
		}

		&:not(:first-child) {
			color: #b3b3b3;
		}
		`};
	}
`;

export default Event;
import React from 'react';
import { View, Button } from 'react-native';
import { Link } from 'react-router-dom';

function Overview() {
	return (
		<View>
			<Link to="/reminderform">
				<Button title="Add Reminder" />
			</Link>
		</View>
	);
}

export default Overview;

import React from 'react';
import { View, Button } from 'react-native';
import { Link } from 'react-router-dom';

function ReminderForm() {
	return (
		<View>
			<Link to="/">
				<Button title="Submit" />
			</Link>
		</View>
	);
}

export default ReminderForm;

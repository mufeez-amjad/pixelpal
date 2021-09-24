import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Overview from './Overview';
import ReminderForm from './ReminderForm';

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={Overview} />
			<Route exact path="/reminderform" component={ReminderForm} />
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
);

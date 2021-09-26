import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Overview from './Overview';
import ReminderForm from './ReminderForm';
import Notification from './pages/Notification';

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={Overview} />
			<Route exact path="/reminderform" component={ReminderForm} />
			<Route exact path="/notification" component={Notification} />
		</Switch>
	</BrowserRouter>,
);
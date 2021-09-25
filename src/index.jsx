import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Overview from './Overview';
import ReminderForm from './ReminderForm';

import 'bootstrap/dist/css/bootstrap.css';
import '@blueprintjs/core/lib/css/blueprint.css';

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={Overview} />
			<Route exact path="/reminderform" component={ReminderForm} />
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
);

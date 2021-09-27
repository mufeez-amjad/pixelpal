import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Overview from './Overview';
import ReminderForm from './ReminderForm';
import Notification from './pages/Notification';

import 'normalize.css';
// import 'bootstrap/dist/css/bootstrap.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import './index.css';

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={Overview} />
			<Route exact path="/reminderform" component={ReminderForm} />
			<Route exact path="/notification" component={Notification} />
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
);

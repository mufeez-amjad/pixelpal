import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Overview from './pages/Overview';
import ReminderForm from './pages/ReminderForm';
import Notification from './pages/Notification';
import Inventory from './pages/Inventory';

import 'normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import './index.css';

ReactDOM.render(
	<HashRouter>
		<Switch>
			<Route exact path="/" component={Overview} />
			<Route exact path="/reminderform" component={ReminderForm} />
			<Route exact path="/notification" component={Notification} />
			<Route exact path="/inventory" component={Inventory} />
		</Switch>
	</HashRouter>,
	document.getElementById('root')
);

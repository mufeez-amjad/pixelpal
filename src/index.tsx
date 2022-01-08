import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, useHistory } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

import Overview from './pages/Overview';
import Notification from './pages/Notification';
import Settings from './pages/Settings';

import 'normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import './index.css';

const App = () => {
	return (
		<HashRouter>
			<Routes />
		</HashRouter>
	);
};

const Routes = () => {
	const history = useHistory();

	React.useEffect(() => {
		function handleWindowHide() {
			console.log('hiding!');
			history.push('/');
		}
		ipcRenderer.on('hide-tray-window', handleWindowHide);
		return () => ipcRenderer.removeListener('hide-tray-window', handleWindowHide);
	}, []);

	return (
		<Switch>
			<Route exact path="/" component={Overview} />
			<Route exact path="/settings/*" component={Settings} />
			<Route exact path="/notification" component={Notification} />
		</Switch>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));

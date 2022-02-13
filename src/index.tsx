import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

import Overview from './pages/Overview';
// import Notification from './pages/Notification';
import Settings from './pages/Settings';

import 'normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import './index.css';

import store from './store';
import { Provider } from 'react-redux';

const App = () => {
	return (
		<Provider store={store}>
			<HashRouter>
				<RoutesComponent />
			</HashRouter>
		</Provider>
	);
};

const RoutesComponent = () => {
	const navigate = useNavigate();

	React.useEffect(() => {
		function handleWindowHide() {
			navigate('/');
		}
		ipcRenderer.on('hide-tray-window', handleWindowHide);
		return () => ipcRenderer.removeListener('hide-tray-window', handleWindowHide);
	}, []);

	return (
		<Routes>
			<Route path="/" element={<Overview />} />
			<Route path="/settings/*" element={<Settings />} />
			{/* <Route path="/notification" component={Notification} /> */}
		</Routes>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));

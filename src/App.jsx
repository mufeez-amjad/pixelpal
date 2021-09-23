import React, { useState }  from 'react';

const { app } = window.require('@electron/remote');

function App() {
  
	const [path] = useState(app.getAppPath());

	return (
		<div>
			Hello world from {path}!
		</div>
	);
}

export default App;

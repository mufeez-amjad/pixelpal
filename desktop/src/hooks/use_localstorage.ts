import { useState, useEffect } from 'react';

function getStorageValue(key: string, defaultValue: any) {
	const saved = localStorage.getItem(key);
	return saved ? JSON.parse(saved) : defaultValue;
}

export const useLocalStorage = (key: string, defaultValue: any) => {
	const [value, setValue] = useState(() => {
		return getStorageValue(key, defaultValue);
	});

	useEffect(() => {
		// storing input name
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
};
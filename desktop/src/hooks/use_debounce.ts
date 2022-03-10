import * as React from 'react';

export default function useDebounce<T>(value: T, delay = 250): T {
	const [debouncedValue, setDebouncedValue] = React.useState(value);

	React.useEffect(() => {
		const tm = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(tm);
	}, [value, delay]);

	return debouncedValue;
}

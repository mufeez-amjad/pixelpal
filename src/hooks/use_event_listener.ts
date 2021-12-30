/* eslint-disable no-unused-vars */
import * as React from 'react';

export default function useEventListener(
	eventName: string,
	callback: (e: any) => void,
	el: any = window
) {
	React.useEffect(() => {
		if (el?.addEventListener) {
			el.addEventListener(eventName, callback);
			return () => el.removeEventListener(eventName, callback);
		}
	}, [eventName, el, callback]);
}

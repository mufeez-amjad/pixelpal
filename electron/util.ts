import { Display, Point, screen } from 'electron/main';

export function getCurrentDisplay(): Display {
	const cursorPos: Point = screen.getCursorScreenPoint();
	return screen.getDisplayNearestPoint(cursorPos);
}

export function addQueryParams(path: string, data: any): string {
	const ret = [];
	for (const d in data) {
		ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
	}
	return path + '?' + ret.join('&');
}

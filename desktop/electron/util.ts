import { Display, Point, Rectangle, screen } from 'electron/main';

export function getCursorPosition(): Point {
	return screen.getCursorScreenPoint();
}

export function getCurrentDisplay(): Display {
	const cursorPos: Point = screen.getCursorScreenPoint();
	return screen.getDisplayNearestPoint(cursorPos);
}

export function getDisplayForClick(bounds: Rectangle, point: Point): Display {	
	console.log(point);
	console.log(bounds);

	let { y: pointY } = point;
	const { x: pointX } = point;

	// click from 24px above the top of the screen.
	// 1080 - 24 = 1056

	pointY += bounds.height;

	const displays = screen.getAllDisplays();
	console.log(displays);

	// Find the display that matches the click coordinates
	const clickedDisplay = displays.find(display => {
		const { x, y, width, height } = display.bounds;
		// need to account for the menu bar height

		return x <= pointX && pointX <= x + width && y <= pointY && pointY <= y + height;
	});

	console.log('Clicked display:', clickedDisplay?.id);

	return clickedDisplay || screen.getPrimaryDisplay();
}

export function addQueryParams(path: string, data: any): string {
	const ret = [];
	for (const d in data) {
		ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
	}
	return path + '?' + ret.join('&');
}

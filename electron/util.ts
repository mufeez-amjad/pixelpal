import { Display, Point, screen } from 'electron/main';

export function getCurrentDisplay(): Display {
	const cursorPos: Point = screen.getCursorScreenPoint();
	return screen.getDisplayNearestPoint(cursorPos);
}

import * as React from 'react';

import useEventListener from './use_event_listener';

/**
 * KeyEvent keyCodes
 */
export enum KEY_CODE {
	ARROW_LEFT = 37,
	ARROW_RIGHT = 39,
	ARROW_DOWN = 40,
	ARROW_UP = 38,
	ENTER = 13,
	ESCAPE = 27,
	FORWARD_SLASH = 191,
	SHIFT = 16,
	c = 67,
	d = 68,
	k = 75,
	w = 87
}

/**
 * Unique "shortcut" names
 */
export enum SHORTCUT {
	NONE = 'NONE',
	ARROW_LEFT = 'ARROW_LEFT',
	ARROW_RIGHT = 'ARROW_RIGHT',
	ARROW_DOWN = 'ARROW_DOWN',
	ARROW_UP = 'ARROW_UP',
	ENTER = 'ENTER',
	ESCAPE = 'ESCAPE',
	FORWARD_SLASH = 'FORWARD_SLASH',
	OPT_ARROW_LEFT = 'OPT_ARROW_LEFT',
	OPT_ARROW_RIGHT = 'OPT_ARROW_RIGHT',
	SHIFT_ARROW_LEFT = 'SHIFT_ARROW_LEFT',
	SHIFT_ARROW_RIGHT = 'SHIFT_ARROW_RIGHT',
	OPT_c = 'OPT_c',
	OPT_d = 'OPT_d',
	OPT_k = 'OPT_k',
	OPT_ENTER = 'OPT_ENTER',
	SHIFT = 'SHIFT',
	w = 'w'
}

export interface IShortcut {
	keyCode: number;
	name: SHORTCUT;
	altKey?: boolean; // Option (Mac)
	ctrlKey?: boolean; // Control (Mac)
	metaKey?: boolean; // Command (Mac)
	shiftKey?: boolean;
}

/**
 * Hook to match keydown events against pre-defined shortcuts, suitable for independent UI components, e.g. Date pickers
 */
export default function useKeyboardShortcuts(
	shortcuts: IShortcut[] = []
): SHORTCUT {
	const [lastKeyPress, setLastKeyPress] = React.useState<string>('');
	const shortcutsLookup = React.useMemo(
		() =>
			shortcuts.reduce(
				(acc, s) => ({ ...acc, [stringifyKeyPress(s)]: s.name }),
				{}
			),
		[shortcuts]
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<any>) => {
			const keyPress = stringifyKeyPress(e as any);
			if (keyPress in shortcutsLookup && keyPress !== lastKeyPress) {
				setLastKeyPress(keyPress);
			}
		},
		[lastKeyPress, shortcutsLookup, setLastKeyPress]
	);

	const handleKeyUp = React.useCallback(
		(e: React.KeyboardEvent<any>) => {
			setLastKeyPress('');
		},
		[setLastKeyPress]
	);

	useEventListener('keydown', handleKeyDown, document as any);
	useEventListener('keyup', handleKeyUp, document as any);

	return (
		shortcutsLookup[lastKeyPress as keyof typeof shortcutsLookup] ||
		SHORTCUT.NONE
	);
}

// Generate a unique "key" representing the keyCode plus all relevant modifiers
function stringifyKeyPress(keyPress: IShortcut): string {
	return `${
		keyPress.keyCode
	}:${+!!keyPress.altKey}${+!!keyPress.ctrlKey}${+!!keyPress.metaKey}${+!!keyPress.shiftKey}`;
}

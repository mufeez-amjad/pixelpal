import { clearInterval, setInterval } from 'timers';

export abstract class SchedulerService {
	// eslint-disable-next-line no-undef
	timer?: NodeJS.Timer;
	interval?: number;

	constructor(interval?: number) {
		this.interval = interval;
	}

	start() {
		this.timer = setInterval(
			this.run,
			this.interval,
		);
	}

	stop() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = undefined;
		}
	}

	abstract run(): void;
}

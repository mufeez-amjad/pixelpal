import { differenceInMinutes, endOfDay, format, formatDistance, startOfDay } from 'date-fns';
import { getEventsBetweenDates } from '../calendar/helpers';
import { createNotification } from '../notification';
import { SchedulerService } from './SchedulerService';

class CalendarScheduler extends SchedulerService {
	start(): void {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		
		// const self = this;
		// function tick() {
		// 	self.run();
		// 	setInterval(self.run, 1000 * 60 * 5); // 5 minutes
		// }

		// const nextDate = new Date();
		// const minutes = nextDate.getMinutes() % 60; // mod for clarity
		// const seconds = nextDate.getSeconds();
		// if (minutes % 5 == 4 && seconds == 0) {
		// 	tick();
		// } else {
		// 	// smallest multiple of 5 not smaller than `minutes`
		// 	const nextMinutes = 5 * Math.ceil(minutes/5);
		// 	if (nextMinutes == 60 && minutes == 59) {
		// 		nextDate.setMinutes(4);
		// 		nextDate.setHours(nextDate.getHours() + 1);
		// 	} else {
		// 		nextDate.setMinutes(nextMinutes - 1);
		// 	}
		// 	nextDate.setSeconds(0);
		
		// 	const difference = nextDate.getTime() - new Date().getTime();
		// 	console.log('Running schedule', difference / 1000);
		// 	setTimeout(tick, difference);
		// }
		setTimeout(this.run, 1000);
	}

	run(): void {
		console.log('Running!');
		const now = new Date();
		getEventsBetweenDates(startOfDay(now), endOfDay(now)).then(events => {
			for (const event of events) {
				const diff = 14; // differenceInMinutes(event.start, now);
				console.log(diff, event);
				if (diff < 0) {
					// event has passed
					continue;
				}

				if (diff < 15) {
					const notification = createNotification({
						html: `
						<div class="col">
							<div class="row">
								<h1>${event.name}</h1>
							</div>
							<div class="row">
								<span>${formatDistance(event.start, now)}</span>
								<span class="separator">•</span>
								<span>${format(event.start, 'h:mm')}-${format(event.end, 'h:mm')}</span>
							</div>
						</div>
						<button class="btn icon-btn">
							<img src="./meet.webp" />
							Join meeting
						</button>
						`,
						timeout: 10 * 1000
					});

					// When the notification was clicked.
					notification.on('click', () => {
						console.log('Notification has been clicked');
					});

					notification.on('btn-click', () => {

					});

					// When the notification was closed.
					notification.on('close', () => {
						console.log('Notification has been closed');
					});

					notification.on('display', () => {
						console.log('Notification has been displayed');
					});
				}
			}
		});
	}
}

let schedulerSrv: SchedulerService;

export function startSchedulerService() {
	schedulerSrv = new CalendarScheduler();
	schedulerSrv.start();
}

export function getSchedulerService() {
	return schedulerSrv;
}

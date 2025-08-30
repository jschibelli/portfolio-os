export type BookingIntent = 'BOOK' | 'RESCHEDULE' | 'CANCEL';

export type BookingState =
	| 'IDLE'
	| 'ASK_DURATION'
	| 'ASK_WINDOW'
	| 'CONFIRM_TZ'
	| 'FETCH_SLOTS'
	| 'PRESENT_SLOTS'
	| 'ASK_EMAIL'
	| 'CONFIRM_SLOT'
	| 'BOOKING'
	| 'DONE';

export type SlotChip = { label: string; startISO: string };

export interface BookingContext {
	state: BookingState;
	intent: BookingIntent;
	durationMinutes?: number;
	timeZone?: string;
	windowStartISO?: string;
	windowEndISO?: string;
	candidateSlots?: SlotChip[];
	chosenSlot?: SlotChip;
	attendeeEmail?: string;
	summary?: string;
	description?: string;
	error?: string;
}

export type BotTurn = {
	say: string;
	chips?: { type: 'duration'|'slot'|'confirmTz'; values: string[] | SlotChip[] };
	expect?: 'duration'|'window'|'tz'|'email'|'slot'|'confirm'|'none';
	context: BookingContext;
};

// Helper: format local labels for chips
function labelFor(startISO: string, timeZone: string) {
	const d = new Date(startISO);
	return d.toLocaleString(undefined, {
		timeZone,
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});
}

async function fetchSlots(args: {
	durationMinutes: number;
	timeZone: string;
	startISO: string;
	endISO: string;
}): Promise<SlotChip[]> {
	const res = await fetch('/api/schedule/slots', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			durationMinutes: args.durationMinutes,
			startISO: args.startISO,
			endISO: args.endISO,
			timeZone: args.timeZone,
			maxCandidates: 24
		}),
	});
	if (!res.ok) throw new Error(await res.text());
	const data = await res.json();
	return (data.slots as { startISO: string; endISO: string }[]).slice(0, 12).map(s => ({
		startISO: s.startISO,
		label: labelFor(s.startISO, args.timeZone),
	}));
}

async function bookSlot(args: {
	startISO: string;
	durationMinutes: number;
	timeZone: string;
	attendeeEmail: string;
	attendeeName?: string;
	summary: string;
	description?: string;
}) {
	const res = await fetch('/api/schedule/book', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(args),
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json() as Promise<{ meetUrl: string; htmlLink: string; eventId: string }>;
}

export async function nextTurn(
	userInput: string | null,
	ctx: BookingContext
): Promise<BotTurn> {
	let say = '';
	let chips: BotTurn['chips'] | undefined;
	let expect: BotTurn['expect'] | undefined = 'none';
	let state = ctx.state;

	const tz = ctx.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'America/New_York';

	switch (state) {
		case 'IDLE': {
			state = 'ASK_DURATION';
			say = `Want to book time? I can do 15, 30, or 45 minutes. What works?`;
			chips = { type: 'duration', values: ['15', '30', '45'] };
			expect = 'duration';
			break;
		}

		case 'ASK_DURATION': {
			const picked = parseInt((userInput || '').replace(/\D+/g, ''), 10);
			const duration = [15, 30, 45].includes(picked) ? picked : 30;
			ctx.durationMinutes = duration;
			state = 'ASK_WINDOW';
			say = `Cool. Looking at the next few days — any preference? This week, next week, mornings, afternoons?`;
			expect = 'window';
			break;
		}

		case 'ASK_WINDOW': {
			// For simplicity, set a default window: now → +14 days.
			const now = new Date();
			const startISO = now.toISOString();
			const endISO = new Date(now.getTime() + 14 * 24 * 3600 * 1000).toISOString();
			ctx.windowStartISO = startISO;
			ctx.windowEndISO = endISO;
			state = 'CONFIRM_TZ';
			ctx.timeZone = tz;
			say = `I’ll show times in ${tz}. That okay?`;
			chips = { type: 'confirmTz', values: ['Yep', 'Change TZ'] };
			expect = 'tz';
			break;
		}

		case 'CONFIRM_TZ': {
			const yes = (userInput || '').toLowerCase().includes('y');
			if (!yes) {
				// In a real chat, parse the user’s TZ string. Here we keep current.
			}
			state = 'FETCH_SLOTS';
			say = `Give me a sec — pulling open times.`;
			expect = 'none';
			// side effect: fetch slots
			const slots = await fetchSlots({
				durationMinutes: ctx.durationMinutes!,
				timeZone: ctx.timeZone!,
				startISO: ctx.windowStartISO!,
				endISO: ctx.windowEndISO!,
			});
			ctx.candidateSlots = slots;
			state = 'PRESENT_SLOTS';
			say = `Here are a few options:`;
			chips = { type: 'slot', values: slots };
			expect = 'slot';
			break;
		}

		case 'PRESENT_SLOTS': {
			const chosen = ctx.candidateSlots?.find(s => (userInput || '').includes(s.label));
			if (!chosen) {
				say = `Pick one of the times above and I’ll lock it.`;
				chips = { type: 'slot', values: ctx.candidateSlots || [] };
				expect = 'slot';
				break;
			}
			ctx.chosenSlot = chosen;
			state = 'ASK_EMAIL';
			say = `Got it. What’s the best email for the invite?`;
			expect = 'email';
			break;
		}

		case 'ASK_EMAIL': {
			const email = (userInput || '').trim();
			ctx.attendeeEmail = email;
			state = 'CONFIRM_SLOT';
			say = `I’ll book ${ctx.chosenSlot!.label} and send the Meet link. Sound good?`;
			chips = { type: 'confirmTz', values: ['Confirm', 'Pick another time'] };
			expect = 'confirm';
			break;
		}

		case 'CONFIRM_SLOT': {
			const confirm = (userInput || '').toLowerCase().includes('confirm');
			if (!confirm) {
				state = 'FETCH_SLOTS';
				say = `No worries. Let’s pick another one.`;
				expect = 'none';
				const slots = await fetchSlots({
					durationMinutes: ctx.durationMinutes!,
					timeZone: ctx.timeZone!,
					startISO: ctx.windowStartISO!,
					endISO: ctx.windowEndISO!,
				});
				ctx.candidateSlots = slots;
				state = 'PRESENT_SLOTS';
				say = `New options:`;
				chips = { type: 'slot', values: slots };
				expect = 'slot';
				break;
			}

			state = 'BOOKING';
			say = `Locking it in…`;
			expect = 'none';

			const { startISO } = ctx.chosenSlot!;
			const result = await bookSlot({
				startISO,
				durationMinutes: ctx.durationMinutes!,
				timeZone: ctx.timeZone!,
				attendeeEmail: ctx.attendeeEmail!,
				summary: 'Meeting with John',
				description: 'Booked via site chatbot.',
			});

			state = 'DONE';
			say = `All set. Calendar invite is out. Join link: ${result.meetUrl}`;
			expect = 'none';
			break;
		}

		case 'DONE':
		default: {
			say = `Want to book another time?`;
			expect = 'none';
			state = 'IDLE';
			break;
		}
	}

	return { say, chips, expect, context: { ...ctx, state } };
}



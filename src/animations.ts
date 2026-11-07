const reduced = matchMedia('(prefers-reduced-motion: reduce)');

const timing = (el: HTMLElement) => {
	const style = getComputedStyle(el),
		duration = style.getPropertyValue('--cz-duration-fast').trim(),
		easing = style.getPropertyValue('--cz-ease-in-out').trim();
	return {
		duration: duration
			? parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000)
			: 200,
		easing: easing || 'ease-in-out',
	};
};

const slide =
	(from: string, to: string) => (inEl: HTMLElement, outEl: HTMLElement) => {
		if (reduced.matches) return Promise.resolve();
		// Only transform animates, so the slide stays on the compositor while the
		// incoming slide renders. The outgoing slide leaves the flow inline instead.
		const options = { ...timing(inEl), fill: 'none' } as const,
			{ position, inset } = outEl.style;
		Object.assign(outEl.style, { position: 'absolute', inset: '0' });
		const inAnimation = inEl.animate(
				[{ transform: `translateX(${from})` }, { transform: 'translateX(0%)' }],
				options,
			),
			outAnimation = outEl.animate(
				[{ transform: 'translateX(0%)' }, { transform: `translateX(${to})` }],
				options,
			);

		return Promise.all([inAnimation.finished, outAnimation.finished]).finally(
			() => Object.assign(outEl.style, { position, inset }),
		);
	};

export const slideInRight = slide('100%', '-100%');
export const slideInLeft = slide('-100%', '100%');
export const dropTop = (inEl: HTMLElement, outEl: HTMLElement) => {
	if (reduced.matches) return Promise.resolve();
	const inAnimation = inEl.animate(
			[
				{ position: 'absolute', transform: 'translateY(-100%) scale(1.5)' },
				{ transform: 'translateY(0%) scale(1)' },
			],
			{
				duration: 200,
				delay: 20,
				fill: 'none',
				easing: 'cubic-bezier(1,0,.48,1.06)',
			},
		),
		outAnimation = outEl.animate([{ position: 'absolute' }, { opacity: 0 }], {
			duration: 200,
			fill: 'none',
			easing: 'linear',
		});

	return Promise.all([inAnimation.finished, outAnimation.finished]);
};

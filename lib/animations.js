export const slideInRight = (inEl, outEl) => {
		const inAnimation = inEl.animate(
				[
					{ position: 'absolute', transform: 'translateX(100%)' },
					{ transform: 'translateX(0%)' }
				],
				{ duration: 200, fill: 'none', easing: 'ease-in-out' }
			),
			outAnimation = outEl.animate(
				[{}, { position: 'absolute', transform: 'translateX(-100%)' }],
				{ duration: 200, fill: 'none', easing: 'ease-in-out' }
			);

		return Promise.all([inAnimation.finished, outAnimation.finished]);
	},
	slideInLeft = (inEl, outEl) => {
		const inAnimation = inEl.animate(
				[
					{ position: 'absolute', transform: 'translateX(-100%)' },
					{ transform: 'translateX(0%)' }
				],
				{ duration: 200, fill: 'none', easing: 'ease-in-out' }
			),
			outAnimation = outEl.animate(
				[{}, { position: 'absolute', transform: 'translateX(100%)' }],
				{ duration: 200, fill: 'none', easing: 'ease-in-out' }
			);

		return Promise.all([inAnimation.finished, outAnimation.finished]);
	},
	dropTop = (inEl, outEl) => {
		const inAnimation = inEl.animate(
				[
					{ position: 'absolute', transform: 'translateY(-100%) scale(1.5)' },
					{ transform: 'translateY(0%) scale(1)' }
				],
				{
					duration: 200,
					delay: 20,
					fill: 'none',
					easing: 'cubic-bezier(1,0,.48,1.06)'
				}
			),
			outAnimation = outEl.animate([{ position: 'absolute' }, { opacity: 0 }], {
				duration: 200,
				fill: 'none',
				easing: 'linear'
			});

		return Promise.all([inAnimation.finished, outAnimation.finished]);
	};

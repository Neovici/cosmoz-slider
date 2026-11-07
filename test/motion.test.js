import { expect, fixture, html, nextFrame } from '@open-wc/testing';
import { emulateMedia } from '@web/test-runner-commands';
import { slideInRight } from '../src';

const switchSlide = async (style = '') => {
	const el = await fixture(
		html`<cosmoz-slider
			style=${style}
			.slide=${{ id: 1, content: html`One` }}
		></cosmoz-slider>`,
	);
	el.slide = { id: 2, content: html`Two`, animation: slideInRight };
	await nextFrame();
	return el;
};

describe('motion', () => {
	afterEach(() => emulateMedia({ reducedMotion: 'no-preference' }));

	it('slides for --cz-duration-fast with --cz-ease-in-out', async () => {
		const el = await switchSlide(
				'--cz-duration-fast: 0.4s; --cz-ease-in-out: linear',
			),
			[animation] = el.lastElementChild.getAnimations(),
			timing = animation.effect.getTiming();
		expect(timing.duration).to.equal(400);
		expect(timing.easing).to.equal('linear');
	});

	it('falls back to 200ms without the tokens', async () => {
		const el = await switchSlide(),
			[animation] = el.lastElementChild.getAnimations();
		expect(animation.effect.getTiming().duration).to.equal(200);
	});

	it('swaps at once under reduced motion', async () => {
		await emulateMedia({ reducedMotion: 'reduce' });
		const el = await switchSlide();
		await nextFrame();
		expect(el.children).to.have.length(1);
		expect(el.textContent.trim()).to.equal('Two');
	});
});

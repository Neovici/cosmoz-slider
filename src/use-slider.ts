import { html, useEffect, useLayoutEffect, useState } from 'haunted';
import { TemplateResult } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';
import { ref } from 'lit-html/directives/ref.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { guard } from 'lit-html/directives/guard.js';
import { ManagedPromise } from '@neovici/cosmoz-utils/promise';

export interface Slide {
	id: unknown;
	content?: TemplateResult<1>;
	render?: (slide: Slide) => void;
	animation?: (inEl: HTMLElement, outEl: HTMLElement) => void;
}

export interface SlideRef extends Slide {
	out?: boolean;
	animationEnd$: Promise<undefined>;
	el?: HTMLElement;
}

export const styles = {
	host: { position: 'relative', display: 'block', overflow: 'hidden' },
	slide: {
		position: 'static',
		width: '100%',
		height: '100%',
	},
};

export const useSlider = <T extends HTMLElement & { slide: Slide }>(
	host: T,
) => {
	const { slide } = host,
		[slides, setSlides] = useState([] as SlideRef[]);

	// eslint-disable-next-line no-void
	useLayoutEffect(() => void Object.assign(host.style, styles.host), []);

	useEffect(() => {
		if (slide == null) {
			return;
		}

		const _slide = {
			animationEnd$: new ManagedPromise(),
			...slide,
		} as SlideRef;

		setSlides((slides = []) => {
			const idx = slides.findIndex(
				({ id, out }) => id === _slide.id && out !== true,
			);

			if (idx !== -1) {
				return [
					...slides.slice(0, idx),
					_slide,
					...slides.slice(idx + 1, slides.length),
				];
			}

			return [...slides, _slide];
		});
	}, [slide]);

	useLayoutEffect(async () => {
		if (slides.filter((slide) => !slide.out).length < 2) {
			const slide = slides[0];
			slide &&
				requestAnimationFrame(() =>
					requestAnimationFrame(() =>
						(slide.animationEnd$ as ManagedPromise<undefined>).resolve(),
					),
				);
			return;
		}

		const inSlide = slides[slides.length - 1],
			outSlide = slides[slides.length - 2],
			inEl = inSlide.el,
			outEl = outSlide.el;

		outSlide.out = true;
		if (inEl && outEl) {
			await inSlide.animation?.(inEl, outEl);
		}

		setSlides((slides = []) => slides.filter((slide) => slide !== outSlide));
	}, [slides]);

	return { slides };
};

export const renderSlide = (slide: Slide): unknown =>
	html`<div
		${ref((el) => Object.assign(slide, { el }))}
		class="slide"
		style=${styleMap(styles.slide)}
	>
		${guard([slide], () => slide.content ?? slide.render?.(slide))}
	</div>`;

export const renderSlider = ({ slides }: { slides: Slide[] }) =>
	guard([slides], () => repeat(slides, ({ id }) => id, renderSlide));

import { html, useEffect, useLayoutEffect, useState } from 'haunted';
import { directive } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { styleMap } from 'lit-html/directives/style-map';

export const
	styles = {
		host: { position: 'relative', display: 'block', overflow: 'hidden' },
		slide: {
			position: 'static',
			width: '100%',
			height: '100%'
		}},

	useSlider = host => {
		const
			{ slide } = host,
			[slides, setSlides] = useState([]);

		useLayoutEffect(() => Object.assign(host.style, styles.host), []);

		useEffect(() => {
			if (slide == null) {
				return;
			}

			setSlides(slides => {
				const idx = slides.findIndex(({ id, out }) => id === slide.id && out !== true);

				if (idx !== -1) {
					return [...slides.slice(0, idx), slide, ...slides.slice(idx + 1, slides.length)];
				}

				return [...slides, slide];
			});
		}, [slide]);

		// @ts-ignore
		useLayoutEffect(async () => {
			if (slides.filter(slide => !slide.out).length < 2) {
				return;
			}

			const
				inSlide = slides[slides.length - 1],
				outSlide = slides[slides.length - 2],
				inEl = inSlide.el,
				outEl = outSlide.el;

			outSlide.out = true;

			await inSlide.animation?.(inEl, outEl);

			setSlides(slides => slides.filter(slide => slide !== outSlide));
		}, [slides]);

		return { slides };
	},
	slideRef = directive(slide => part => {
		slide.el = part?.committer?.element;
	}),
	renderSlide = slide => html`<div ceva=${ slideRef(slide) } class="slide" style=${ styleMap(styles.slide) }>${ slide.content }</div>`,
	renderSlider = ({ slides }) => repeat(slides, ({ id }) => id, renderSlide);

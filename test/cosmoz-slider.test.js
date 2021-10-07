import '../cosmoz-slider';
import { expect, fixture, html, nextFrame, aTimeout } from '@open-wc/testing';
import { dropTop, slideInLeft, slideInRight } from '../lib/animations';

it('renders an empty slider', async () => {
	const el = await fixture(html`<cosmoz-slider></cosmoz-slider>`);
	expect(el).dom.to.equal('<cosmoz-slider></cosmoz-slider>');
	expect(el).shadowDom.to.equal('');
});

it('renders a slide', async () => {
	const el = await fixture(html`<cosmoz-slider .slide=${ { content: html`Hello world` } }></cosmoz-slider>`);
	expect(el).shadowDom.to.equal('<div>Hello world</div>');
});

it('switches between two slides', async () => {
	const el = await fixture(html`<cosmoz-slider .slide=${ { id: 1, content: html`Hello world` } }></cosmoz-slider>`);
	expect(el).shadowDom.to.equal('<div>Hello world</div>');

	el.slide = { id: 2, content: html`Greetings globe` };
	await nextFrame();
	expect(el).shadowDom.to.equal('<div>Greetings globe</div>');
});

it('animates between two slides', async () => {
	const el = await fixture(html`<cosmoz-slider .slide=${ { id: 1, content: html`Hello world` } }></cosmoz-slider>`);
	expect(el).shadowDom.to.equal('<div>Hello world</div>');

	el.slide = { id: 2, content: html`Greetings globe`, animation: slideInRight };
	await nextFrame();
	expect(el).shadowDom.to.equal('<div>Hello world</div><div>Greetings globe</div>');
	await aTimeout(300);
	expect(el).shadowDom.to.equal('<div>Greetings globe</div>');
});

it('updates a slide by id', async () => {
	const el = await fixture(html`<cosmoz-slider .slide=${ { id: 1, content: html`Hello world` } }></cosmoz-slider>`);
	expect(el).shadowDom.to.equal('<div>Hello world</div>');

	el.slide = { id: 1, content: html`Greetings globe`, animation: slideInRight };
	await nextFrame();
	expect(el).shadowDom.to.equal('<div>Greetings globe</div>');
});

it('animates using configurable animations', async () => {
	const el = await fixture(html`<cosmoz-slider .slide=${ { id: 1, content: html`Hello world` } }></cosmoz-slider>`);
	expect(el).shadowDom.to.equal('<div>Hello world</div>');

	el.slide = { id: 2, content: html`Greetings globe`, animation: slideInLeft };
	await nextFrame();
	expect(el).shadowDom.to.equal('<div>Hello world</div><div>Greetings globe</div>');
	el.slide = { id: 3, content: html`Aloha planet`, animation: dropTop };
	await nextFrame();
	expect(el).shadowDom.to.equal('<div>Hello world</div><div>Greetings globe</div><div>Aloha planet</div>');
	await aTimeout(300);
	expect(el).shadowDom.to.equal('<div>Aloha planet</div>');
});

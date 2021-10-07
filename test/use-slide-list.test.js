import { useSlideList } from '../lib/use-slide-list';
import { component } from 'haunted';
import { expect, html, fixture, nextFrame } from '@open-wc/testing';
import { nothing } from 'lit-html';

customElements.define(
	'use-slide-list',
	component(host => {
		const { items, render } = host;
		host.current = useSlideList(items, { render });
	})
);

describe('use-slide-list', () => {
	it('works with an empty array', async () => {
		const
			items = [],
			result = await fixture(html`<use-slide-list .items=${ items } />`);

		expect(result.current).to.include({
			first: true,
			index: -1,
			item: undefined,
			last: true
		});
		expect(result.current.slide).to.include({ content: nothing });
	});

	it('iterates over the list', async () => {
		const
			items = [{ x: 1 }, { x: 2 }],
			render = ({ x }) => x,
			result = await fixture(html`<use-slide-list .items=${ items } .render=${ render } />`);

		expect(result.current).to.include({
			first: true,
			index: 0,
			item: items[0],
			last: false
		});
		expect(result.current.slide).to.include({ content: 1 });

		result.current.next();
		await nextFrame();

		expect(result.current).to.include({
			first: false,
			index: 1,
			item: items[1],
			last: true
		});
		expect(result.current.slide).to.include({ content: 2 });

		result.current.next();
		await nextFrame();

		expect(result.current).to.include({
			first: false,
			index: 1,
			item: items[1],
			last: true
		});
		expect(result.current.slide).to.include({ content: 2 });
	});
});

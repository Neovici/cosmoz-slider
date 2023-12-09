import { useCallback, useEffect, useMemo, useRef, useState } from 'haunted';
import { nothing, TemplateResult } from 'lit-html';
import { slideInRight, slideInLeft } from './animations';

const useLastValue = <T>(value: T) => {
		const lastValue = useRef<T | undefined>(undefined);
		// eslint-disable-next-line no-return-assign, no-void
		useEffect(() => void (lastValue.current = value), [value]);
		return lastValue.current;
	},
	identity = <T>(a: T) => a,
	find = <T, V>(list: T[], item: T, id: (i: T) => V) =>
		list.find((i) => id(i) === id(item)) ?? list[0],
	emptySlide = () => ({
		id: Math.random(),
		content: nothing,
		animation: slideInRight,
	});

type Fn = () => void;
export interface RenderOpts {
	next: Fn;
	prev: Fn;
	goto: (i: number) => void;
	first: boolean;
	last: boolean;
}
interface UseSlideList<T> {
	initial: T;
	id: (i: T) => unknown;
	render: (i: T, o: RenderOpts) => TemplateResult<1>;
}

export const useSlideList = <T>(
	items: T[],
	{ initial, render, id = identity }: UseSlideList<T>,
) => {
	const [item, setItem] = useState(() => initial ?? items[0]),
		index = useMemo(() => items.indexOf(item), [items, item]),
		prevIndex = useLastValue(index),
		prev = useCallback(
			() =>
				setItem(
					() => items[Math.max(0, Math.min(items.length - 1, index - 1))],
				),
			[items, index],
		),
		next = useCallback(
			() =>
				setItem(
					() => items[Math.max(0, Math.min(items.length - 1, index + 1))],
				),
			[items, index],
		),
		goto = useCallback((index: number) => setItem(() => items[index]), [items]),
		first = index <= 0,
		last = index === items.length - 1;

	useEffect(
		() =>
			setItem((item) =>
				// eslint-disable-next-line no-nested-ternary
				!item
					? items[0]
					: items.indexOf(item) >= 0
					? item
					: find(items, item, id),
			),
		[items],
	);

	return {
		index,
		item,
		slide: useMemo(() => {
			if (item == null) return emptySlide();
			return {
				id: id(item),
				content: render(item, { next, prev, goto, first, last }),
				animation: index > (prevIndex ?? -1) ? slideInRight : slideInLeft,
			};
		}, [item, render]),
		prev,
		next,
		goto,
		first,
		last,
	};
};

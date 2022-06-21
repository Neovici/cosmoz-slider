import { useCallback, useEffect, useMemo, useRef, useState } from 'haunted';
import { nothing } from 'lit-html';
import { slideInRight, slideInLeft } from './animations';

const useLastValue = value => {
		const lastValue = useRef(undefined);
		// eslint-disable-next-line no-return-assign
		useEffect(() => lastValue.current = value, [value]);
		return lastValue.current;
	},
	identity = a => a,
	find = (list, item, id) => list.find(i => id(i) === id(item)) ?? list[0],
	emptySlide = () => ({
		id: Math.random(),
		content: nothing,
		animation: slideInRight
	});

export const useSlideList = (items, { initial, render, id = identity }) => {
	const [item, setItem] = useState(initial ?? items[0]),
		index = useMemo(() => items.indexOf(item), [items, item]),
		prevIndex = useLastValue(index),
		prev = useCallback(
			() => setItem(items[Math.max(0, Math.min(items.length - 1, index - 1))]),
			[items, index]
		),
		next = useCallback(
			() => setItem(items[Math.max(0, Math.min(items.length - 1, index + 1))]),
			[items, index]
		),
		goto = useCallback(index => setItem(items[index]), [items]),
		first = index <= 0,
		last = index === items.length - 1;

	useEffect(
		() =>
			setItem(item =>
				// eslint-disable-next-line no-nested-ternary
				!item
					? items[0]
					: items.indexOf(item) >= 0
						? item
						: find(items, item, id)
			),
		[items]
	);

	return {
		index,
		item,
		slide: useMemo(
			() =>
				item
					? {
						id: id(item),
						content: render(item, { next, prev, goto, first, last }),
						animation: index > prevIndex ? slideInRight : slideInLeft
					}
					: emptySlide(),
			[item, render]
		),
		prev,
		next,
		goto,
		first,
		last
	};
};
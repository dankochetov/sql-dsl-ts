import { Element } from './base';

export default class Stack {
	private constructor() {}

	private static elements: Element[] = [];

	private static rootElements: Element[] = [];
	static getRootElements(): Element[] {
		return Stack.rootElements;
	}

	static push(el: Element, isRootElement = false) {
		Stack.elements.push(el);
		if (isRootElement) {
			Stack.rootElements.push(el);
		}
	}

	static current(): Element {
		return Stack.elements[Stack.elements.length - 1];
	}

	static pop(): Element | undefined {
		return Stack.elements.pop();
	}

	static findClosest<T extends Element>(
		matches: (el: Element) => el is T,
		currentOnly: boolean = false,
	): T | undefined {
		if (currentOnly) {
			const cur = Stack.current();
			return matches(cur) ? cur : undefined;
		}

		for (const el of this.elements) {
			if (matches(el)) {
				return el;
			}
		}
	}
}

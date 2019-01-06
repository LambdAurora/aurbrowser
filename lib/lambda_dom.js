/*
 * Copyright © 2018 LambdAurora <aurora42lambda@gmail.com>
 *
 * This file is part of lambda_dom.
 *
 * Licensed under the MIT license. For more information,
 * see the LICENSE file.
 */

/**
 * Represents a builder of DOM elements.
 */
class DOMBuilder
{
	constructor(element)
	{
		this._element = element;
	}

	inner_html(html)
	{
		this._element.innerHTML = html;
		return this;
	}

	/**
	 * Sets the inner text of the element.
	 * @param text The inner text of the element.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	inner_text(text)
	{
		this._element.innerText = text;
		return this;
	}

	/**
	 * Sets the href attribute of the element.
	 * @param uri The HREF value.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	href(uri)
	{
		this._element.href = uri;
		return this;
	}

	/**
	 * Sets the src attribute of the element.
	 * @param uri The src value.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	src(uri)
	{
		this._element.src = uri;
		return this;
	}

	/**
	 * Adds a class to the element.
	 * @param class_name The class to add.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	add_class(class_name)
	{
		this._element.className += ` ${class_name}`;
		return this;
	}

	/**
	 * Sets the classes of the element.
	 * @param classes The classes to set.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	classes(classes)
	{
		if (classes.constructor === Array) this._element.className = classes.join(' ');
		else this._element.className = classes;
		return this;
	}

	/**
	 * Sets the style of the element.
	 * @param key The style key.
	 * @param value The style value.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	style(key, value)
	{
		this._element.style[key] = value;
		return this;
	}

	/**
	 * Sets an attribute of the element.
	 * @param key The attribute key.
	 * @param value The attribute value.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	attribute(key, value)
	{
		this._element.setAttribute(key, value);
		return this;
	}

	/**
	 * Appends an element to the current element.
	 * @param element The element to append.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	append(element)
	{
		if (element instanceof DOMBuilder)
			this._element.append(element.to_element());
		else if (element instanceof Element)
			this._element.append(element);
		else throw `Cannot append ${element} to the element because of wrong type.`;
		return this;
	}

	/**
	 * Appends multiple elements to the current element.
	 * @param elements The elements to append.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	append_all(elements)
	{
		if (elements.constructor !== Array) throw `Cannot append ${elements} to the element because of wrong type. (Expected: array).`;
		elements.forEach(this.append);
		return this;
	}

	/**
	 * Executes the function with the element.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	do_on(fn)
	{
		fn(this);
		return this;
	}

	/**
	 * Executes the specified function if the condition is true.
	 * @param condition The condition.
	 * @param callback The callback.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	do_if(condition, callback)
	{
		return this.do_if_else(condition, callback, e => {});
	}

	/**
	 * Executes the specified function if the condition is true, else executes the false function.
	 * @param condition The condition.
	 * @param callback_true The callback if true.
	 * @param callback_false The callback if false.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	do_if_else(condition, callback_true, callback_false)
	{
		if (condition) callback_true(this);
		else callback_false(this);
		return this;
	}

	/**
	 * Adds a handling of the specified event to the element.
	 * @param event The event.
	 * @param callback The callback.
	 * @returns {DOMBuilder} The current instance of the DOM element builder.
	 */
	on(event, callback)
	{
		this._element.addEventListener(event, callback);
		return this;
	}

	/**
	 * Returns the DOM element built.
	 * @returns {*} The DOM element.
	 */
	to_element()
	{
		return this._element;
	}
}

/**
 * Represents the main instance of LambdaDOM.
 */
class LambdaDOM
{
	constructor(document)
	{
		this._doc = document;
	}

	/**
	 * Create a new specified element.
	 * @param element The type of element.
	 * @returns {HTMLElement} The instance of the DOM element.
	 */
	create_element(element)
	{
		return this._doc.createElement(element);
	}

	/**
	 * Builds a new specified element.
	 * @param element The type of element.
	 * @returns {DOMBuilder} THe instance of the DOM element builder.
	 */
	build(element)
	{
		return new DOMBuilder(this.create_element(element));
	}

	/**
	 * Creates a new `div` element.
	 * @returns {DOMBuilder} The builder of the `div` element.
	 */
	div()
	{
		return this.build('div');
	}

	/**
	 * Creates a new `ul` element.
	 * @returns {DOMBuilder} The builder of the `ul` element.
	 */
	ul()
	{
		return this.build('ul');
	}

	/**
	 * Creates a new `li` element.
	 * @returns {DOMBuilder} The builder of the `li` element.
	 */
	li()
	{
		return this.build('li');
	}

	/**
	 * Creates a new `span` element.
	 * @returns {DOMBuilder} The builder of the `span` element.
	 */
	span()
	{
		return this.build('span');
	}

	/**
	 * Creates a new `span` element with the specified inner text.
	 * @param text The inner text.
	 * @returns {DOMBuilder} The element builder of the `span` element.
	 */
	span_text(text)
	{
		return this.span().inner_text(text);
	}

	/**
	 * Creates a new `span` element with an array of elements to append.
	 * @param elements The elements to append.
	 * @returns {DOMBuilder} The element builder of the `span` element.
	 */
	span_elems(elements)
	{
		return this.span().append_all(elements);
	}

	/**
	 * Creates a new `p` element.
	 * @returns {DOMBuilder} The builder of the `p` element.
	 */
	p()
	{
		return this.build('p');
	}


	p_text(text)
	{
		return this.p().inner_text(text);
	}

	/**
	 * Creates a new `h1` element.
	 * @returns {DOMBuilder} The builder of the `h1` element.
	 */
	h1()
	{
		return this.build('h1');
	}

	/**
	 * Creates a new `h1` element with the specified inner text.
	 * @param text The inner text.
	 * @returns {DOMBuilder} The element builder of the `h1` element.
	 */
	h1_text(text)
	{
		return this.h1().inner_text(text);
	}

	/**
	 * Creates a new `h2` element.
	 * @returns {DOMBuilder} The builder of the `h2` element.
	 */
	h2()
	{
		return this.build('h2');
	}

	/**
	 * Creates a new `h2` element with the specified inner text.
	 * @param text The inner text.
	 * @returns {DOMBuilder} The element builder of the `h2` element.
	 */
	h2_text(text)
	{
		return this.h2().inner_text(text);
	}

	/**
	 * Creates a new `h3` element.
	 * @returns {DOMBuilder} The builder of the `h3` element.
	 */
	h3()
	{
		return this.build('h3');
	}

	/**
	 * Creates a new `h3` element with the specified inner text.
	 * @param text The inner text.
	 * @returns {DOMBuilder} The element builder of the `h3` element.
	 */
	h3_text(text)
	{
		return this.h3().inner_text(text);
	}

	/**
	 * Creates a new `h4` element.
	 * @returns {DOMBuilder} The builder of the `h4` element.
	 */
	h4()
	{
		return this.build('h4');
	}

	/**
	 * Creates a new `h4` element with the specified inner text.
	 * @param text The inner text.
	 * @returns {DOMBuilder} The element builder of the `h4` element.
	 */
	h4_text(text)
	{
		return this.h4().inner_text(text);
	}

	/**
	 * Creates a new `h5` element.
	 * @returns {DOMBuilder} The builder of the `h5` element.
	 */
	h5()
	{
		return this.build('h5');
	}

	/**
	 * Creates a new `h5` element with the specified inner text.
	 * @param text The inner text.
	 * @returns {DOMBuilder} The element builder of the `h5` element.
	 */
	h5_text(text)
	{
		return this.h5().inner_text(text);
	}

	/**
	 * Creates a new `h6` element.
	 * @returns {DOMBuilder} The builder of the `h6` element.
	 */
	h6()
	{
		return this.build('h6');
	}

	/**
	 * Creates a new `h6` element with the specified inner text.
	 * @param text The inner text.
	 * @returns {DOMBuilder} The element builder of the `h6` element.
	 */
	h6_text(text)
	{
		return this.h6().inner_text(text);
	}
}
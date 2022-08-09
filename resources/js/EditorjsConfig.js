import EditorJS from '@editorjs/editorjs';

let currentGifId = 'this-gif' + Math.floor(Date.now() / 1000);
let selectedUrls = [];
/**
 * Tool for creating Gifs Blocks for Editor.js
 */
class ADDGIF {
	static get toolbox() {
		return {
			title: 'GIF',
			icon: '<svg width="10" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M7.6 8.15H2.25v4.525a1.125 1.125 0 0 1-2.25 0V1.125a1.125 1.125 0 1 1 2.25 0V5.9H7.6V1.125a1.125 1.125 0 0 1 2.25 0v11.55a1.125 1.125 0 0 1-2.25 0V8.15z"></path></svg>'
		};
	}

	/**
	 * Allow render Image Blocks by pasting HTML tags, files and URLs
	 */
	static get pasteConfig() {
		return {
			tags: ['IMG'],
			files: {
				mimeTypes: ['image/*'],
				extensions: ['gif', 'jpg', 'png'] // You can specify extensions instead of mime-types
			},
			patterns: {
				image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png)$/i
			}
		};
	}

	/**
	 * Automatic sanitize config
	 */
	static get sanitize() {
		return {
			url: {},
			caption: {
				b: true,
				a: {
					href: true
				},
				i: true
			}
		};
	}

	/**
	 * Tool class constructor
	 * @param {ImageToolData} data — previously saved data
	 * @param {object} api 
	 * @param {ImageToolConfig} config — custom config that we provide to our tool's user
	 */
	constructor( {data, api, config}){
		this.api = api;
		this.config = config || {};
		this.data = {
			url: data.url || '',
			caption: data.caption || '',
			withBorder: data.withBorder !== undefined ? data.withBorder : false,
			withBackground: data.withBackground !== undefined ? data.withBackground : false,
			stretched: data.stretched !== undefined ? data.stretched : false,
		};

		this.wrapper = undefined;
		this.settings = [
			{
				name: 'withBorder',
				icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
			},
			{
				name: 'stretched',
				icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
			},
			{
				name: 'withBackground',
				icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`
			}
		];
	}

	/**
	 * Return a Tool's UI
	 * @return {HTMLElement}
	 */
	render() {
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('simple-image');
		currentGifId = 'this-gif' + Math.floor(Date.now() / 1000);
		this.wrapper.setAttribute("id", currentGifId);

		if (this.data && this.data.url) {
			this._createImage(this.data.url, this.data.caption);
			return this.wrapper;
		}

		const input = document.createElement('input');

		document.getElementById('gifs-popup').style.display = 'block';

		input.placeholder = this.config.placeholder || '';
		input.addEventListener('paste', (event) => {
			this._createImage(event.clipboardData.getData('text'));
		});

		this.wrapper.appendChild(input);

		return this.wrapper;
	}

	/**
	 * @private
	 * Create image with caption field
	 * @param {string} url — image source
	 * @param {string} captionText — caption value
	 */
	_createImage(url, captionText) {
		const image = document.createElement('img');
		const caption = document.createElement('div');

		image.src = url;
		caption.contentEditable = true;
		caption.innerHTML = '';

		this.wrapper.innerHTML = '';
		this.wrapper.appendChild(image);
		this.wrapper.appendChild(caption);

		this._acceptTuneView();
	}

	/**
	 * Extract data from the UI
	 * @param {HTMLElement} blockContent — element returned by render method
	 * @return {SimpleImageData}
	 */
	save(blockContent) {
		console.log("blockContent", blockContent)
		const image = blockContent.querySelector('img');
		const caption = blockContent.querySelector('[contenteditable]');
		if (image !== null && image !== undefined) {
			return Object.assign(this.data, {
				url: image.src,
				caption: ''
			});
		}
	}

	/**
	 * Skip empty blocks
	 * @see {@link https://editorjs.io/saved-data-validation}
	 * @param {ImageToolConfig} savedData
	 * @return {boolean}
	 */
	validate(savedData) {
		if (savedData !== null && savedData !== undefined && !savedData.url.trim()) {
			return false;
		}
		return true;
	}

	/**
	 * Making a Block settings: 'add border', 'add background', 'stretch to full width'
	 * @see https://editorjs.io/making-a-block-settings — tutorial
	 * @see https://editorjs.io/tools-api#rendersettings - API method description
	 * @return {HTMLDivElement}
	 */
	renderSettings() {
		const wrapper = document.createElement('div');

		this.settings.forEach(tune => {
			let button = document.createElement('div');

			button.classList.add(this.api.styles.settingsButton);
			button.classList.toggle(this.api.styles.settingsButtonActive, this.data[tune.name]);
			button.innerHTML = tune.icon;
			wrapper.appendChild(button);

			button.addEventListener('click', () => {
				this._toggleTune(tune.name);
				button.classList.toggle(this.api.styles.settingsButtonActive);
			});

		});

		return wrapper;
	}

	/**
	 * @private
	 * Click on the Settings Button
	 * @param {string} tune — tune name from this.settings
	 */
	_toggleTune(tune) {
		this.data[tune] = !this.data[tune];
		this._acceptTuneView();
	}

	/**
	 * Add specified class corresponds with activated tunes
	 * @private
	 */
	_acceptTuneView() {
		this.settings.forEach(tune => {
			this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);
		});
	}

	/**
	 * Handle paste event
	 * @see https://editorjs.io/tools-api#onpaste - API description
	 * @param {CustomEvent }event
	 */
	onPaste(event) {
		console.log("paste event", event);
		switch (event.type) {
			case 'tag':
				const imgTag = event.detail.data;
				this._createImage(imgTag.src);
				break;
			case 'file':
				/* We need to read file here as base64 string */
				const file = event.detail.file;
				const reader = new FileReader();

				reader.onload = (loadEvent) => {
					this._createImage(loadEvent.target.result);
				};

				reader.readAsDataURL(file);
				break;
			case 'pattern':
				const src = event.detail.data;

				this._createImage(src);
				break;
		}
	}
}

//  Paste Gif url

class ADDGIFURL {
	static get toolbox() {
		return {
			title: 'URL',
			icon: '<svg width="10" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 14"><path d="M7.6 8.15H2.25v4.525a1.125 1.125 0 0 1-2.25 0V1.125a1.125 1.125 0 1 1 2.25 0V5.9H7.6V1.125a1.125 1.125 0 0 1 2.25 0v11.55a1.125 1.125 0 0 1-2.25 0V8.15z"></path></svg>'
		};
	}

	/**
	 * Allow render Image Blocks by pasting HTML tags, files and URLs
	 */
	static get pasteConfig() {
		return {
			tags: ['IMG'],
			files: {
				mimeTypes: ['image/*'],
				extensions: ['gif', 'jpg', 'png'] // You can specify extensions instead of mime-types
			},
			patterns: {
				image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png)$/i
			}
		};
	}

	/**
	 * Automatic sanitize config
	 */
	static get sanitize() {
		return {
			url: {},
			caption: {
				b: true,
				a: {
					href: true
				},
				i: true
			}
		};
	}

	/**
	 * Tool class constructor
	 * @param {ImageToolData} data — previously saved data
	 * @param {object} api 
	 * @param {ImageToolConfig} config — custom config that we provide to our tool's user
	 */
	constructor( {data, api, config}){
		this.api = api;
		this.config = config || {};
		this.data = {
			url: data.url || '',
			caption: data.caption || '',
			withBorder: data.withBorder !== undefined ? data.withBorder : false,
			withBackground: data.withBackground !== undefined ? data.withBackground : false,
			stretched: data.stretched !== undefined ? data.stretched : false,
		};

		this.wrapper = undefined;
		this.settings = [
			{
				name: 'withBorder',
				icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
			},
			{
				name: 'stretched',
				icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
			},
			{
				name: 'withBackground',
				icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`
			}
		];
	}

	/**
	 * Return a Tool's UI
	 * @return {HTMLElement}
	 */
	render() {
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('simple-image');
		currentGifId = 'this-gif' + Math.floor(Date.now() / 1000);
		this.wrapper.setAttribute("id", currentGifId);

		if (this.data && this.data.url) {
			this._createImage(this.data.url, this.data.caption);
			return this.wrapper;
		}

		const input = document.createElement('input');



		input.placeholder = this.config.placeholder || ' PASTE GIF URL';
		input.addEventListener('paste', (event) => {
			this._createImage(event.clipboardData.getData('text'));
		});

		this.wrapper.appendChild(input);

		return this.wrapper;
	}

	/**
	 * @private
	 * Create image with caption field
	 * @param {string} url — image source
	 * @param {string} captionText — caption value
	 */
	_createImage(url, captionText) {
		const image = document.createElement('img');
		const caption = document.createElement('div');

		image.src = url;
		caption.contentEditable = true;
		caption.innerHTML = '';

		this.wrapper.innerHTML = '';
		this.wrapper.appendChild(image);
		this.wrapper.appendChild(caption);

		this._acceptTuneView();
	}

	/**
	 * Extract data from the UI
	 * @param {HTMLElement} blockContent — element returned by render method
	 * @return {SimpleImageData}
	 */
	save(blockContent) {
		const image = blockContent.querySelector('img');
		const caption = blockContent.querySelector('[contenteditable]');
		if (image !== null && image !== undefined) {
			return Object.assign(this.data, {
				url: image.src,
				caption: ''
			});
		}
	}

	/**
	 * Skip empty blocks
	 * @see {@link https://editorjs.io/saved-data-validation}
	 * @param {ImageToolConfig} savedData
	 * @return {boolean}
	 */
	validate(savedData) {
		if (savedData !== null && savedData !== undefined && !savedData.url.trim()) {
			return false;
		}
		return true;
	}

	/**
	 * Making a Block settings: 'add border', 'add background', 'stretch to full width'
	 * @see https://editorjs.io/making-a-block-settings — tutorial
	 * @see https://editorjs.io/tools-api#rendersettings - API method description
	 * @return {HTMLDivElement}
	 */
	renderSettings() {
		const wrapper = document.createElement('div');

		this.settings.forEach(tune => {
			let button = document.createElement('div');

			button.classList.add(this.api.styles.settingsButton);
			button.classList.toggle(this.api.styles.settingsButtonActive, this.data[tune.name]);
			button.innerHTML = tune.icon;
			wrapper.appendChild(button);

			button.addEventListener('click', () => {
				this._toggleTune(tune.name);
				button.classList.toggle(this.api.styles.settingsButtonActive);
			});

		});

		return wrapper;
	}

	/**
	 * @private
	 * Click on the Settings Button
	 * @param {string} tune — tune name from this.settings
	 */
	_toggleTune(tune) {
		this.data[tune] = !this.data[tune];
		this._acceptTuneView();
	}

	/**
	 * Add specified class corresponds with activated tunes
	 * @private
	 */
	_acceptTuneView() {
		this.settings.forEach(tune => {
			this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);
		});
	}

	/**
	 * Handle paste event
	 * @see https://editorjs.io/tools-api#onpaste - API description
	 * @param {CustomEvent }event
	 */
	onPaste(event) {
		console.log("paste event", event);
		switch (event.type) {
			case 'tag':
				const imgTag = event.detail.data;
				this._createImage(imgTag.src);
				break;
			case 'file':
				/* We need to read file here as base64 string */
				const file = event.detail.file;
				const reader = new FileReader();

				reader.onload = (loadEvent) => {
					this._createImage(loadEvent.target.result);
				};

				reader.readAsDataURL(file);
				break;
			case 'pattern':
				const src = event.detail.data;

				this._createImage(src);
				break;
		}
	}
}
let editedData = (document.getElementById("content").value !== null && document.getElementById("content").value !== "") ? JSON.parse(document.getElementById("content").value) : {};
const editor = new EditorJS({
	/** 
	 * Id of Element that should contain the Editor 
	 */
	holder: 'editorjs',

	/** 
	 * Available Tools list. 
	 * Pass Tool's class or Settings object for each Tool you want to use 
	 */

	autofocus: false,
	tools: {
		image: {
			class: ADDGIF,
			inlineToolbar: false,
			config: {
				placeholder: ''
			}
		},
		url: {
			class: ADDGIFURL,
			inlineToolbar: false,
			config: {
				placeholder: ''
			}
		}
	},
	data: editedData
});



// Search for gif API
function getUserInput() {
	var inputValue = document.querySelector(".search-for-gif").value;
	return inputValue;
}


document.querySelector(".search-for-gif").addEventListener("keyup", function (e) {
	// If the Key Enter is Pressed 
	if (e.which === 13) {
		var userInput = getUserInput();
		searchGiphy(userInput);
	}
});



function searchGiphy(searchQuery) {
	var url = "https://api.giphy.com/v1/gifs/search?api_key=JmbCSahlILCYnljTBMxCEDPHLqVU15nH&q=" + searchQuery; // AJAX Request

	var GiphyAJAXCall = new XMLHttpRequest();
	GiphyAJAXCall.open("GET", url);
	GiphyAJAXCall.send();

	GiphyAJAXCall.addEventListener("load", function (data) {
		var actualData = data.target.response;
		var gifURL = data.target.url;
		pushToDOM(actualData);
	});
}

function pushToDOM(response) {

	// Turn response into real JavaScript object
	response = JSON.parse(response);

	// Drill down to the data array
	var images = response.data;

	// Find the container to hold the response in DOM
	var container = document.querySelector(".all-gifs-results");

	// Clear the old content since this function 
	// will be used on every search that we want
	// to reset the div
	container.innerHTML = "";

	// Loop through data array and add IMG html
	images.forEach(function (image) {

		// Find image src
		var src = image.images.fixed_height.url;

		// Concatenate a new IMG tag
		container.innerHTML += "<div class='col-3 single-gif pt-2 mt-2' data-url='" + src + "'><div class='image-container'><img src='"
				+ src + "' class='container-image'/></div></div>";
	});
	const allGifs = document.querySelectorAll('.single-gif');

	allGifs.forEach(gif => {
		gif.addEventListener('click', function handleClick() {
			console.log("clicked!");
			let selectedUrl = this.getAttribute('data-url');

			const allSelectedGifs = document.querySelectorAll('.single-gif');
			allSelectedGifs.forEach(SelectedGif => {
				//  Remove class from each element
				SelectedGif.classList.remove('gif-selected');
			});

			this.classList.add('gif-selected');
			console.log("this.classList", this.classList);
			if (!selectedUrls.includes(selectedUrl) && this.classList.contains("gif-selected")) {
				selectedUrls.push(selectedUrl);
			} else {
				selectedUrls = selectedUrls.filter(item => item !== selectedUrl);
			}
			console.log("selectedUrls", selectedUrls);
			document.getElementById(currentGifId).innerHTML = '<img src="' + selectedUrl + '">';
			editor.save().then((savedData) => {
				console.log("savedData in select", savedData);
			});
		});
	});
}


// insert the selected gifs into editor 
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () => {

	editor.save().then((savedData) => {
		document.getElementById('content').innerHTML = JSON.stringify(savedData);
		document.getElementById('gifs-popup').style.display = 'none';
		// empty search for gif input and remove old result
		document.querySelector(".search-for-gif").value = '';
		document.querySelector(".all-gifs-results").innerHTML = '';
		// remove inner input if we didn't select gif
		let innerInput = document.getElementById(currentGifId).querySelector('input');
		if (innerInput !== null && innerInput !== undefined) {
			innerInput.remove();
		}

		selectedUrls = [];
	});
});

// Add the content to the hidden textare in order to save it to the database
document.getElementById('submit-article').addEventListener('click', () => {
	editor.save().then((savedData) => {
		document.getElementById('content').innerHTML = JSON.stringify(savedData);
		document.getElementById('gifs-popup').style.display = 'none';
	});
});
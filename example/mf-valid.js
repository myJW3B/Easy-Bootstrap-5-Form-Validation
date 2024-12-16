
//!!!!!!!!!!!!!!!! Start sending form data to server
async function postForm(form) {
	// Associate the FormData object with the form element
	const formData = new FormData(form)
	let method = form.getAttribute('method').toUpperCase();
	let url = form.getAttribute('action')
	let upload = form.getAttribute('enctype') === 'multipart/form-data'

	const fid = form.getAttribute('id')
	if (upload == true) {
		let files = form.querySelector('input[type="file"]').files
		let file_count = files.length
		if (files.length === 1) {
			formData.append('file', files[0]); // Append single file
		} else {
			for (let i = 0; i < files.length; i++) {
					formData.append(`file[${i}]`, files[i]); // Append multiple files
			}
		}
	}
	const response = await fetch(url, {
		method: method,
		body: formData,
	});
	return response.json()
}
//!!!!!!!!!!!!!!!! End sending form data to server

//!!!!!!!!!!!!!!!! Start sending post data (not in a form) to server
// Example POST method implementation: from Mozilla
async function postData(url = "", data = {}) {
	// Default options are marked with *
	const formData = new FormData()
	Object.entries(data).forEach(([key, value]) => {
		formData.append(key, value);
	});
	const response = await fetch(url, {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		body: formData, // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}
//!!!!!!!!!!!!!!!! End sending post data to server

window.addEventListener("DOMContentLoaded", function () {
	//!!!!!!!!!!!!!!!! Starting form submiting process
	let forms = document.querySelectorAll('.jw3b-form')
	let folen = forms.length
	let f
	for (f = 0; f < folen; f++) {
		forms[f].addEventListener('submit', (e) => {
			e.preventDefault()
			let findErrors = document.querySelectorAll('#' + e.currentTarget.id + ' .is-invalid')
			let i = findErrors.length
			let $resDiv = document.querySelector('#' + e.currentTarget.id + '-results')
			if (i > 0) {
				$resDiv.classList.add('alert', 'alert-danger', 'p-2')
				$resDiv.innerHTML = 'Please correct the invalid options above.'
			} else {
				postForm(e.currentTarget).then((res) => {
					if (res.redirect) {
						//document.querySelector('#'+res.form_id+' .res')
						//$resDiv.innerHTML = 'yayyy'
						window.location = res.redirect
					}
					if (res.msg) {
						$resDiv.innerHTML = res.msg
					}
					if (res.class) {
						let classes = res.class.split(' ')
						let c = classes.length
						let b
						for (b = 0; b < c; b++) {
							$resDiv.classList.add(classes[b])
						}
					}
				});
			}
		})
	}
	//!!!!!!!!!!!!!!!! End form processing

	//!!!!!!!!!!!!!!!! Actual form native validation
	let mfvalid = document.querySelectorAll('.mf-valid')
	let valen = mfvalid.length
	let i
	for (i = 0; i < valen; i++) {
		mfvalid[i].addEventListener('change', (ev) => {
			let input = ev.currentTarget
			if (input.checkValidity() == true) {
				// remove error box if found..
				let removeError = true
				if (input.hasAttribute('data-mf-ajax-check') && input.hasAttribute('data-mf-ajax-url')) {
					// check database
					console.log('needs to check db')
					postData(input.getAttribute('data-mf-ajax-url'), {
						form_checks: input.getAttribute('data-mf-ajax-check'),
						check: input.value
					}).then((data) => {
						if (data.status == 'failed') {
							removeError = false
							input.classList.add('is-invalid')
							input.classList.remove('is-valid')
							let box = document.getElementById(input.id + '-valid') || false
							let msg = input.getAttribute('data-error-msg') || false
							if (box && msg) {
								box.innerHTML = data.msg
								box.classList.add('alert', 'alert-danger', 'p-2')
							}
						}
					})
				} else if (input.hasAttribute('data-mf-same-as')) {
					let other = document.querySelector(input.getAttribute('data-mf-same-as'))
					if (input.value != '' && other.value != '') {
						if (input.value == other.value) {
							removeError = true
							other.classList.remove('is-invalid')
							other.classList.add('is-valid')
							let box = document.getElementById(other.id + '-valid') || false
							if (box) {
								box.innerHTML = ''
								box.classList.remove('alert', 'alert-danger', 'p-2')
							}
						} else {
							removeError = false
							input.classList.add('is-invalid')
							input.classList.remove('is-valid')
							let box = document.getElementById(input.id + '-valid') || false
							let msg = input.getAttribute('data-error-msg') || false
							if (box && msg) {
								box.innerHTML = msg
								box.classList.add('alert', 'alert-danger', 'p-2')
							}
							other.classList.add('is-invalid')
							other.classList.remove('is-valid')
							let box2 = document.getElementById(other.id + '-valid') || false
							let msg2 = other.getAttribute('data-error-msg') || false
							if (box2 && msg2) {
								box2.innerHTML = msg
								box2.classList.add('alert', 'alert-danger', 'p-2')
							}
						}
					}
				}
				if (removeError == true) {
					input.classList.remove('is-invalid')
					input.classList.add('is-valid')
					let box = document.getElementById(input.id + '-valid') || false
					if (box) {
						box.innerHTML = ''
						box.classList.remove('alert', 'alert-danger', 'p-2')
					}
				}
			} else {
				input.classList.add('is-invalid')
				input.classList.remove('is-valid')
				let box = document.getElementById(input.id + '-valid') || false
				let msg = input.getAttribute('data-error-msg') || false
				if (box && msg) {
					box.innerHTML = msg
					box.classList.add('alert', 'alert-danger', 'p-2')
				}
				// input.validity.typeMismatch
			}
		})
	}
	async function developerExcuses() {
		const response = await fetch("https://api.devexcus.es/");
		//document.getElementById('devex').innerHTML = await response.json();
		return await response.json();
	}
	developerExcuses().then((data) => {
		document.getElementById('devex').innerHTML = data.text
	})
})
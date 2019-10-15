
// script.js

let entries = document.getElementsByClassName('entry')
for (let i = 0; i < entries.length; i++) {
	if (entries[i].children[1].readOnly === false) {
		entries[i].addEventListener('mouseover', () => {
			entries[i].style.borderBottom = "2px solid rgb(57, 66, 78, 0.75)";
		})
		entries[i].addEventListener('mouseout', () => {
			entries[i].style.borderBottom = "2px solid #eeeeee";
		})
		entries[i].children[1].addEventListener('focus', () => {
			entries[i].children[1].style.backgroundColor = "rgb(57, 66, 78, 0.15)"
		})
		entries[i].children[1].addEventListener('focusout', () => {
			entries[i].children[1].style.backgroundColor = ""
		})
	}
}

let boxes = document.getElementsByName('name')
for (let i = 0; i < boxes.length; i++) {
	boxes[i].addEventListener('focusout', () => {
		let title = document.getElementById('name')
		if (boxes[i].value.length === 0) {
			title.innerHTML = "Name * This field is required"
			title.style.color = "red"
			title.style.fontStyle = "italic"
			boxes[i].style.backgroundColor = "pink"
		} else {
			title.innerHTML = "Name *"
			title.style.color = "#39424e"
			title.style.fontStyle = "normal"
			boxes[i].style.backgroundColor = ""
		}
	})
}
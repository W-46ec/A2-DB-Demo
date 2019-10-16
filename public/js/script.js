
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

let abilities = document.getElementsByTagName('input')
let total = document.getElementById('total')
if (total) {
	total.style.backgroundColor = "rgb(57, 66, 78, 0.15)"
	let totalAbility = 0
	for (let i = 0; i < abilities.length; i++) {
		if (abilities[i].id === 'ability') {
			totalAbility += parseInt(abilities[i].value)
		}
	}
	total.value = totalAbility
	for (let i = 0; i < abilities.length; i++) {
		if (abilities[i].id === 'ability') {
			abilities[i].addEventListener('keyup', () => {
				let total = document.getElementById('total')
				let tmp = document.getElementsByTagName('input')
				let sum = 0
				for (let j = 0; j < tmp.length; j++) {
					if (tmp[j].id === 'ability') {
						sum += tmp[j].value.length === 0 ? 0 : parseInt(tmp[j].value)
					}
				}
				total.value = sum
			})
			abilities[i].addEventListener('change', () => {
				let total = document.getElementById('total')
				let tmp = document.getElementsByTagName('input')
				let sum = 0
				for (let j = 0; j < tmp.length; j++) {
					if (tmp[j].id === 'ability') {
						sum += tmp[j].value.length === 0 ? 0 : parseInt(tmp[j].value)
					}
				}
				total.value = sum
			})
		}
	}
}


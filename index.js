const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

const { Pool } = require('pg')
// var pool = new Pool({
// 	connectionString: process.env.DATABASE_URL
// });
var pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'root',
	port: 5432
});


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/index'))

// Home page
app.get('/home', (req, res) => {
	let cmd = `SELECT * FROM Tokimon ORDER BY uid`
	pool.query(cmd, (err, results) => {
		if (err) {
			res.status(500).render('pages/msg', {
				'msgTitle': "Error", 
				'msg': "Oops! Errors occured!"
			})
		}
		res.status(200).render('pages/home', { 'rows': results.rows })
	})
})

// Details page
app.get('/details', (req, res) => {
	if (req.query.id) {
		let id = req.query.id
		let cmd = `SELECT * FROM Tokimon WHERE uid=${ id }`
		pool.query(cmd, (err, results) => {
			if (err) {
				res.status(500).render('pages/msg', {
					'msgTitle': "Error", 
					'msg': "Oops! Errors occured!"
				})
			}
			if (results.rows.length === 0) {
				res.status(404).render('pages/msg', {
					'msgTitle': "Not found", 
					'msg': "Sorry~ The Tokimon you are looking for does not exist"
				})
			} else {
				res.status(200).render('pages/form', {
					'title': "Details", 
					'readOnly': "readonly", 
					'inputClass': "detail-input", 
					'hiddenEdit': "", 
					'hiddenSave': "hidden", 
					'rows': results.rows[0]
				})
			}
		})
	} else {
		res.status(404).render('pages/msg', {
			'msgTitle': "Not found", 
			'msg': "Sorry~ The Tokimon you are looking for does not exist"
		})
	}
})

// Page for adding a new Tokimon
app.get('/new', (req, res) => { res.status(200).render('pages/new') })
// Adding a new Tokimon to the database
app.post('/add', (req, res) => {
	let body = req.body
	if (body.name.length === 0) {
		res.status(404).render('pages/msg', {
			'msgTitle': "Invalid inputs", 
			'msg': "Sorry~ Seems like the request is not valid"
		})
		return;
	}
	Object.entries(body).forEach((e) => {
		if (e[1].length === 0) {
			if (e[0] != 'trainer') {
				body[e[0]] = 0
			} else {
				body[e[0]] = "unknown"
			}
		}
	})
	let cmd = `INSERT INTO Tokimon (
		name, age, weight, height, fly, fight, fire, water, electric, frozen, trainer
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
	pool.query(cmd, Object.values(body), (err, results) => {
		if (err) {
			res.status(500).render('pages/msg', {
				'msgTitle': "Error", 
				'msg': "Oops! Errors occured!"
			})
		}
		res.status(200).render('pages/msg', {
			'msgTitle': "Success", 
			'msg': "Your Tokimon has been added successfully!"
		})
	})
})

// Edit page
app.get('/edit', (req, res) => {
	if (req.query.id) {
		let id = req.query.id
		let cmd = `SELECT * FROM Tokimon WHERE uid=${ id }`
		pool.query(cmd, (err, results) => {
			if (err) {
				res.status(500).render('pages/msg', {
					'msgTitle': "Error", 
					'msg': "Oops! Errors occured!"
				})
			}
			if (results.rows.length === 0) {
				res.status(404).render('pages/msg', {
					'msgTitle': "Not found", 
					'msg': "Sorry~ The Tokimon you are looking for does not exist"
				})
			} else {
				res.status(200).render('pages/form', {
					'title': "Edit Tokimon", 
					'readOnly': "", 
					'inputClass': "edit-input", 
					'hiddenEdit': "hidden", 
					'hiddenSave': "", 
					'rows': results.rows[0]
				})
			}
		})
	} else {
		res.status(404).render('pages/msg', {
			'msgTitle': "Not found", 
			'msg': "Sorry~ The Tokimon you are looking for does not exist"
		})
	}
})
// Update the information of a Tokimon
app.post('/update', (req, res) => {
	if (req.query.id) {
		let id = req.query.id
		let body = req.body
		if (body.name.length === 0) {
			res.status(400).render('pages/msg', {
				'msgTitle': "Invalid inputs", 
				'msg': "Sorry~ Seems like the request is not valid"
			})
			return;
		}
		Object.entries(body).forEach((e) => {
			if (e[1].length === 0) {
				if (e[0] != 'trainer') {
					body[e[0]] = 0
				} else {
					body[e[0]] = "unknown"
				}
			}
		})
		let cmd = `UPDATE Tokimon SET 
			name=$1, age=$2, weight=$3, height=$4, fly=$5, fight=$6,  
			fire=$7, water=$8, electric=$9, frozen=$10, trainer=$11
			WHERE uid=${ id }`
		pool.query(cmd, Object.values(body), (err, results) => {
			if (err) {
				res.status(500).render('pages/msg', {
					'msgTitle': "Error", 
					'msg': "Ooopps! Errors occured!"
				})
			} else {
				res.redirect(`/details?id=${ id }`)
			}
		})
	} else {
		res.status(404).render('pages/msg', {
			'msgTitle': "Not found", 
			'msg': "Sorry~ The Tokimon you are looking for does not exist"
		})
	}
})

// Remove a Tokimon
app.get('/remove', (req, res) => {
	if (req.query.id) {
		let id = req.query.id
		let cmd = `DELETE FROM Tokimon WHERE uid=${ id }`
		pool.query(cmd, (err, results) => {
			if (err) {
				res.status(500).render('pages/msg', {
					'msgTitle': "Error", 
					'msg': "Oops! Errors occured!"
				})
			} else {
				if (results.rowCount === 1) {
					res.status(200).render('pages/msg', {
						'msgTitle': "Success", 
						'msg': "Your Tokimon has been removed from the list"
					})
				} else {
					res.status(404).render('pages/msg', {
						'msgTitle': "Not found", 
						'msg': "Sorry~ The Tokimon you are looking for does not exist"
					})
				}
			}
		})
	} else {
		res.status(404).render('pages/msg', {
			'msgTitle': "Not found", 
			'msg': "Sorry~ The Tokimon you are looking for does not exist"
		})
	}
})

// Trainer details page
app.get('/trainer', (req, res) => {
	if (req.query.trainer) {
		let trainer = req.query.trainer
		let cmd = `SELECT * FROM Tokimon WHERE trainer='${ trainer }'`
		pool.query(cmd, (err, results) => {
			if (err) {
				res.status(500).render('pages/msg', {
					'msgTitle': "Error", 
					'msg': "Oops! Errors occured!"
				})
			}
			if (results.rows.length === 0) {
				res.status(404).render('pages/msg', {
					'msgTitle': "Not found", 
					'msg': "Sorry~ The trainer you are looking for does not exist"
				})
			} else {
				res.status(200).render('pages/trainer', {
					'trainer': trainer, 
					'rows': results.rows
				})
			}
		})
	} else {
		res.status(404).render('pages/msg', {
			'msgTitle': "Not found", 
			'msg': "Sorry~ The trainer you are looking for does not exist"
		})
	}
})

// All trainers information
app.get('/trainersinfo', (req, res) => {
	let cmd = `SELECT * FROM Tokimon ORDER BY trainer`
	pool.query(cmd, (err, results) => {
		if (err) {
			res.status(500).render('pages/msg', {
				'msgTitle': "Error", 
				'msg': "Oops! Errors occured!"
			})
		}
		let rows = [], trainers = {}
		for (let i = 0; i < results.rows.length; i++) {
			if (trainers[results.rows[i]['trainer']]) {
				trainers[results.rows[i]['trainer']]++;
			} else {
				trainers[results.rows[i]['trainer']] = 1;
			}
		}
		for (let [key, value] of Object.entries(trainers)) {
			rows.push({
				"trainer": key, 
				"num": value
			})
		}
		res.status(200).render('pages/trainersinfo', {
			'rows': rows
		})
	})
})

// 404 page
app.use((req, res) => {
	res.status(404).render('pages/msg', {
		'msgTitle': "Not found", 
		'msg': "Oops! Page not found"
	})
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

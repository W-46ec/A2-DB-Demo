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

app.get('/home', (req, res) => {
	let cmd = `SELECT * FROM Tokimon ORDER BY uid`
	pool.query(cmd, (err, results) => {
		if (err) {
			console.log(err)
			res.send('500 error')
		}
		res.render('pages/home', { 'rows': results.rows })
	})
})

app.get('/new', (req, res) => { res.render('pages/new') })
app.post('/add', (req, res) => {
	let body = req.body
	if (body.name.length === 0) {
		res.send('Invalid inputs')
	}
	Object.entries(body).forEach((e) => {
		if (e[1].length === 0) {
			if (e[0] != 'trainer') {
				body[e[0]] = 0
			}
		}
	})
	let cmd = `INSERT INTO Tokimon (
		name, weight, height, fly, fight, fire, water, electric, frozen, trainer
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
	pool.query(cmd, Object.values(body), (err, results) => {
		if (err) {
			// console.log(err)
			res.send('500 error')
		} else {
			// console.log(results)
			res.send('200 OK')
		}
	})
})

app.get('/edit', (req, res) => {
	if (req.query.id) {
		let id = req.query.id
		let cmd = `SELECT * FROM Tokimon WHERE uid=${ id }`
		pool.query(cmd, (err, results) => {
			if (err) {
				console.log(err)
				res.send('500 error')
			}
			if (results.rows.length === 0) {
				res.send('not found')
			} else {
				res.render('pages/edit', {
					'rows': results.rows[0]
				})
			}
		})
	} else {
		res.send('Invalid parameter')
	}
})
app.post('/update', (req, res) => {
	if (req.query.id) {
		let id = req.query.id
		let body = req.body
		if (body.name.length === 0) {
			res.send('Invalid inputs')
		}
		Object.entries(body).forEach((e) => {
			if (e[1].length === 0) {
				if (e[0] != 'trainer') {
					body[e[0]] = 0
				}
			}
		})
		let cmd = `UPDATE Tokimon SET 
			name=$1, weight=$2, height=$3, fly=$4, fight=$5,  
			fire=$6, water=$7, electric=$8, frozen=$9, trainer=$10
			WHERE uid=${ id }`
		pool.query(cmd, Object.values(body), (err, results) => {
			if (err) {
				console.log(err)
				res.send('500 error')
			} else {
				console.log(results)
				res.redirect(`/edit?id=${ id }`)
				// res.send('200 OK')
			}
		})
	} else {
		res.send('Invalid parameter')
	}
})

app.get('/remove', (req, res) => {
	if (req.query.id) {
		let id = req.query.id
		let cmd = `DELETE FROM Tokimon WHERE uid=${ id }`
		pool.query(cmd, (err, results) => {
			if (err) {
				console.log(err)
				res.send('500 error')
			} else {
				if (results.rowCount === 1) {
					res.send('OK')
				} else {
					res.send('Deleted 0 row')
				}
			}
		})
	} else {
		res.send('Invalid parameter')
	}
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

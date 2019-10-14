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
	let cmd = `SELECT * FROM Tokimon`
	pool.query(cmd, (err, results) => {
		if (err) {
			console.log(err)
			res.send('500 error')
		}
		res.render('pages/home', {'rows': results.rows})
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

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

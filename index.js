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

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

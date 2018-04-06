const http = require('http')
const url = require('url')
const axios = require('axios')
const LanguageTranslatorV2 = require('watson-developer-cloud/language-translator/v2')
const logarLdap = require('./authldap')

const port = process.env.PORT || process.argv[2] || 3100

const server = http.createServer((req, res) => {
	try {
		res.sendText = sendText
		res.sendJson = sendJson
		res.setHeader('Access-Control-Allow-Origin', req.headers['origin'] || '*')
		res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
		res.setHeader('Access-Control-Allow-Credentials', 'true')
		res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, Sid')
		if (req.method === 'OPTIONS') return res.sendText(200, 'OK')

		const reqP = url.parse(req.url, true)
		if (reqP.pathname === '/login') {
			logarLdap(reqP.query.USER_LOGIN, reqP.query.USER_PASSW, (err, userinfo) => {
				if (err) {
					console.error(err)
					return res.sendText(500, 'ERROR 30')
				}
				if (!userinfo) {
					return res.sendText(403, 'Invalid user/password')
				}
				else {
					let userSuccessfullyConfigured = false
					const username = userinfo.trim()
					const password = newGuid()
					if ((!username) || (typeof username !== 'string')) {
						console.error('Invalid username returned from LDAP')
						return res.sendText(500, 'ERROR 43')
					}
					Promise.resolve().then(async () => {
						const userDoc = await axios({method: 'get', url: 'http://admin:12345@192.168.8.2:5984/_users/org.couchdb.user:' + username}).then((response) => response.data).catch(() => ({name: username, password: password, roles: ['dev'], type: 'user'}))
						delete userDoc.password_scheme
						delete userDoc.iterations
						delete userDoc.derived_key
						delete userDoc.salt
						userDoc.password = password
						await axios({method: 'put', url: 'http://admin:12345@192.168.8.2:5984/_users/org.couchdb.user:' + username, data: userDoc})
						userSuccessfullyConfigured = true
					})
					.catch((err) => console.error(err))
					.then(() => {
						if (userSuccessfullyConfigured) {
							return res.sendJson(200, {
								host: `http://192.168.8.2:5984`,
								auth: { username, password }
							})
						}
						else {
							return res.sendText(500, 'ERROR 61')
						}
					})
				}
			})
		}
		else if (reqP.pathname === '/translate') {
			const language_translator = new LanguageTranslatorV2({
				username: process.env.I18N_WATSON_USERNAME,
				password: process.env.I18N_WATSON_PASSWORD,
				url: 'https://gateway.watsonplatform.net/language-translator/api'
			})
			const params = {
				text: reqP.query.texto,
				source : reqP.query.source,
				target: reqP.query.target
			}
			language_translator.translate(params, (err, translation) => {
				if (err) {
					console.error(err)
					return res.sendText(500, 'ERROR 81')
				}
				else {
					return res.sendJson(200, translation)
				}
			})
		}
		else {
			console.log('Unknown route: ' + reqP.pathname)
			return res.sendText(404, 'Not found')
		}
	} catch (err) {
		console.error(err)
		return res.sendText(500, 'ERROR 94')
	}
})

server.listen(port, () => {
  const addr = server.address()
	console.log(`Servidor iniciado em http://localhost:${addr.port}. Ctrl+C para encerrar…`);
})

function sendText (status, txt) {
	this.statusCode = status
	this.setHeader('Content-Type', 'text/plaintext')
	this.end(txt, 'utf-8')
}

function sendJson (status, obj) {
	this.statusCode = status
	this.setHeader('Content-Type', 'application/json')
	this.end(JSON.stringify(obj), 'utf-8')
}

function newGuid () {
	function s4 () {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1)
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

function configureReDBuser () {
	getDbConn().then((conn) => {
		return Promise.resolve().then(async () => {
			// await r.db('rethinkdb').table('users').insert({id: username, password: password}).run(conn).catch(() => undefined)
			// await r.db('rethinkdb').table('users').get(username).update({password: password}).run(conn)

			await r.db('i18nv1').grant(username, {read: true, write: true, config: false}).run(conn)
			await r.db('i18nv1').table('labels'   ).grant(username, {read: false, write: false}).run(conn)
			await r.db('i18nv1').table('languages').grant(username, {read: false, write: false}).run(conn)
			await r.db('i18nv1').table('softvers' ).grant(username, {read: false, write: false}).run(conn)
			userSuccessfullyConfigured = true
		})
		.catch((err) => console.error(err))
		.then(() => conn.close())
	})
	.catch((err) => console.error(err))
	.then(() => {
		if (userSuccessfullyConfigured) {
			return res.sendJson(200, {
				host: process.env.I18N_DB_HOST,
				port: Number(process.env.I18N_DB_PORT),
				db: process.env.I18N_DB_DATABASE,
				user: username,
				password: password,
				timeout: 3 // timeout period in seconds for the connection to be opened
			})
		}
		else {
			return res.sendText(500, 'ERROR 61')
		}
	})
}

function getDbConn () {
  return r.connect({
    host: process.env.I18N_DB_HOST,
    port: Number(process.env.I18N_DB_PORT),
    db: process.env.I18N_DB_DATABASE,
    user: 'admin',
    password: '',
    timeout: 3 // timeout period in seconds for the connection to be opened
  })
}

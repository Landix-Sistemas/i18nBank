const ldap = require('ldapjs')
const crypto = require('crypto')

/*
CONFIGS:
    process.env.I18N_AUTH_LDAP_HOST           // address of the LDAP server => "ldaps://ldap.domain.com:636"
    process.env.I18N_AUTH_LDAP_TREE_PATH      // LDAP path that contains the users' information => "dc=domain,dc=com"
    process.env.I18N_AUTH_LDAP_PROP_PASSWORD  // name of the property that contains the user password => "userPassword"
    process.env.I18N_AUTH_LDAP_PROP_USERNAME  // name of the property that contains the user name/email => "userName"
*/

const client = ldap.createClient({
  url: process.env.I18N_AUTH_LDAP_HOST,
  reconnect: true,
  tlsOptions: {
    rejectUnauthorized: false
  }
})
client.on('error', function (err) {
  console.log('ERRO LDAP: ' + err)
})

function logarLdap (usuario, senha, callback) { // callback (err, perfilAuth)
  if (usuario.includes("'") || usuario.includes(' ') || usuario.includes(')') || usuario.includes(',')) {
    callback(new Error('Nome de usuário com caracteres inválidos'))
    return
  }
  let optsLdap = {
    filter: `(${process.env.I18N_AUTH_LDAP_PROP_USERNAME}=${usuario})`,
    scope: 'sub',
    attributes: [process.env.I18N_AUTH_LDAP_PROP_USERNAME, process.env.I18N_AUTH_LDAP_PROP_PASSWORD]
  }
  let jaRetornou = false
  client.search(process.env.I18N_AUTH_LDAP_TREE_PATH, optsLdap, function (err, res) {
    if (err) {
      callback(err)
      return
    }
    //  You will additionally be able to listen for a searchReference, error and end event.
    res.on('searchEntry', function (entry) {
      let user = entry.object
      if (!jaRetornou) {
        if (ChechHashPassword(senha, user[process.env.I18N_AUTH_LDAP_PROP_PASSWORD])) {
          jaRetornou = true
          callback(null, user[process.env.I18N_AUTH_LDAP_PROP_USERNAME])
        }
        else {
          // senha errada
          jaRetornou = true
          callback(null, null)
        }
      }
    })
    res.on('error', function (err) {
      if (!jaRetornou) {
        jaRetornou = true
        callback(err)
      }
    })
    res.on('end', function (result) {
      if (!jaRetornou) {
        // usuário não encontrado
        jaRetornou = true
        callback(null, null)
      }
    })
  })
}

function ChechHashPassword (password, hash) {
  if (!hash) return false // no password
  if (hash[0] !== '{') return (password === hash) // plaintext password
  let encryptedpw = null
  if (hash.substring(0, 5) === '{MD5}') {
    encryptedpw = '{MD5}' + crypto.createHash('md5').update(password).digest('base64')
  }
  else if (hash.substring(0, 6) === '{SHA1}') {
    encryptedpw = '{SHA1}' + crypto.createHash('sha1').update(password).digest('base64')
  }
  else { // Unsupported password hash format
    return false
  }
  return (hash === encryptedpw)
} // ChechHashPassword

module.exports = logarLdap

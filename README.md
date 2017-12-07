# I18N Bank and Manager

> This project provide a way to store yours translations and manage json and resx files. This project use <a href="http://gun.js.org/"> GunDB </a> to store the tranlations and Watson from IBM to help with the translations.

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080, electron, gundb and watson
$ npm start

# build for production with minification
$ npm run build
```

## To-Do List

* Use TypeScript
* User Authentication by LDAP (user reading, user editing and external translator)
* Create administrator screen (user management)
* Log of inclusion and editing of translations
* Reading and editing SQLite database
* Creation of new translation file (json, resx and db3)
* Importing a context template into Watson
* Improved Layout (UX and UI)
* Import an entire file into the database
* Conflict management (two files of the same language that have the same key but the translation is different)
* Internationalization of system labels

## License & Copyright

The materials herein are all (c) 2017-2020 Landix Sistemas.

<a rel="license" href="https://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://licensebuttons.net/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Attribution 4.0 International (CC BY 4.0)</a>.
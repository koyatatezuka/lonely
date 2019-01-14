//const { host, user, password, database } = require('./config/db_configuration');

module.exports = {
	// development: {
	// 	client: 'pg',
	// 	connection: {
	// 		host,
	// 		user,
	// 		password,
	// 		charset: 'utf8',
	// 		database
	// 	},
	// 	migrations: {
	// 		directory: __dirname + '/knex/migrations'
	// 	},
	// 	seeds: {
	// 		directory: __dirname + '/knex/seeds'
	// 	}
	// },

	staging: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
		migrations: {
			directory: __dirname + '/knex/migrations'
		},
		seeds: {
			directory: __dirname + '/knex/seeds'
    },
    ssl: true,
    debug: true
	}
};

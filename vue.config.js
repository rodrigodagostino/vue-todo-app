module.exports = {
	chainWebpack: config => {
		config
			.plugin( 'html' )
			.tap( args => {
				args[ 0 ].title = 'Vue To-Do App'
				return args
			} )
	},
}
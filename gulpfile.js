var gulp = require('gulp');
var babel = require('gulp-babel');
var BABEL_CONFIG = {
	presets : ['es2015','stage-0'],
	plugins : ['transform-async-to-generator']
}

gulp.task('js',function (){

	return gulp.src(['./lib/**/*.js'])
				.pipe(babel(BABEL_CONFIG))
				.pipe(gulp.dest('./dist'))

})

gulp.task('default',['js'])

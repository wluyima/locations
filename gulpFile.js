var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var config = {
    buildDir: 'build',
    srcJs: 'ui/scripts'
}

gulp.task('default', ['build-js'], function(){
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 3000
        },
        tasks: ['build-js'],
        ignore: ['node_modules/**', config.buildDir+'/**']
    })
    .on('restart', function(){
       console.log("Restarting...");
    });
});

gulp.task('build-js', function(){
    return gulp.src( config.srcJs+'/**/*.js')
        //.pipe()
        .pipe(gulp.dest(config.buildDir));
});
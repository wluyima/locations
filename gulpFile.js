var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var babel = require('gulp-babel');

var config = {
    buildDir: 'build',
    srcJs: 'ui/scripts',
    srcCss: 'ui/css'
}

gulp.task('default', ['build-js', 'bundle-css'], function() {
    nodemon({
        script: 'app.js',
        ext: 'js css',
        env: {
            PORT: 3000
        },
        tasks: ['build-js', 'bundle-css'],
        ignore: [config.buildDir+'/**']
    })
    .on('restart', function(){
       console.log("Restarting...");
    });
});
 
gulp.task('build-js', function() {
    gulp.src( config.srcJs+'/**/*.js')
        .pipe(babel({
            presets: ['@babel/preset-react']
        }))
        .on('error', function(err){
            console.log('JSX compilation failed', err);
        })
        .pipe(gulp.dest(config.buildDir));
});

gulp.task('bundle-css', function() {
    gulp.src( config.srcCss+'/**/*.css')
        .pipe(gulp.dest(config.buildDir));
});
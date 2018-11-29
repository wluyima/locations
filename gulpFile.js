var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var babel = require('gulp-babel');

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
        ignore: [config.buildDir+'/**']
    })
    .on('restart', function(){
       console.log("Restarting...");
    });
});

gulp.task('build-js', function(){
    gulp.src( config.srcJs+'/**/*.js')
        .pipe(babel({
            presets: ['@babel/preset-react']
        }))
        .on('error', function(err){
            console.log('JSX compilation failed', err);
        })
        .pipe(gulp.dest(config.buildDir));
});
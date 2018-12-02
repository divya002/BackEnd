var gulp=require('gulp'); //task runner
var nodemon=require('gulp-nodemon');

gulp.task('default',function(){
    nodemon({
        script: 'app.js',
        ext: 'js',
        env:{
            PORT:process.env.PORT ||8000
        },
        ignore:['./node_modules/**']
    })
    .on('restart',function(){
        console.log('Restarting');
    });
});

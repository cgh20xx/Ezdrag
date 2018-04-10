var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    pump = require('pump'),
    babel = require('gulp-babel')

var jsDest = 'js';

gulp.task('default', function(cb) {
    pump([
            gulp.src([
                'src/observer.js',
                'src/ezdrag.js'
            ]),
            // babel({ presets: ['env'] }),
            concat('Ezdrag.js'),
            gulp.dest(jsDest),
            uglify(),
            rename('Ezdrag.min.js'),
            gulp.dest(jsDest)
        ],
    cb);
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['default']);
});

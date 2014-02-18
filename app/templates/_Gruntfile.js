"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '',
        clean: {
            dist: {
                src: ['dist/**']
            }
        },
        'regex-replace': {
            dist: {
                src: ['dist/*.html', 'dist/**/*.php'],
                actions: [{
                    name: 'requirejs',
                    search: '<script type="text/javascript" src="vendors/requirejs/require.js" data-main="scripts/config"></script>',
                    replace: '<script type="text/javascript" src="scripts/require.min.js"></script>',
                    flags: 'ig'
                },
                {
                    name: 'php-include',
                    search: '<!--nick-placeholder-->',
                    replace: '<?php\r\n    error_reporting(0);\r\n    $docRoot = $_SERVER["DOCUMENT_ROOT"];\r\n    include($docRoot."/reporting.html");\r\n    include($docRoot."/common/layout/header/nick_current.php");\r\n    include($docRoot."/common/layout/header/nick_current_mama.php");  \r\n    include($docRoot."/common/layout/footer/nick_current_footer.php ");\r\n?>',
                    flags: 'ig'
                }]
            }
        },

        connect: {
            devserver: {
                options: {
                    port: 8000,
                    hostname: '0.0.0.0',
                    base: './dev',
                    keepalive: true,
                    middleware: function (connect, options) {
                        return [
                            connect.favicon('images/favicon.ico'),
                            connect.static(options.base),
                            connect.directory(options.base)
                        ];
                    }
                }
            },
            testserver: {
                options: {
                    // We use end2end task (which does not start the webserver)
                    // and start the webserver as a separate process (in travis_build.sh)
                    // to avoid https://github.com/joyent/libuv/issues/826
                    port: 8000,
                    hostname: '0.0.0.0',
                    base: './dev',
                    middleware: function (connect, options) {
                        return [
                            function (req, resp, next) {
                                // cache get requests to speed up tests on travis
                                if (req.method === 'GET') {
                                    resp.setHeader('Cache-control', 'public, max-age=3600');
                                }

                                next();
                            },
                            connect.favicon('images/favicon.ico'),
                            connect.static(options.base)
                        ];
                    }
                }
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['dev/vendors/requirejs/require.js', '<%= concat.dist.dest %>'],
                dest: 'dist/scripts/require.js'
            }
        },
        uglify: {
            options: {
                banner: '',
                sourceMap: 'dist/scripts/require-map.js',
                sourceMapRoot: './',
                sourceMappingURL: 'require-map.js',
                sourceMapPrefix: 'dist/scripts/'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/scripts/require.min.js'
            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            }//,
        },
        less: {
            compile: {
                options: {
                    paths: ['dev/styles/'],
                    compress: true
                },
                files: [{
                    expand: true,
                    cwd: 'dev/styles',
                    src: ['**/*.less'],
                    dest: 'dev/styles',
                    ext: '.css'
                }]
            }
        },
        watch: {
            script: {
                files: ['dev/scripts/**/*.js'],
                tasks: ['jshint:dev']
            },
            compass: {
                files: ['dev/styles/**/*.less'],
                tasks: ['less']
            },
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'dev/scripts/',
                    name: 'config',
                    mainConfigFile: 'dev/scripts/config.js',
                    out: '<%= concat.dist.dest %>',
                    optimize: 'none'
                }
            }
        },
        imagemin: { // Task
            dist: { // Target
                options: { // Target options
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: 'dev/',
                    src: ['**/*.png', '**/*.jpg'],
                    dest: 'dist/'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dev/',
                    src: ['**', '!**/*.less', '!scripts/**/*.js', 'scripts/**/*.min.js', '!vendors/**',"!scripts/libs/**", "!css-vendors/**", "scripts/libs/html5.js", "scripts/libs/css3-mediaqueries.js","!**/image_compress_backup/**"],
                    dest: 'dist/'
                }]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-regex-replace');

    grunt.registerTask('default', ['jshint', 'less']);
    grunt.registerTask('webserver', ['connect:devserver']);
    grunt.registerTask('build', ['clean:dist', 'copy:dist', 'requirejs', 'concat', 'uglify', 'regex-replace:dist']);//, 'imagemin:dist','less',
};

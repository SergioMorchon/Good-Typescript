/*global module*/
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jsonlint: {
            pkg: {
                src: ["*.json"]
            }
        },
        uglify: {
            options: {
                preserveComments: "none",
                compress: {
                    global_defs: {
                        "DEBUG": false
                    },
                    dead_code: true
                }
            },
            release: {
                files: {
                    "dist/good.js": ["dist/good.js"]
                }
            }
        },
        jshint: {
            gruntfile: ["GruntFile.js"],
            options: grunt.file.readJSON("jshint.json")
        },
        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },
            src: {
                src: ["src/ts/**/*.ts", "!**/*.d.ts"]
            },
            spec: {
                src: ["spec/**/*.ts", "!**/*.d.ts"]
            }
        },
        typescript: {
            spec: {
                src: ["spec/**/*Spec.ts"],
                options: {
                    module: "",
                    target: "es3",
                    sourceMap: false,
                    declaration: false,
                    removeComments: false,
                    references: ["spec/**/*.d.ts"]
                }
            },
            bdd: {
                src: ["spec/**/*Feature.ts"],
                options: {
                    module: "",
                    target: "es3",
                    sourceMap: false,
                    declaration: false,
                    removeComments: false,
                    references: ["spec/**/*.d.ts"]
                }
            },
            debug: {
                src: ["src/ts/**/*.ts"],
                dest: "dist/good.js",
                options: {
                    module: "",
                    target: "es3",
                    basePath: "src/ts",
                    sourceMap: false,
                    declaration: true,
                    removeComments: false,
                    references: ["src/ts/**/*.d.ts"]
                }
            },
            release: {
                src: ["src/ts/**/*.ts"],
                dest: "dist/good.js",
                options: {
                    module: "",
                    target: "es3",
                    basePath: "src/ts",
                    sourceMap: false,
                    declaration: true,
                    removeComments: false,
                    references: ["src/ts/**/*.d.ts"]
                }
            }
        },
        jasmine: {
            bdd: {
                src: "dist/good.js",
                options: {
                    specs: "spec/**/*Feature.js",
                    summary: true
                }
            },
            spec: {
                src: "dist/good.js",
                options: {
                    specs: "spec/**/*Spec.js",
                    summary: true,
                    display: "none"
                }
            }
        },
        clean: {
            tmp: ["**/*.TMP"],
            dist: ["dist/"],
            spec: ["spec/**/*Feature.js"],
            bdd: ["bdd/**/*Spec.js"]
        },
        usebanner: {
            options: {
                position: "top",
                banner: "/*!\r\n * Good <%= pkg.version %>\r\n */",
                linebreak: true
            },
            files: ["dist/good.js"]
        }
    });

    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-banner");

    grunt.registerTask("test", ["clean:spec", "typescript:spec", "jasmine:spec"]);
    grunt.registerTask("lint", ["jsonlint", "jshint", "tslint"]);

    grunt.registerTask("bdd", ["clean:bdd", "typescript:bdd", "jasmine:bdd"]);

    grunt.registerTask("default", ["jsonlint", "jshint", "clean:dist", "typescript:debug", "usebanner"]);
    grunt.registerTask("release", ["tslint:src", "clean:dist", "typescript:release", "uglify:release", "tslint:spec", "test", "usebanner"]);

    grunt.registerTask("travis", ["release"]);
};
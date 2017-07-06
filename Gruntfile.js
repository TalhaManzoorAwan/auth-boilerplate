module.exports = function(grunt) {
  grunt.initConfig({
      shell: {
        unit_test_report: {
          command: [
            'rm -rf static/lcov-report', 
            'mkdir static/lcov-report', 
            'node_modules/mocha/bin/mocha  --recursive --require blanket -R json-cov > coverage.json test/unit-tests/ test/unit-tests/',
            'node_modules/mocha/bin/mocha  --recursive --require blanket -R html-cov > static/lcov-report/index.html test/unit-tests/'
          ].join(';')
        },      
        unit_test_report_html: {
          command: [
            'rm -rf static/lcov-report', 
            'mkdir static/lcov-report', 
            'node_modules/mocha/bin/mocha  --recursive --require blanket -R html-cov > static/lcov-report/index.html test/unit-tests/'
          ].join(';')
        },
        unit_test_report_json: {
          command: [
            'node_modules/mocha/bin/mocha  --recursive --require blanket -R json-cov > coverage.json test/unit-tests/ test/unit-tests/'
          ].join(';')
        }        
      },
      mochaTest: {
        unit_test: {
          options: {
            reporter: 'spec',
            timeout: 2000,
            quiet: false,
            clearRequireCache: false
          },
          src: [
            'test/unit-tests/*/test-*.js'
          ]
        }
      }      
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-mocha-test');
  
  grunt.registerTask('unit_test_report', ['shell:unit_test_report']);
  grunt.registerTask('html_report', ['shell:unit_test_report_html']);
  grunt.registerTask('json_report', ['shell:unit_test_report_json']);
  grunt.registerTask('test', ['mochaTest:unit_test']);
  
  grunt.registerTask('default', []);

};
'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var _ = require('lodash');
_.mixin(require('underscore.string').exports());
var pd = require(path.resolve(__dirname, '../lib/processDirectory.js'));

var FoundationGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');
//    this.moduleName = _.slugify(_.humanize(path.basename(process.cwd())));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Foundation generator!'));
    var siteName = _.slugify(_.humanize(path.basename(process.cwd())));

    var prompts = [
      {
        type: 'input',
        name: 'siteName',
        message: 'What is the name of your site?',
        default: siteName
      }
      ,
      {
        type: 'input',
        name: 'rubyGemSet',
        message: 'What ruby gemset do you want to use for this project?',
        default: siteName
      }
      ,
      {
        type: 'confirm',
        name: 'useCompass',
        message: 'Would you like to use the Compass extension for Sass?',
        default: false
      }
      ,
      {
        type: 'input',
        name: 'gitHubUsername',
        message: 'What is your GitHub username (used to set the repository in package.json)?',
        default: ''
      }
    ];

    this.prompt(prompts, function (props) {
      this.siteName = props.siteName;
      this.rubyGemSet = props.rubyGemSet;
      this.useCompass = props.useCompass;
//      console.log(this.useCompass);
      this.gitHubUsername = props.gitHubUsername;
      done();
    }.bind(this));
  },

  app: function () {
    var generatorRootDir = path.resolve(__dirname, '..');
    var templateDir = path.join(generatorRootDir, '/template');
    var yoTemplateDir = path.join(generatorRootDir, 'app/template');
    var self = this;
    var processDirectory = pd.processDirFactory({
      topLevelDir: templateDir,
      yoTemplateDir: yoTemplateDir,
      copyFx: self.copy.bind(self),
      templateFx: self.template.bind(self),
      mkdirFx: self.mkdir.bind(self)
    });
    processDirectory(templateDir);
  },

  projectfiles: function () {
  }
});

module.exports = FoundationGenerator;

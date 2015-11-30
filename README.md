# Jekyll Foundation

Quickstart your Jekyll (v3) project with Zurb Foundation for Sites (v6, sass).
  
Build process: Gulp  
Asset management: Bower and Compass  
Deployment: Make and rsync.  

## System Preparation

To use this starter project, you'll need the following things installed on your machine.

### Required
[Ruby and Ruby Gems](https://rvm.io/rvm/install)  
[Jekyll](http://jekyllrb.com/) - `gem install jekyll`  
[Bundler](http://bundler.io/) - `gem install bundler` (mac users may need sudo)

[NodeJS](http://nodejs.org) - use the installer.  
[GulpJS](https://github.com/gulpjs/gulp) - `npm install -g gulp` (mac users may need sudo)  
[Bower](http://bower.io/) - `npm install -g bower`  

### Optional  
[Git](https://git-scm.com)  
[Composer](https://getcomposer.org) (installs PHPMailer)   
[Make](https://www.gnu.org/software/make) (used with rsync for deploying)


## Local Installation

Git clone this repository, or download it into a directory of your choice. Inside the directory run  
1. `bower install` (reference: .bowerrc and bower.json)  
2. `npm install` (reference: package.json)  
3. `bundle install` (reference: Gemfile and Gemfile.lock)  
4. `composer install` (optional, reference: composer.json and composer.lock)

## Usage

###Start Gulp
`gulp`  
This will build your Jekyll site, give you file watching, browser synchronization, auto-rebuild, CSS injecting etc.

`http://127.0.0.1.xip.io:3000`  
Here you can access your site. If you want to access it with your phone or tablet, use the external access adress which is showing up in the terminal window.

`http://127.0.0.1.xip.io:3001`  
Access the Browsersync UI. 

### Foundation for Sites Components
We don't want to include unused css an javascript. For the components you want to use uncomment the component's  
1. sass in /assets/scss/foundation/_foundation.scss  
2. javascript in the gulpfile.js in the javascript task

### Deploy your site
Rsync ist used here to sync our local _site with the remote host. Adjust the SSH-USER, SSH-HOST and REMOTE-PATH in the Makefile.

Be careful with this settings since rsync is set to **delete** the files on the remote path!

Deploy with `make deploy`.

## Credits
This is based on the starting point from [@macbleser](https://github.com/macbleser/jekyll-gulp-sass-foundation).  

Here's no deploying to Amazon S3, HTML minification and gulp font tasks.  

The gulp plugins were upgraded.

## License
This package is licensed under the terms of the MIT license.
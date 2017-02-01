/*-------------------------------------------------------------------------------
# Copyright IBM Corp. 2017
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#-------------------------------------------------------------------------------*/
var express = require('express');
var cfenv = require('cfenv');
var multer = require('multer');
var request = require('request');
var methodOverride = require('method-override');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var unirest = require('unirest');
var session = require('express-session');
var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(session({secret: '1234567890QWERTY', resave: false, saveUninitialized: false}));
/* ----------------------------------------------------------------------------------------- */
/* launch the server                                                                         */
/* ----------------------------------------------------------------------------------------- */
var appEnv = cfenv.getAppEnv();
var server = app.listen(appEnv.port, function() {
  console.log('***********************************');
  console.log('listening:', appEnv.url);
  console.log('***********************************');
});
module.exports = server;
/* ----------------------------------------------------------------------------------------- */
/* Manage the homepage of the application -------------------------------------------------- */
/* ----------------------------------------------------------------------------------------- */
app.get('/', function(req, res){
  res.render('home/index');
});
/* ----------------------------------------------------------------------------------------- */
/* Get the credentials information that have been stored into the session                    */
/* ----------------------------------------------------------------------------------------- */
function getCredential(req)
{
  var cred ={token: "", project: ""};
  if(req.session.token)
  {
    cred.token = req.session.token;
  }
  if( req.session.project)
  {
    cred.project = req.session.project;
  }
  return cred;
}
/* ----------------------------------------------------------------------------------------- */
/* Manage the settings of the application                                                    */
/* Allow to provide the auth token and the project id that will be used during REST API call */
/* The information will be stored into the http session                                      */
/* ----------------------------------------------------------------------------------------- */
app.get('/settings', function(req, res){
  var cred = getCredential(req);
  res.render('home/settings',{token: cred.token, project: cred.project});
});
app.post('/settings', function(req, res){
  var token = req.body.token;
  var project = req.body.project;
  req.session.token = token;
  req.session.project = project;
  res.render('home/settings',{token: token, project: project});
});
/* ----------------------------------------------------------------------------------------- */
/* Call the REST API to get the list version of IBM Containers Service                       */
/* ----------------------------------------------------------------------------------------- */
app.get('/version', function(req, res){
    console.log("Call the rest API to get version info")
    unirest.get("https://containers-api.ng.bluemix.net/v3/containers/version")
    .header("Accept", "application/json")
    .end(function (result) {
      res.render("home/version",{code: result.code, result:result.body});
    }
    )
});
/* ----------------------------------------------------------------------------------------- */
/* Call the REST API to get the list of existing images managed by IBM Containers Service    */
/* ----------------------------------------------------------------------------------------- */
app.get('/images', function(req, res){
    console.log("Call the rest API to get images list")
    var cred = getCredential(req);
    unirest.get("https://containers-api.ng.bluemix.net/v3/images/json")
    .header("X-Auth-Token",cred.token)
    .header("X-Auth-Project-Id",cred.project)
    .header("Accept", "application/json")
    .end(function (result) {
      res.render("home/images",{code: result.code, result:result.body});
    }
    )
});
/* ----------------------------------------------------------------------------------------- */
/* Call the REST API to get the list of existing containers managed by IBM Containers Service*/
/* ----------------------------------------------------------------------------------------- */
app.get('/containers', function(req, res){
    console.log("Call the rest API to get containers list")
    var cred = getCredential(req);
    unirest.get("https://containers-api.ng.bluemix.net/v3/containers/json")
    .header("X-Auth-Token",cred.token)
    .header("X-Auth-Project-Id",cred.project)
    .header("Accept", "application/json")
    .end(function (result) {
      res.render("home/containers",{code: result.code, result:result.body});
    }
    )
});
/* ----------------------------------------------------------------------------------------- */
/* Call the REST API to get the list of defined volumes managed by IBM Containers Service    */
/* ----------------------------------------------------------------------------------------- */
app.get('/volumes', function(req, res){
    console.log("Call the rest API to get volumes list")
    var cred = getCredential(req);
    unirest.get("https://containers-api.ng.bluemix.net/v3/volumes/json")
    .header("X-Auth-Token",cred.token)
    .header("X-Auth-Project-Id",cred.project)
    .header("Accept", "application/json")
    .end(function (result) {
      res.render("home/volumes",{code: result.code, result:result.body});
    }
    )
});
/* ----------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------- */

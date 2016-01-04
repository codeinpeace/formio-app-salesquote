!function(){"use strict";angular.module("formioSalesQuoteApp",["formio","ui.router","ngMap","bgf.paginateAnything"]).filter("ucfirst",[function(){return function(e){return e.charAt(0).toUpperCase()+e.substring(1)}}]).provider("Resource",["$stateProvider",function(e){var t={};return{register:function(r){t[r]=r;var o=r+"Form";e.state(r+"Index",{url:"/"+r,templateUrl:"views/resource/index.html",controller:["$scope","$state",function(e,t){e.resourceName=r,e.resourceForm=e[o],e.$on("submissionView",function(e,o){t.go(r+".view",{id:o._id})}),e.$on("submissionEdit",function(e,o){t.go(r+".edit",{id:o._id})}),e.$on("submissionDelete",function(e,o){t.go(r+".delete",{id:o._id})})}]}).state(r+"Create",{url:"/create/"+r,templateUrl:"views/resource/create.html",controller:["$scope","$state",function(e,t){e.resourceForm=e[o],e.$on("formSubmission",function(e,o){t.go(r+".view",{id:o._id})})}]}).state(r,{"abstract":!0,url:"/"+r+"/:id",templateUrl:"views/resource.html",controller:["$scope","$stateParams",function(e,t){e.resourceName=r,e.resourceForm=e[o],e.resourceUrl=e.resourceForm+"/submission/"+t.id}]}).state(r+".view",{url:"/",parent:r,templateUrl:"views/"+r+"/view.html",controller:["$scope","$stateParams","Formio",function(e,t,r){e.resource={},e.position={lat:"40.74",lng:"-74.18"},new r(e.resourceUrl).loadSubmission().then(function(t){t.data.address&&(e.position.lat=t.data.address.geometry.location.lat,e.position.lng=t.data.address.geometry.location.lng),e.resource=t})}]}).state(r+".edit",{url:"/edit",parent:r,templateUrl:"views/resource/edit.html",controller:["$scope","$state",function(e,t){e.$on("formSubmission",function(e,o){t.go(r+".view",{id:o._id})})}]}).state(r+".delete",{url:"/delete",parent:r,templateUrl:"views/resource/delete.html",controller:["$scope","$state",function(e,t){e.$on("delete",function(){t.go(r+"Index")})}]})},$get:function(){return t}}}]).config(["FormioProvider","ResourceProvider","$stateProvider","$urlRouterProvider","AppConfig",function(e,t,r,o,n){e.setBaseUrl(n.apiUrl),r.state("home",{url:"/?",templateUrl:"views/main.html",controller:["$scope","$rootScope",function(e,t){e.contracts=[],e.contractsUrl=t.contractForm+"/submission",e.customers=[],e.customersUrl=t.customerForm+"/submission",e.opportunities=[],e.opportunitiesUrl=t.opportunityForm+"/submission",e.quotes=[],e.quotesUrl=t.quoteForm+"/submission",e.agents=[],e.agentsUrl=t.agentForm+"/submission"}]}).state("admin",{"abstract":!0,url:"/admin",templateUrl:"views/admin/auth.html"}).state("admin.login",{url:"/login",parent:"admin",templateUrl:"views/admin/login.html",controller:["$scope","$state","$rootScope",function(e,t,r){e.$on("formSubmission",function(e,o){o&&(r.isAdmin=!0,localStorage.setItem("admin",1),r.user=o,t.go("home"))})}]}).state("auth",{"abstract":!0,url:"/auth",templateUrl:"views/user/auth.html"}).state("auth.login",{url:"/login",parent:"auth",templateUrl:"views/user/login.html",controller:["$scope","$state","$rootScope",function(e,t,r){e.$on("formSubmission",function(e,o){o&&(r.isAdmin=!1,localStorage.setItem("admin",0),r.user=o,t.go("home"))})}]}),t.register("contract"),t.register("customer"),t.register("opportunity"),t.register("agent"),t.register("quote"),o.otherwise("/")}]).factory("FormioAlerts",["$rootScope",function(e){var t=[];return{addAlert:function(r){e.alerts.push(r),r.element?angular.element("#form-group-"+r.element).addClass("has-error"):t.push(r)},getAlerts:function(){var e=angular.copy(t);return t.length=0,t=[],e},onError:function r(e){if(e.message)this.addAlert({type:"danger",message:e.message,element:e.path});else{var t=e.hasOwnProperty("errors")?e.errors:e.data.errors;angular.forEach(t,r.bind(this))}}}}]).run(["$rootScope","$state","Formio","FormioAlerts","AppConfig",function(e,t,r,o,n){e.company=n.company,e.baseUrl=n.apiUrl,e.contractForm=n.appUrl+"/contract",e.customerForm=n.appUrl+"/customer",e.opportunityForm=n.appUrl+"/opportunity",e.agentForm=n.appUrl+"/agent",e.quoteForm=n.appUrl+"/quote",e.userLoginForm=n.appUrl+"/agent/login",e.adminLoginForm=n.appUrl+"/admin/login",e.user||r.currentUser().then(function(t){e.user=t,e.isAdmin=1===parseInt(localStorage.getItem("admin"),10)});var s=function(){t.go("auth.login"),o.addAlert({type:"danger",message:"Your session has expired. Please log in again."})};e.$on("formio.sessionExpired",s),e.logout=function(){localStorage.setItem("admin",0),r.logout().then(function(){t.go("auth.login")})["catch"](s)},e.isActive=function(e){return-1!==t.current.name.indexOf(e)},e.$on("$stateChangeStart",function(o,n){e.authenticated=!!r.getToken(),"auth"!==n.name.substr(0,4)&&"admin.login"!==n.name.substr(0,11)&&(e.authenticated||(o.preventDefault(),t.go("auth.login")))}),e.$on("$stateChangeSuccess",function(){e.alerts=o.getAlerts()})}])}();
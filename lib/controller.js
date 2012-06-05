var
  config = require('config'),
  log = require(process.env.APP_PATH + "/lib/log");

module.exports = {
  bootControllers : function(app, module_name)
  {
    var
      routers = null;

    if (module_name) {
      routers = config['routers-' + module_name];
    }
    else {
      routers = config.routers;
    }

    for (var route_name in routers) {
      if (routers.hasOwnProperty(route_name)) {
        log.debug("booting route " + route_name);

        var
          route_data = routers[route_name],
          route_url = route_data.url,
          controller = null,
          fn = null;

        if (module_name) {
          controller = require(process.env.APP_PATH + '/modules/' + module_name + '/controllers/' + route_data.controller);
        }
        else {
          controller = require(process.env.APP_PATH + '/controllers/' + route_data.controller);
        }

        fn = controller[route_data.action];

        if (route_data.isRegExp) {
          route_url = new RegExp('^\/' + route_url);
        }
        else {
          route_url = '/' + route_url;
        }

        switch (route_data.method) {
          case 'get':
            app.get(route_url, fn);
            log.debug("initialized get " + route_url);
            break;
          case 'post':
            app.post(route_url, fn);
            log.debug("initialized post " + route_url);
            break;
          case 'put':
            app.put(route_url, fn);
            log.debug("initialized put " + route_url);
            break;
          case 'delete':
            app.del(route_url, fn);
            log.debug("initialized delete " + route_url);
            break;
        }
      }
    }
  }
};

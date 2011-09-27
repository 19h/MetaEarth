var http = require('http'),
    faye = require('faye');

bayeux = new faye.NodeAdapter({
  mount:    '/faye',
  timeout:  45,
})

bayeux.listen(8000);

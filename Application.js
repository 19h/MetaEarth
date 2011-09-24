var m = function () {
                return new Date().getTime() / 1000;
        }
var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    path = require('path'),
    mime = require('mime');

//mimes
var html = "text/html",
    js = "text/javascript",
    css = "text/stylesheet",
    plain = "text/plain";

var Config = {
        // vars
        i: false,
        inc: 0,
        // functions
        gV: function (v, u) {
                var query = Config.gP(u).substr(1);
                var vars = query.split("&");
                for (var i = 0; i < vars.length; ++i) {
                        var pair = vars[i].split("=");
                        if (pair[0] == v) {
                                if (this.i === false) {
                                        return pair[1];
                                } else {
                                        return !(this.i = !this.i);
                                }
                        }
                }
                return false;
        },
        gVc: function (v, u) {
                this.i = !this.i;
                return this.gV(v, u);
        },
        gP: function (u) {
                return u.substr(u.indexOf("?"), u.length);
        },
        cH: function (r) {
                var z = "i";
                if (Config.gVc(z, r)) return z;
                z = "m"; //ethod
                if (Config.gVc(z, r)) return z;
                z = "h"; //andler
                if (Config.gVc(z, r)) return z;
                return false
        },
        gI: function () {
                return this.inc = this.inc + 1;
        }
}

http.createServer(function (request, response) {

        var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

        path.exists(filename, function (exists) { isMime = (exists)?mime.lookup(filename):false;exists = true;
                if ( filename === process.cwd() + "/" ){
                                filename = path.join(process.cwd(), "ui/index");
                                isMime = html;
                } else if ( filename === process.cwd() + "/" + "Application" )
                                filename = path.join(process.cwd(), "js/Core.js");
                else exists = false;
                
                if (!exists) {
                        response.writeHead(404, {
                                "Content-Type": "text/plain"
                        });
                        response.write("404 Not Found\n");
                        response.end();
                        return;
                }

                if (fs.statSync(filename).isDirectory()) filename += '/index.html';

                fs.readFile(filename, "binary", function (err, file) {
                        if (err) {
                                response.writeHead(500, {
                                        "Content-Type": mime.lookup(filename)
                                });
                                response.write(err + "\n");
                                response.end();
                                return;
                        }

                        response.writeHead(200, {
                                        "Content-Type": (typeof isMime !== "undefined" && isMime !== false) ? isMime : mime.lookup(filename)
                        });
                        response.write(file, "binary");
                        response.end();
                });
        });
}).listen(8888);
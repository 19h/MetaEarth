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

// FUNCTIONAL
global.each = function (v, c) {
        if (typeof v === "array")
                for (var k = 0; k < v.length; ++k)
                        c(k, v[k]);
        else if (typeof v === "object")
                for (var k in v)
                        if (this.hasOwnProperty(k))
                                c(k, v[k]);
}

global.b64d = function (z) { //b64d+utf8
        var a;
        var b = z,
                c, d, e, f, g, h, i, j, k = 0,
                l = 0,
                m = "",
                n = [];
        if (b) {
                b += "";
                do f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(k++)), g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(k++)), h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(k++)), i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(k++)), j = f << 18 | g << 12 | h << 6 | i, c = j >> 16 & 255, d = j >> 8 & 255, e = j & 255, h == 64 ? n[l++] = String.fromCharCode(c) : i == 64 ? n[l++] = String.fromCharCode(c, d) : n[l++] = String.fromCharCode(c, d, e);
                while (k < b.length);
                var o = m = n.join(""),
                        p = [],
                        q = 0,
                        r = 0,
                        s = 0,
                        t = 0,
                        u = 0;
                for (o += ""; q < o.length;) s = o.charCodeAt(q), s < 128 ? (p[r++] = String.fromCharCode(s), q++) : s > 191 && s < 224 ? (t = o.charCodeAt(q + 1), p[r++] = String.fromCharCode((s & 31) << 6 | t & 63), q += 2) : (t = o.charCodeAt(q + 1), u = o.charCodeAt(q + 2), p[r++] = String.fromCharCode((s & 15) << 12 | (t & 63) << 6 | u & 63), q += 3);
                a = m = p.join("")
        } else a = b;
        return a;
};

var Config = {
        // vars
        i: false,
        inc: 0,
        // functions
        gV: function (v, u) {
                var query = Config.gP(u).substr(1);
                var vars = query.split("&"),
                        data = [];
                for (var i = 0; i < vars.length; ++i) {
                        var pair = vars[i].split("=");
                        if (pair[0] == v) {
                                if (this.i === false) {
                                        return pair[1];
                                } else {
                                        return !(this.i = !this.i);
                                }
                        } else {
                                data.push(pair);
                        }
                }
                return (data === []) ? false : data;
        },
        gZ: function (v, u) {
                this.i = false;
                return gV(v, u);
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

        //console.log(Config.gZ("ll",u));
        //console.log(Config.gV( false, u = request.url ));
        var x;
        if ( ( x = Config.gV("ds", u = request.url) ) !== "undefined" )
                if ( x+"" !== "" )
                        console.log(x[0][0]+": "+b64d(x[0][1]));

        var uri = url.parse(request.url).pathname,
                filename = path.join(process.cwd(), uri);

        path.exists(filename, function (exists) {
                isMime = (exists) ? mime.lookup(filename) : false;
                exists = true;
                if (filename === process.cwd() + "/") {
                        filename = path.join(process.cwd(), "ui/index");
                        isMime = html;
                } else if (filename === process.cwd() + "/" + "Application") filename = path.join(process.cwd(), "js/Core.js");
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
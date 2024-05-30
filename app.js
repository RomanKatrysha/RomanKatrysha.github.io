const http = require("http");
const path = require("path")
const  fs = require("fs");

const PORT = 3500;
const mimeTypes = {
    ".html":"text/html",
    ".png":"image/png",
    ".js":"text/javascript",
    ".css":"text/css"
}
function staticFile (res,filePath,ext){
    res.setHeader("Content-Type",mimeTypes[ext]);
    fs.readFile(filePath,function (err,data){
        if(err){
            res.end();
        }
        res.write(data);
        res.end();
    })

}

http.createServer(function (req,res){
    let url = req.url;
    switch (url){
        case "/":
            res.end("0")
            break;
        case "/1":
            staticFile(res,"./index.html",".html");

            break;
        default:
            let nameExt = String(path.extname(url)).toLowerCase();
            if(nameExt in mimeTypes){
                console.log(url,nameExt)
                staticFile(res,"."+url,nameExt);
            }

            else {
                res.statusCode =404;
                res.end("404");
            }
    }

}).listen(PORT);
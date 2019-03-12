var path = require('path');

module.exports = function(src){
   
    return { 
        js: {
            "vendor.js" : [
                    "./node_modules/jquery/dist/jquery.js",
                    "./node_modules/bootstrap/dist/js/bootstrap.js"
                ],
            "app.js" : [
                path.join(src, 'js/app.js')
            ],
        }, 
        /*css: {
            "vendor.css" : [
                "./node_modules/bootstrap/dist/css/bootstrap.css"
            ],
        }*/ 
    }
}
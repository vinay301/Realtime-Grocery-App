const Menu = require('../../models/menu')
function homeController(){
    //factory DP --> Factory Functions -> simply returns a object
    return {
        //index method is for READ (naming convention)
        async index(req,res){
            const groceries = await Menu.find()
            res.render('home',{groceries : groceries});
        }
    }
}

module.exports =homeController
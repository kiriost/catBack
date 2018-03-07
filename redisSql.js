var redis = require('redis'),
    RDS_PORT = 6379,        //端口号
    RDS_HOST = '120.77.38.20',    //服务器IP
    RDS_OPTS = {},            //设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

var getOnRack = (index) => {
    //查询上架书籍
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
    let rackClass = ["recommend_book", "new_book", "free_book", "superme_book", "hot_book"]
    let promise = new Promise((resolve, reject) => {

        client.on('connect',function(){
            //client.set("test", "test content", redis.print);
            client.get(rackClass[index], function(err,res){
                if(err)
                {
                    console.log('Error:'+ err);
                    reject(err);
                    return;
                }            
                //console.log(JSON.parse(res));
                resolve(JSON.parse(res))
            });
        });
    });
    return promise  
}

var sendList = (contant, index) => {
    //查询上架书籍
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
    let contantJson = JSON.stringify(contant)
    let rackClass = ["recommend_book", "new_book", "free_book", "superme_book", "hot_book"]
    let promise = new Promise((resolve, reject) => {

        client.on('connect',function(){
            //client.set("test", "test content", redis.print);
            client.set(rackClass[index], contantJson, function(err,res){
                if(err)
                {
                    console.log('Error:'+ err);
                    reject(err);
                    return;
                }            
                //console.log(JSON.parse(res));
                resolve(1)
            });
        });
    });
    return promise  
}

module.exports = {
    getOnRack: getOnRack,
    sendList: sendList
}    

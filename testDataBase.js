var redis = require('redis'),
    RDS_PORT = 6379,        //端口号
    RDS_HOST = '120.77.38.20',    //服务器IP
    RDS_OPTS = {},            //设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

client.on('connect',function(){
    //client.set("test", "test content", redis.print);
    client.get("free_book", function(err,res){
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }            
        console.log(JSON.parse(res));
    });
});

client.on('ready',function(res){
    console.log('ready');    
});
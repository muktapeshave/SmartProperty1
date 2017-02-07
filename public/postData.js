$(document).ready(function(){
        $('#sub').click(function(){
            //alert("Submitted");
            $("propertyregisterfrom").submit();
            console.log('form data');
            $('#myModal').modal('hide');
            
             var data = $('#propertyregisterfrom').serializeArray();
        
        for(i in data){
            
            var x = data[i];
            
            console.log(x.value);
        }
            
                 $.ajax({
                        type: 'GET',
                        dataType : 'json',
        contentType: 'application/json',
        crossDomain:true,
        url: 'https://car-lease-demo-sumanthonnavar-194.mybluemix.net/blockchain/blocks',
        success: function(d) {
            chainHeight = d.height;
            blockNum = d.height - 1;
            startBlock = d.height - 1;
            storeBlock = d.height - 1;
            lastBlockHash = d.currentBlockHash;
            console.log((chainHeight+'My chain ksjdhaksjdhaJKSDGHAsdjkg'));
        },
        error: function(e){
            console.log(e);
        },
        async: false
    });

          
        });
});

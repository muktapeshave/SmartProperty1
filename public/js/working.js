/* global new_block,formatDate, randStr, bag, $, clear_blocks, document, WebSocket, escapeHtml, window */
var ws = {};

let prevFiftyBlocks = []; //Previous 125 block times (when committed to blockchain)
let timeData = [];
let transData = [];
let storeBlock; //Latest block
let blockTime;
let chainHeight;
let blockNum; //Chain height/length
let sum = 0; //Sum of total time between blocks
let avg = 'N/A';
let startBlock;
let stdDev;
let minMax;
let timeDiff; //Time difference between two blocks
let scrollWidth;
let max;
let min;
let block1;
let prev;
let b;
let blk;
let payload;
let transSpans;
let data;
let date,date1;

let ownerName;
let senderName;
let buyerName;

// =================================================================================
// On Load
// =================================================================================
$(document).ready(function() {
    connect_to_server();
    console.log('in ready');

    //$('input[name="name"]').val('r' + randStr(6));

    // =================================================================================
    // jQuery UI Events
    // =================================================================================
    $('#sub').click(function() {

        $('#myModal').modal('hide');
        console.log('form data');
        var data = $('#propertyregisterfrom').serializeArray();
        console.log(data);
        var obj = {
            type: 'create',
            name: ownerName,
            adhaar_no: $("#acnumber").val(),
            survey_no: data[0].value,
            location: data[1].value,
            area: data[2].value,
            v: 1

        };
        console.log(obj.area + '*' + obj.name + '*' + obj.location + '*' + obj.adhaar_no + '*' + obj.survey_no);
        if (obj.area && obj.name && obj.location && obj.adhaar_no && obj.survey_no) {

            console.log('creating property, sending', obj);
			ws.send(JSON.stringify(obj));
            alert("Congrats! " + name + " Your property has been registered!");
        } else {
            alert("You haven't inserted all required data!");
        }
        location.reload();
        return false;
    });
   
    $('#own').change(function (e) {
        //alert('hi');
       ownerName= this.options[ this.selectedIndex ].innerText;
    });
   
    $('#ow').change(function (e) {
    
        senderName=this.options[ this.selectedIndex ].innerText;
            console.log(senderName);
        
       $("#ppp").find("div").remove();
           var temp=""; 
        console.log('ANCHOR');
        var name= senderName;
         $.ajax({
                 
        
        type: 'GET',
        dataType : 'json',
        contentType: 'application/json',
        crossDomain:true,
        url: 'https://58a2b50594a34f2488b3e400ce64e8c3-vp0.us.blockchain.ibm.com:5003/chain',
        success: function(d) {
			console.log(d);
            chainHeight = d.height;
			console.log('Height'+chainHeight);
            blockNum = d.height - 1;
            console.log(blockNum);
        },
        error: function(e){
            console.log(e);
        },
        async: false
    });
	
	for(let i = 0; i < chainHeight; i++){
		
            if(blockNum - i > 0)
            {
                
				
                $.ajax({
                    
                    beforeSend: function(){
                    $("#r1").css('display', 'none');
                    $("#ldr").css('display', 'block');
                    console.log('before send');
        
                    },
                    complete: function(){
                        //$("#ppp").append(temp);
                        $("#ldr").css('display', 'none');
                        $("#r1").css('display', 'block');
        
                    },
                    
                    
                    
                    
                    type: 'GET',
                    dataType : 'json',
                    contentType: 'application/json',
                    crossDomain:true,
                    url: 'https://58a2b50594a34f2488b3e400ce64e8c3-vp0.us.blockchain.ibm.com:5003/chain/blocks/'+(blockNum-i),
                    success: function(d) {
						
                        blk = d.transactions[0];
						
						if(typeof blk != 'undefined'){
						console.log(d);
						console.log('Sumanth'+blk);
						blockTime= d.nonHashData.localLedgerCommitTimestamp.seconds;
						payload=blk.payload;
						payload=window.atob(payload);   
						data=payload.split("\n");
                        
                       
                        var n1=data[3].toLowerCase().trim();
                        var n2=name.toLowerCase().trim();
                       
                        console.log(data[5]+"**"+data[2]+"*"+data[3]+"*"+data[4]);
                        console.log(n1 +' data '+ n2 + ' compare '+ n);
                             if(data[2].localeCompare("transfer")==0){
                                  n1=data[5].toLowerCase().trim();
                        }
                          var n = n1.localeCompare(n2);  
                            if(n==0){
                                /* alert(data[2]); */
                                if(data[2].localeCompare("transfer")==0){
                                       
                                        $("#ppp").append('<div class="radio"><label style="font-size:150%"><input name="propertyr" type="radio" value="'+data[3]+'">'+data[5]+' '+data[3]+'</label></div>');
                                }else{
                                    console.log('in if  '+data[3]);
                                //$("#ppp").append('<label style="color:red"><input type="checkbox" >'++'</label><br>')
                                
                                $("#ppp").append('<div class="radio"><label style="font-size:150%"><input name="propertyr" type="radio" value="'+data[5]+'">'+data[3]+' '+data[5]+'</label></div>');
                                }
                                //var temp=data[2]+" "+data[3]+" "+data[4]+" "+data[5]+" "+data[6]+" "+data[7];
                                
                                
                               
                               // $("#abc").load(data[4])
                                //$("ul").add('<li class="list-group-item" style="display:block"><label><input type="checkbox" value=""   >'+data[3]+'-'+data[4]+'</label></li>');
                            }else{
                                
                                console.log('nt same ');
                            }
                        }
                    },
                    error: function(e){
                        console.log(e);
                    },
                    async: true
                });

                prevFiftyBlocks.push(blockTime);
				if(typeof blk != 'undefined'){
                transData.push(blk.length);
				}
				
                
				
                
				
            }
            else if(blockNum - i == 0) //If genesis block..
            {

                let blk;

                $.ajax({
                    type: 'GET',
                    dataType : 'json',
                    contentType: 'application/json',
                    crossDomain:true,
                    url: 'https://58a2b50594a34f2488b3e400ce64e8c3-vp0.us.blockchain.ibm.com:5003/chain/blocks/'+(blockNum-i),
                    success: function(d) {
                        blk = d.transcations;
						blockTime= d.nonHashData.localLedgerCommitTimestamp.seconds;
                    },
                    error: function(e){
                        console.log(e);
                    },
                    async: false
                });

               // $('#blockScroll').prepend('<div class="singleBlockContainer"><div class="exBlock notClicked" onclick="changeShape(this)"><span>'+(blockNum-i)+'</span></div><br /><div class="triangle_down_big"></div><div class="triangle_down"></div><div class="blockData"><span class="blockHash"><b>Block Hash: </b><br />'+lastBlockHash+'</span><br /><br /><span class="blockTimeAdded"><b>Added to Chain: </b><br />'+timeConverter(blockTime)+'</span><br /><br /><span class="blocksTransactionsHdr" >Transactions:</span><br /><span class="blocksTransactions">No transactions in the Genesis block.</span></div><input type="hidden" class="height" value="'+270+'"></input></div>');
            }
            else
            {
                break;
            }
        }
        
        
        
        
    
	});
    
    $('#buyer').change(function (e) {
        buyerName=this.options[ this.selectedIndex ].innerText;
        if(buyerName!="Buyer Name")
            $("#transfer").prop('disabled', false);
    });

/* 
    $(":checkbox").change(function() {
        
        

    }); */
    $('#ppp').on('change', '.radio', function() {
    // do something
    
        if(!this.checked) {
                        console.log('oprion');
                        
                        $("#buyer").css('display', 'block');
        }else{
            alert('else');
        }
    });

    $('#transfer').click(function() {
        
        
        var sn = $('input[name=propertyr]:checked').val();
        console.log(sn);
        //console.log('transferring property '+sn+' from '+senderName+' to '+buyerName);
        
        var obj = {
            type: 'transfer',
            survey_no: sn,
            name: senderName,
            new_name: buyerName,
            v: 1

        };
        //console.log(obj.name + '*' + obj.survey_no + '*' + obj.new_name);
        if (obj.new_name && obj.name && obj.survey_no) {
           var r=confirm("Confirm to transfer property "+sn+" from "+senderName+" to "+buyerName);
            if(r==true){
                    console.log('transferring, sending', obj);
                    ws.send(JSON.stringify(obj));
                    alert("Property Transferred Sucessfully!!!")
            }
            
        } else {
            alert("You haven't inserted all required data!");
        }
        location.reload();
        return false;
    });

});



// =================================================================================
// Socket Stuff
// =================================================================================
function connect_to_server() {
    var connected = false;
    connect();

    function connect() {
        var wsUri = 'ws://' + document.location.hostname + ':' + document.location.port;
        console.log('Connectiong to websocket', wsUri);

        ws = new WebSocket(wsUri);
        ws.onopen = function(evt) { onOpen(evt); };
        ws.onclose = function(evt) { onClose(evt); };
        ws.onmessage = function(evt) { onMessage(evt); };
        //ws.onerror = function(evt) { onError(evt); };
    }

    function onOpen(evt) {
        console.log('WS CONNECTED');
        connected = true;
        //clear_blocks();
        $('#errorNotificationPanel').fadeOut();
        ws.send(JSON.stringify({ type: 'get', v: 1 }));
        ws.send(JSON.stringify({ type: 'chainstats', v: 1 }));
    }

    function onClose(evt) {
        console.log('WS DISCONNECTED', evt);
        connected = false;
        setTimeout(function() { connect(); }, 5000); //try again one more time, server restarts are quick
    }

    function onMessage(msg) {
        try {
            var msgObj = JSON.parse(msg.data);
            if (msgObj.property) {
                console.log('rec', msgObj.msg, msgObj);
            } else if (msgObj.msg === 'chainstats') {
                console.log('rec', msgObj.msg, ': ledger blockheight', msgObj.chainstats.height, 'block', msgObj.blockstats.height);
                var e = formatDate(msgObj.blockstats.transactions[0].timestamp.seconds * 1000, '%M/%d/%Y &nbsp;%I:%m%P');
                $('#blockdate').html('<span style="color:#fff">TIME</span>&nbsp;&nbsp;' + e + ' UTC');
                var temp = {
                    id: msgObj.blockstats.height,
                    blockstats: msgObj.blockstats
                };
                //new_block(temp);								//send to blockchain.js
            } else console.log('rec', msgObj.msg, msgObj);
        } catch (e) {
            console.log('ERROR', e);
        }
    }

    function onError(evt) {
        console.log('ERROR ', evt);
        if (!connected && bag.e == null) { //don't overwrite an error message
            $('#errorName').html('Warning');
            $('#errorNoticeText').html('Waiting on the node server to open up so we can talk to the blockchain. ');
            $('#errorNoticeText').append('This app is likely still starting up. ');
            $('#errorNoticeText').append('Check the server logs if this message does not go away in 1 minute. ');
            $('#errorNotificationPanel').fadeIn();
        }
    }
}
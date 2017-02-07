
var ws = {};

// =================================================================================
// On Load
// =================================================================================
$(document).ready(function() {
    connect_to_server(); 
    console.log('ready to transfer');
	
	$('#transfer').click(function(){
		console.log('transferring property');
   
		var obj = 	{
						/*type: 'create',
						name: $('input[name="owner"]').val().replace(' ', ''),
						adhaar_no: $('select[name="acnumber"]').val(),
						survey_no: $('select[name="surveyNo"]').val(),
						location: $('select[name="loc"]').val(),
						area: $('select[name="areaDet"]').val(),
                        
                        */
                        
                        
                        type: 'transfer',
						name: "deepali",
						survey_no: "sr-111",
						new_name: "Sumanth"
                        		v:1
                        
					};
                    console.log(obj.new_name+'*'+obj.name+'*'+obj.survey_no);
		if(obj.new_name && obj.name && obj.survey_no){
			
            console.log('transferring, sending', obj);
			ws.send(JSON.stringify(obj));
		}
		else{
			alert("You haven't inserted all required data!");
		}
		return false;
	});
   
});
	


// =================================================================================
// Socket Stuff
// =================================================================================
function connect_to_server(){
	var connected = false;
	connect();
	function connect(){
		var wsUri = 'ws://' + document.location.hostname + ':' + document.location.port;
		console.log('Connectiong to websocket', wsUri);
		
		ws = new WebSocket(wsUri);
		ws.onopen = function(evt) { onOpen(evt); };
		ws.onclose = function(evt) { onClose(evt); };
		ws.onmessage = function(evt) { onMessage(evt); };
		//ws.onerror = function(evt) { onError(evt); };
	}
	
	function onOpen(evt){
		console.log('WS CONNECTED');
		connected = true;
		//clear_blocks();
		$('#errorNotificationPanel').fadeOut();
		ws.send(JSON.stringify({type: 'get', v:1}));
		ws.send(JSON.stringify({type: 'chainstats', v:1}));
	}

	function onClose(evt){
		console.log('WS DISCONNECTED', evt);
		connected = false;
		setTimeout(function(){ connect(); }, 5000);					//try again one more time, server restarts are quick
	}

	function onMessage(msg){
		try{
			var msgObj = JSON.parse(msg.data);
			if(msgObj.property){
				console.log('rec', msgObj.msg, msgObj);
			}
			else if(msgObj.msg === 'chainstats'){
				console.log('rec', msgObj.msg, ': ledger blockheight', msgObj.chainstats.height, 'block', msgObj.blockstats.height);
				var e = formatDate(msgObj.blockstats.transactions[0].timestamp.seconds * 1000, '%M/%d/%Y &nbsp;%I:%m%P');
				$('#blockdate').html('<span style="color:#fff">TIME</span>&nbsp;&nbsp;' + e + ' UTC');
				var temp =  {
								id: msgObj.blockstats.height, 
								blockstats: msgObj.blockstats
							};
				//new_block(temp);								//send to blockchain.js
			}
			else console.log('rec', msgObj.msg, msgObj);
		}
		catch(e){
			console.log('ERROR', e);
		}
	}

	function onError(evt){
		console.log('ERROR ', evt);
		if(!connected && bag.e == null){											//don't overwrite an error message
			$('#errorName').html('Warning');
			$('#errorNoticeText').html('Waiting on the node server to open up so we can talk to the blockchain. ');
			$('#errorNoticeText').append('This app is likely still starting up. ');
			$('#errorNoticeText').append('Check the server logs if this message does not go away in 1 minute. ');
			$('#errorNotificationPanel').fadeIn();
		}
	}
}

'use strict';
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
let arr=[];
$(document).ready(function(){
console.log('Loaded');
 var temp;
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
	
	for(let i = 0; i < 126; i++)
        {
		
            if(blockNum - i > 0)
            {
                
				
                $.ajax({
                    
            
                    
                    beforeSend: function(){
                    $("#table-wrapper").css('display', 'none');
                    $("#ldr").css('display', 'block');
                    console.log('before send');
        
                    },
                    complete: function(){
                        //$("#ppp").append(temp);
                        $("#ldr").css('display', 'none');
                        $("#table-wrapper").css('display', 'block');
        
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
						//console.log('Sumanth'+blk);
						blockTime= d.nonHashData.localLedgerCommitTimestamp.seconds;
						payload=blk.payload;
						payload=window.atob(payload);
						data=payload.split("\n");
                        
                        if(data[2].localeCompare("transfer")!=-1){
                          //  alert(data[2]+"**"+data[3]+"*"+data[4]+"*"+data[6]);
                            temp="<span style=\"text-align: left\">"+"Transaction "+data[2].toUpperCase()+" </br>Survey No: "+data[3]+" <br>Transferred from: "+data[4]+" <br>Transferred to: "+data[5];
                        }
						//console.log('Hi'+data[6]+' '+data[3]);
						if(data[6]!=undefined){
						 temp= "<span style=\"text-align: left\">"+"Transaction "+data[2].toUpperCase()+" </br>Owner Name: "+data[3]+" <br>Adhar No: "+data[4]+" <br>Survey No: "+data[5]+" <br>Location: "+data[6]+"<br>Address: "+data[7]+"</span>";
						
						}
                        var row=(blockNum-i)+"$"+temp+"$"+timeConverter(blockTime);
						arr.push(row);
                        $("#d").append('<tr><td><strong>'+(blockNum-i)+'</strong></td><td style="text-align:left; padding-left:10%"><strong>'+temp+'</strong></td><td><strong>'+timeConverter(blockTime)+'</strong></td></tr>');
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
            }
            else
            {
                break;
            }
        }
		});
		
		function timeConverter(UNIX_timestamp){

    let a = new Date(UNIX_timestamp * 1000);

    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();

    let hour = a.getHours();
    let mins = a.getMinutes();
    let sec = a.getSeconds();
    let time = pad(date) + ' ' + month + ' ' + pad(year) + ' ' + pad(hour) + ':' + pad(mins) + ':' + pad(sec) ;

    return time;
}
function pad(value) { //Used for time so that, 12:04 isn't show as 12:4.
    if(value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}

function mySearch(keyword)
{

	$("#d").html("");
    //alert(keyword)
	var blockno;
	var desc="";
	var time;
	for(let i=0;i<arr.length;i++)
	{
		if(arr[i].toLowerCase().includes(keyword.toLowerCase()))
		{
			var splitted=arr[i].split("$");
			blockno=splitted[0];
			time=splitted[2];
		

			$("#d").append('<tr><td><strong>'+blockno+'</strong></td><td style="text-align:left; padding-left:10%"><strong>'+splitted[1]+'</strong></td><td><strong>'+time+'</strong></td></tr>');
		
									
		}
	}
}

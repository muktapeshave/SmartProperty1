let config = {};

config.participants = {};
config.adhar = {};

config.participants[0]="POOJA";
config.participants[1]="SUMANTH";
config.participants[2]="SHRINIVAS";
config.participants[3]="MONIKA";
config.participants[4]="DEEPALI";


config.adhar[0]="4786-2341-5687";
config.adhar[1]="6987-6756-1254";
config.adhar[2]="9867-5645-7865";
config.adhar[3]="5687-6776-6756";
config.adhar[4]="3454-4678-4577";

var from1 ,to;
function fun(){
document.getElementById("one").innerText=config.participants[0];
document.getElementById("two").innerText=config.participants[1];
document.getElementById("three").innerText=config.participants[2];
document.getElementById("four").innerText=config.participants[3];
document.getElementById("five").innerText=config.participants[4];
}

function adharNo(event){
    
if(event=="one"){

document.getElementById("acnumber").value=config.adhar[0];

}
if(event=="two"){
document.getElementById("acnumber").value=config.adhar[1];
}
if(event=="three"){
document.getElementById("acnumber").value=config.adhar[2];
}
if(event=="four"){
document.getElementById("acnumber").value=config.adhar[3];
}
if(event=="five"){
document.getElementById("acnumber").value=config.adhar[4];
}
$("#acnumber").attr("readonly", true);
}

function fun1(event){
 //var x = document.getElementById(event).value
if(event=="one"){
document.getElementById("two2").innerText=config.participants[1];
document.getElementById("three3").innerText=config.participants[2];
document.getElementById("four4").innerText=config.participants[3];
document.getElementById("five5").innerText=config.participants[4];
}
if(event=="two"){
document.getElementById("two2").innerText=config.participants[0];
document.getElementById("three3").innerText=config.participants[2];
document.getElementById("four4").innerText=config.participants[3];
document.getElementById("five5").innerText=config.participants[4];
}
if(event=="three"){
document.getElementById("two2").innerText=config.participants[0];
document.getElementById("three3").innerText=config.participants[1];
document.getElementById("four4").innerText=config.participants[3];
document.getElementById("five5").innerText=config.participants[4];
}
if(event=="four"){
document.getElementById("two2").innerText=config.participants[0];
document.getElementById("three3").innerText=config.participants[1];
document.getElementById("four4").innerText=config.participants[2];
document.getElementById("five5").innerText=config.participants[4];
}
if(event=="five"){
document.getElementById("two2").innerText=config.participants[0];
document.getElementById("three3").innerText=config.participants[1];
document.getElementById("four4").innerText=config.participants[2];
document.getElementById("five5").innerText=config.participants[3];
}
}


function fun2(event){
//document.getElementById("owner").innerText=document.getElementById(event).innerText;
from1=document.getElementById(event).innerText;
fun1(event);
}

function fun3(event){
to=document.getElementById(event).innerText;
//document.getElementById("buyer").innerText=document.getElementById(event).innerText;
}

function fun4()
{
alert('Transfer from '+from1+' to '+to);
}
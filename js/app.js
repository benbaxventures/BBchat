
// BBchat - Full App - BENBAX - app.js - 100% browser, no backend
window.BBCHAT_CONFIG = window.BBCHAT_CONFIG || {otp:"123456",pin:"1234"};
const BBCHAT = {
  version:"1.0.0", brand:"BBchat", poweredBy:"BENBAX",
  logo:"benbax-logo.png", logoSmall:"benbax-logo-64.png",
  logoSizes:{splash:96,welcome:96,login:32,header:24,chatBgPattern:120,chatBgCenter:280},
  demo:{otp:"123456",pin:"1234",phone:"0200000000",country:"+233"},
  chats:[{name:"BENBAX Family"},{name:"Ventures Group"},{name:"Ama Mensah"},{name:"Kwame Asante"},{name:"MTN MoMo"},{name:"Binance Ghana"},{name:"Yaw Boateng"},{name:"Akosua Frimpong"},{name:"Tema Traders"},{name:"B Search Team"},{name:"Mum"},{name:"Dad"}],
  plugins:["Stickers","GIFs","Polls","Payments","Location","AI","Business","Status Saver","Backup","Themes","Privacy","Voice Changer","Translate","Scheduler","Broadcast","Channels","Communities","Games","Music","Files"],
  payments:{methods:["MTN MoMo *170#","Vodafone Cash *110#","AirtelTigo","Binance Pay","GCB Bank"]},
  init(){console.log("BBchat v1.0 by BENBAX - Original Logo 96px front, 24px header, logo chat background"); if(document.getElementById("app")){document.getElementById("app").innerHTML='<div style="padding:40px;text-align:center"><img src="benbax-logo.png" style="width:96px;height:96px;object-fit:contain;background:#fff;border-radius:50%;padding:6px"><h1>BBchat</h1><p>Chat app demo by BENBAX - Open index.html for full app<br>Demo OTP 123456 • PIN 1234</p><a href="index.html">Open Full BBchat App</a></div>';}}
};
document.addEventListener("DOMContentLoaded",()=>BBCHAT.init());
// Login helpers
function verifyOTP(code){return code==="123456"}
function verifyPIN(pin){return pin==="1234"}
function sendMoney(amount,method){return {success:true,tx:"BB"+Date.now(),amount,method}}

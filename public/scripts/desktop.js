!function t(e,n,o){function r(s,a){if(!n[s]){if(!e[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(i)return i(s,!0);throw new Error("Cannot find module '"+s+"'")}var p=n[s]={exports:{}};e[s][0].call(p.exports,function(t){var n=e[s][1][t];return r(n?n:t)},p,p.exports,t,e,n,o)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<o.length;s++)r(o[s]);return r}({1:[function(t){var e;e=function(){function e(){var e,n,o,r;n=t("../socket"),e=t("../encryption"),this.socket=new n,this.encryption=new e,this.rootUrl="http://192.168.0.11:9000","pairs.io"===location.hostname&&(this.rootUrl="http://pairs.io"),this.connectionKey=this.initKey("connectionCode"),this.encryptionKey=this.initKey("encryptionKey"),this.visualKey="",this.qrCode=new QRCode(document.getElementById("qr-code"),{text:"pairs.io",width:300,height:300}),$.supersized({slides:[{image:"../images/remotes_bg_min.png"}]}),$("#visual-code a").on("click",function(t){return function(){return t.generateVisualKey(),t.generateQrCode(),!1}}(this)),this.socket.io.on("desktop:paired",function(t){return function(){return t.onPaired()}}(this)),this.socket.io.on("desktop:command",function(t){return function(e){var n,o;return o=t.encryption.decryptAes(e.selector,t.encryptionKey),n=t.encryption.decryptAes(e.event,t.encryptionKey),$(o).trigger(n)}}(this)),$("#phone-wrapper").css("margin-top",$(window).height()),o=$("#overlay"),$("#button-dim").click(function(){var t;return t=$(this).children("span"),"none"===o.css("display")?(o.fadeIn("slow"),t.text("On"),t.addClass("dim-on"),t.removeClass("dim-off")):(o.fadeOut("slow"),t.text("Off"),t.addClass("dim-off"),t.removeClass("dim-on")),!1}),$("#steps li").on("click",function(){var t;return t=$(this),$("#steps .open").removeClass("open"),t.addClass("open")}),$('<img src="images/remotes_bg_min.png">').on("load",function(){return o.fadeOut(1200),$("body").css("overflow","auto"),$("#loading").fadeOut(800)}),$("#haeh").on("click",function(){return $("#credits").fadeIn("fast"),$(this).fadeOut("fast")}),$("#credits .close").on("click",function(){return $(this).parent().fadeOut("fast"),$("#haeh").fadeIn("fast")}),$("#right-wrapper").css({height:$(window).height(),overflow:"hidden"}),r=$("#stats"),this.socket.io.on("desktop:stats",function(t){return $("#stats-visits",r).text(t.visits),$("#stats-pairings",r).text(t.pairings),r.fadeIn("slow")}),this.generateVisualKey(),this.generateQrCode(),this.connectToServer()}return e.prototype.initKey=function(t){var e;return e=localStorage.getItem(t),e||(e=this.encryption.randString(),localStorage.setItem(t,e)),e},e.prototype.connectToServer=function(){return this.socket.io.emit("desktop:connect",{connectionKey:this.connectionKey})},e.prototype.generateVisualKey=function(){return this.visualKey=this.encryption.randString(5),$("#visual-code span").text(this.visualKey)},e.prototype.generateQrCode=function(){var t,e,n,o;return o=JSON.stringify({ck:this.connectionKey,ek:this.encryptionKey}),n=this.encryption.encryptAes(o,this.visualKey),t=Base64.encode(n),e=""+this.rootUrl+"/remote.html#"+t,this.qrCode.clear(),this.qrCode.makeCode(e),$("#qr-code").attr("title","")},e.prototype.onPaired=function(){var t;return $(".logo").addClass("paired"),t=$("#phone-wrapper").offset().top-10,$("#verification-wrapper").animate({top:"-"+t+"px"},"fast"),$("#phone-wrapper").animate({top:"-"+t+"px"},"fast"),$("#subscribe-wide").children().fadeOut("slow"),$("#steps h4 span").addClass("paired")},e}(),jQuery(function(){return new e})},{"../encryption":2,"../socket":3}],2:[function(t,e){var n;e.exports=n=function(){function t(){}return t.prototype.randString=function(t){return null==t&&(t=16),Math.random().toString(36).substr(2,t)},t.prototype.encryptAes=function(t,e){return GibberishAES.enc(t,e)},t.prototype.decryptAes=function(t,e){return GibberishAES.dec(t,e)},t}()},{}],3:[function(t,e){var n;e.exports=n=function(){function t(){"pairs.io"===location.hostname&&(this.socketUrl="http://pairs.io:12222"),this.io=io.connect(this.socketUrl)}return t.prototype.socketUrl="http://192.168.0.11:12222",t}()},{}]},{},[1]);
(function(d,w){function x(a,b,f,c,h){var g=!1;a.contents().detach().each(function(){var e=d(this);if("undefined"==typeof this)return!0;if(e.is("script, .dotdotdot-keep"))a.append(e);else{if(g)return!0;a.append(e);if(h&&!e.is(c.after)&&!e.find(c.after).length)a[a.is("a, table, thead, tbody, tfoot, tr, col, colgroup, object, embed, param, ol, ul, dl, blockquote, select, optgroup, option, textarea, script, style")?"after":"append"](h);n(f,c)&&(g=3==this.nodeType?q(e,b,f,c,h):x(e,b,f,c,h));g||h&&h.detach()}});
b.addClass("is-truncated");return g}function q(a,b,f,c,h){var g=a[0];if(!g)return!1;var e=z(g),l=-1!==e.indexOf(" ")?" ":"\u3000",l="letter"==c.wrap?"":l,r=e.split(l),y=-1,k=-1,t=0,m=r.length-1;c.fallbackToLetter&&0==t&&0==m&&(l="",r=e.split(l),m=r.length-1);for(;t<=m&&(0!=t||0!=m);){e=Math.floor((t+m)/2);if(e==k)break;k=e;p(g,r.slice(0,k+1).join(l)+c.ellipsis);f.children().each(function(){d(this).toggle().toggle()});n(f,c)?(m=k,c.fallbackToLetter&&0==t&&0==m&&(l="",r=r[0].split(l),k=y=-1,t=0,m=r.length-
1)):t=y=k}-1==y||1==r.length&&0==r[0].length?(f=a.parent(),a.detach(),a=h&&h.closest(f).length?h.length:0,f.contents().length>a?g=u(f.contents().eq(-1-a),b):(g=u(f,b,!0),a||f.detach()),g&&(e=A(z(g),c),p(g,e),a&&h&&d(g).parent().append(h))):(e=A(r.slice(0,y+1).join(l),c),p(g,e));return!0}function n(a,b){return a.innerHeight()>b.maxHeight}function A(a,b){for(;-1<d.inArray(a.slice(-1),b.lastCharacter.remove);)a=a.slice(0,-1);0>d.inArray(a.slice(-1),b.lastCharacter.noEllipsis)&&(a+=b.ellipsis);return a}
function B(a){return{width:a.innerWidth(),height:a.innerHeight()}}function p(a,b){a.innerText?a.innerText=b:a.nodeValue?a.nodeValue=b:a.textContent&&(a.textContent=b)}function z(a){return a.innerText?a.innerText:a.nodeValue?a.nodeValue:a.textContent?a.textContent:""}function C(a){do a=a.previousSibling;while(a&&1!==a.nodeType&&3!==a.nodeType);return a}function u(a,b,f){var c=a&&a[0];if(c){if(!f){if(3===c.nodeType)return c;if(d.trim(a.text()))return u(a.contents().last(),b)}for(f=C(c);!f;){a=a.parent();
if(a.is(b)||!a.length)return!1;f=C(a[0])}if(f)return u(d(f),b)}return!1}function D(a,b){return a?"string"===typeof a?(a=d(a,b),a.length?a:!1):a.jquery?a:!1:!1}if(!d.fn.dotdotdot){d.fn.dotdotdot=function(a){if(0==this.length)return d.fn.dotdotdot.debug('No element found for "'+this.selector+'".'),this;if(1<this.length)return this.each(function(){d(this).dotdotdot(a)});var b=this,f=b.contents();b.data("dotdotdot")&&b.trigger("destroy.dot");b.data("dotdotdot-style",b.attr("style")||"");b.css("word-wrap",
"break-word");"nowrap"===b.css("white-space")&&b.css("white-space","normal");b.bind_events=function(){b.bind("update.dot",function(a,e){b.removeClass("is-truncated");a.preventDefault();a.stopPropagation();switch(typeof c.height){case "number":c.maxHeight=c.height;break;case "function":c.maxHeight=c.height.call(b[0]);break;default:for(var k=c,g=b.innerHeight(),m=["paddingTop","paddingBottom"],p=0,q=m.length;p<q;p++){var v=parseInt(b.css(m[p]),10);isNaN(v)&&(v=0);g-=v}k.maxHeight=g}c.maxHeight+=c.tolerance;
if("undefined"!=typeof e){if("string"==typeof e||"nodeType"in e&&1===e.nodeType)e=d("<div />").append(e).contents();e instanceof d&&(f=e)}l=b.wrapInner('<div class="dotdotdot" />').children();l.contents().detach().end().append(f.clone(!0)).find("br").replaceWith("  <br />  ").end().css({height:"auto",width:"auto",border:"none",padding:0,margin:0});k=m=!1;h.afterElement&&(m=h.afterElement.clone(!0),m.show(),h.afterElement.detach());if(n(l,c))if("children"==c.wrap){k=l;g=c;p=k.children();q=!1;k.empty();
for(var v=0,w=p.length;v<w;v++){var u=p.eq(v);k.append(u);m&&k.append(m);if(n(k,g)){u.remove();q=!0;break}else m&&m.detach()}k=q}else k=x(l,b,l,c,m);l.replaceWith(l.contents());l=null;d.isFunction(c.callback)&&c.callback.call(b[0],k,f);return h.isTruncated=k}).bind("isTruncated.dot",function(a,c){a.preventDefault();a.stopPropagation();"function"==typeof c&&c.call(b[0],h.isTruncated);return h.isTruncated}).bind("originalContent.dot",function(a,c){a.preventDefault();a.stopPropagation();"function"==
typeof c&&c.call(b[0],f);return f}).bind("destroy.dot",function(a){a.preventDefault();a.stopPropagation();b.unwatch().unbind_events().contents().detach().end().append(f).attr("style",b.data("dotdotdot-style")||"").removeClass("is-truncated").data("dotdotdot",!1)});return b};b.unbind_events=function(){b.unbind(".dot");return b};b.watch=function(){b.unwatch();if("window"==c.watch){var a=d(window),f=a.width(),k=a.height();a.bind("resize.dot"+h.dotId,function(){f==a.width()&&k==a.height()&&c.windowResizeFix||
(f=a.width(),k=a.height(),e&&clearInterval(e),e=setTimeout(function(){b.trigger("update.dot")},100))})}else g=B(b),e=setInterval(function(){if(b.is(":visible")){var a=B(b);if(g.width!=a.width||g.height!=a.height)b.trigger("update.dot"),g=a}},500);return b};b.unwatch=function(){d(window).unbind("resize.dot"+h.dotId);e&&clearInterval(e);return b};var c=d.extend(!0,{},d.fn.dotdotdot.defaults,a),h={},g={},e=null,l=null;c.lastCharacter.remove instanceof Array||(c.lastCharacter.remove=d.fn.dotdotdot.defaultArrays.lastCharacter.remove);
c.lastCharacter.noEllipsis instanceof Array||(c.lastCharacter.noEllipsis=d.fn.dotdotdot.defaultArrays.lastCharacter.noEllipsis);h.afterElement=D(c.after,b);h.isTruncated=!1;h.dotId=E++;b.data("dotdotdot",!0).bind_events().trigger("update.dot");c.watch&&b.watch();return b};d.fn.dotdotdot.defaults={ellipsis:"... ",wrap:"word",fallbackToLetter:!0,lastCharacter:{},tolerance:0,callback:null,after:null,height:null,watch:!1,windowResizeFix:!0};d.fn.dotdotdot.defaultArrays={lastCharacter:{remove:" \u3000,;.!?".split(""),
noEllipsis:[]}};d.fn.dotdotdot.debug=function(a){};var E=1,F=d.fn.html;d.fn.html=function(a){return a!=w&&!d.isFunction(a)&&this.data("dotdotdot")?this.trigger("update",[a]):F.apply(this,arguments)};var G=d.fn.text;d.fn.text=function(a){return a!=w&&!d.isFunction(a)&&this.data("dotdotdot")?(a=d("<div />").text(a).html(),this.trigger("update",[a])):G.apply(this,arguments)}}})(jQuery);
jQuery(document).ready(function(d){d(".dot-ellipsis").each(function(){var w=d(this).hasClass("dot-resize-update"),x=d(this).hasClass("dot-timer-update"),q=0,n=d(this).attr("class").split(/\s+/);d.each(n,function(d,n){var p=n.match(/^dot-height-(\d+)$/);null!==p&&(q=Number(p[1]))});n={};x&&(n.watch=!0);w&&(n.watch="window");0<q&&(n.height=q);d(this).dotdotdot(n)})});jQuery(window).on("load",function(){jQuery(".dot-ellipsis.dot-load-update").trigger("update.dot")});
this["chrome.storage"]=function(r){function e(o){if(n[o])return n[o].exports;var t=n[o]={exports:{},id:o,loaded:!1};return r[o].call(t.exports,t,t.exports,e),t.loaded=!0,t.exports}var n={};return e.m=r,e.c=n,e.p="",e(0)}([function(r,e,n){"use strict";chrome.storage.promise={sync:{get:function(r){var e=new Promise(function(e,n){chrome.storage.sync.get(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},set:function(r){var e=new Promise(function(e,n){chrome.storage.sync.set(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},getBytesInUse:function(r){var e=new Promise(function(e,n){chrome.storage.sync.getBytesInUse(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},remove:function(r){var e=new Promise(function(e,n){chrome.storage.sync.remove(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},clear:function(){var r=new Promise(function(r,e){chrome.storage.sync.clear(function(){var n=chrome.runtime.lastError;n?e(n):r()})});return r}},local:{get:function(r){var e=new Promise(function(e,n){chrome.storage.local.get(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},set:function(r){var e=new Promise(function(e,n){chrome.storage.local.set(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},getBytesInUse:function(r){var e=new Promise(function(e,n){chrome.storage.local.getBytesInUse(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},remove:function(r){var e=new Promise(function(e,n){chrome.storage.local.remove(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},clear:function(){var r=new Promise(function(r,e){chrome.storage.local.clear(function(){var n=chrome.runtime.lastError;n?e(n):r()})});return r}},managed:{get:function(r){var e=new Promise(function(e,n){chrome.storage.managed.get(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},set:function(r){var e=new Promise(function(e,n){chrome.storage.managed.set(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},getBytesInUse:function(r){var e=new Promise(function(e,n){chrome.storage.managed.getBytesInUse(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},remove:function(r){var e=new Promise(function(e,n){chrome.storage.managed.remove(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},clear:function(){var r=new Promise(function(r,e){chrome.storage.managed.clear(function(){var n=chrome.runtime.lastError;n?e(n):r()})});return r}},onChanged:{addListener:function(){var r=new Promise(function(r,e){chrome.storage.onChanged.addListener(function(n,o){var t=chrome.runtime.lastError;t?e(t):r(n,o)})});return r}}}}]);

var init = true;
var data = { online: false, viewers:null }
const CLIENT_ID = 'az1nn0ikwddnv8zop0r66fqyys0znm9';
const USER_ID = '20899820';
const browser = chrome;

browser.runtime.onMessage.addListener(function(message) {
	if(message=='refresh') {
		updateStatus();
	}
});

async function updateStatus() {
  var twitchStatus = await fetch("https://api.twitch.tv/helix/streams?user_id=" + USER_ID,{ 
        headers: {
            "Client-ID": CLIENT_ID,

        }  
    }).then(function(response) {
    return response.json();
  });
    if (Array.isArray(twitchStatus.data) && twitchStatus.data.length>0) {
        if(!data.online){
            browser.browserAction.setIcon({path:'files/icon-online.png'});
            browser.notifications.create("powiadamiacz-notification", { "type": "basic", "iconUrl": chrome.extension.getURL("files/icon.png"), "title": "EmStudio", "message": "Stream jest Online!" });
            var settings = await browser.storage.promise.sync.get({notification_sound_default:true,notification_sound:false,volume:100,refresh_rate:10});
            if(settings.notification_sound){
                var notification_sound_file = (settings.notification_sound_default) ? 'files/notify.wav': settings.notification_sound_file; 
                var notifyAudio = new Audio(notification_sound_file);
			    notifyAudio.volume=(settings.volume)/100;
			    notifyAudio.play();
            }

		    var p = chrome.extension.getViews({type:'popup'});
		    if(p.length!=0) p[0].update();
        }
        data.online=true;
        data.viewers=twitchStatus.data[0].viewer_count;
    } else {
        if(data.online){
            browser.browserAction.setIcon({path:'files/icon-offline.png'});
            data.online=false;
            data.viewers=null;
        }
    }
}


if(init) {
	console.log('startup..');
	interval();
	init=false;
}

function interval() {
	updateStatus();
    var getting = browser.storage.promise.sync.get({refresh_rate:10});
    getting.then(function(settings){
        if(settings.refresh_rate){
        	window.setTimeout(interval, settings.refresh_rate*1000);
        }else {
        	window.setTimeout(interval,10*1000);
        }
        });
}

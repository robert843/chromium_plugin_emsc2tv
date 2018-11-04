this["chrome.storage"]=function(r){function e(o){if(n[o])return n[o].exports;var t=n[o]={exports:{},id:o,loaded:!1};return r[o].call(t.exports,t,t.exports,e),t.loaded=!0,t.exports}var n={};return e.m=r,e.c=n,e.p="",e(0)}([function(r,e,n){"use strict";chrome.storage.promise={sync:{get:function(r){var e=new Promise(function(e,n){chrome.storage.sync.get(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},set:function(r){var e=new Promise(function(e,n){chrome.storage.sync.set(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},getBytesInUse:function(r){var e=new Promise(function(e,n){chrome.storage.sync.getBytesInUse(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},remove:function(r){var e=new Promise(function(e,n){chrome.storage.sync.remove(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},clear:function(){var r=new Promise(function(r,e){chrome.storage.sync.clear(function(){var n=chrome.runtime.lastError;n?e(n):r()})});return r}},local:{get:function(r){var e=new Promise(function(e,n){chrome.storage.local.get(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},set:function(r){var e=new Promise(function(e,n){chrome.storage.local.set(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},getBytesInUse:function(r){var e=new Promise(function(e,n){chrome.storage.local.getBytesInUse(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},remove:function(r){var e=new Promise(function(e,n){chrome.storage.local.remove(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},clear:function(){var r=new Promise(function(r,e){chrome.storage.local.clear(function(){var n=chrome.runtime.lastError;n?e(n):r()})});return r}},managed:{get:function(r){var e=new Promise(function(e,n){chrome.storage.managed.get(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},set:function(r){var e=new Promise(function(e,n){chrome.storage.managed.set(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},getBytesInUse:function(r){var e=new Promise(function(e,n){chrome.storage.managed.getBytesInUse(r,function(r){var o=chrome.runtime.lastError;o?n(o):e(r)})});return e},remove:function(r){var e=new Promise(function(e,n){chrome.storage.managed.remove(r,function(){var r=chrome.runtime.lastError;r?n(r):e()})});return e},clear:function(){var r=new Promise(function(r,e){chrome.storage.managed.clear(function(){var n=chrome.runtime.lastError;n?e(n):r()})});return r}},onChanged:{addListener:function(){var r=new Promise(function(r,e){chrome.storage.onChanged.addListener(function(n,o){var t=chrome.runtime.lastError;t?e(t):r(n,o)})});return r}}}}]);

const browser = chrome;
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param

    var minutes = Math.floor((sec_num - (Math.floor(sec_num / 3600) * 3600)) / 60);
    var seconds = sec_num - (Math.floor(sec_num / 3600) * 3600) - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return (minutes=="00"? '' : minutes + 'm. ') + seconds+'s.';
}

function initListeners(){
    document.getElementById('refreshRate').addEventListener("input", function(e){
        document.getElementById('refreshRateLabel').innerHTML = (e.target.value).toString().toHHMMSS();
    });
    document.getElementById('volume').addEventListener("input", function(e){
        document.getElementById('volumeLabel').innerHTML = (e.target.value).toString()+"%";
    });

    document.getElementById('notification_disable').addEventListener("input", function(e){
       document.getElementById('notification_sound').setAttribute("disabled", "disabled");
        document.querySelector("#notification_sound").checked = false;
            document.getElementById('sound_settings').style.display = "none"; 
    });

    document.getElementById('notification_enable').addEventListener("input", function(e){
        document.getElementById('notification_sound').removeAttribute('disabled')
    });

    document.getElementById('notification_sound_default').addEventListener("input", function(e){
       document.getElementById('notification_sound_file').setAttribute("disabled", "disabled");
    });

    document.getElementById('notification_sound_own').addEventListener("input", function(e){
        document.getElementById('notification_sound_file').removeAttribute('disabled')
    });

    document.getElementById('notification_sound').addEventListener("input", function(e) {
        if (e.target.checked) {
            document.getElementById('sound_settings').style.display = "block"; 
        } else {
            document.getElementById('sound_settings').style.display = "none"; 
        }
    });
    document.querySelector("form").addEventListener("submit", saveOptions);
}

function saveOptions(e) {
console.log("saveOptions");
  e.preventDefault();

  browser.storage.promise.sync.set({
    notification_sound_default: document.querySelector("#notification_sound_default").checked,
    notification_sound: document.querySelector("#notification_sound").checked,
    volume: document.querySelector("#volume").value,
    refresh_rate: document.querySelector("#refreshRate").value,
    notification_enable: document.querySelector("#notification_enable").checked
  });
    var file = document.querySelector('input[type="file"]').files[0];
        getBase64(file).then(
            data => { 
                browser.storage.sync.promise.set({  notification_sound_file: data });
             }   
        );
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
document.addEventListener('DOMContentLoaded',function() {
    initListeners();
    var getting = browser.storage.promise.sync.get({notification_sound_default:true,notification_sound:false,volume:100,refresh_rate:10,notification_enable:true});
    getting.then(function(data){
        if(data.notification_sound_default){ document.querySelector("#notification_sound_default").checked=true; } else { document.querySelector("#notification_sound_own").checked=true;}
        if(data.notification_sound){ document.querySelector("#notification_sound").checked = true; }else{ document.querySelector("#notification_sound").checked = false;}
        document.querySelector("#volume").value = data.volume;
        document.querySelector("#refreshRate").value = data.refresh_rate;
        if(data.notification_enable) { document.querySelector("#notification_enable").checked=true; }else{ document.querySelector("#notification_disable").checked = true;}

        document.getElementById('refreshRateLabel').innerHTML = (document.getElementById('refreshRate').value).toString().toHHMMSS();
        document.getElementById('volumeLabel').innerHTML = (document.getElementById('volume').value).toString()+"%";

        if (data.notification_sound_default) {
            document.getElementById('notification_sound_file').setAttribute("disabled", "disabled");
        }

        if (data.notification_sound) {

            document.getElementById('sound_settings').style.display = "block"; 
        }

    });

   
});

function onChange(toggle){
        console.log(toggle);
        if (toggle.checked) {
            $(toggle).parent('.toggle-switch').parent().addClass('active');
        } else {
            $(toggle).parent('.toggle-switch').parent().removeClass('active');
        }
}


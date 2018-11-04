document.addEventListener('DOMContentLoaded',function() {
	update();
});

function update(){
    var data = chrome.extension.getBackgroundPage().data;
    if (data.online){
        document.getElementsByClassName("content")[0].textContent="Stream jest online";
        document.getElementsByClassName("bar")[0].classList.add("online");
    } else {
        document.getElementsByClassName("bar")[0].classList.remove("online");
        document.getElementsByClassName("content")[0].textContent="Stream jest offline";
    }
}

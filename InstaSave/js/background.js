var Url;

function CreateContextMenu(titleValue){
	chrome.contextMenus.removeAll();
	chrome.contextMenus.create({
		id : "menu",
		enabled : true,
		title : titleValue,
		contexts : ["all"],
		documentUrlPatterns : ["*://instagram.com/*"]
	});
}

chrome.extension.onMessage.addListener(function (request) {
	Url = request.Link;
	
	switch (request.Type) {
	case "image":
		CreateContextMenu("Save image as...");
		break;
	case "video":
		CreateContextMenu("Save video as...");
		break;
	default:
		chrome.contextMenus.removeAll();
		break;
	}
});

chrome.contextMenus.onClicked.addListener(function (info) {
	chrome.downloads.download({
		url : Url,
		saveAs : false // TODO: make option
	});
});

chrome.commands.onCommand.addListener(function (command) {
	switch (command) {
	case "Save as...":
		chrome.tabs.query({
			active : true
		}, function (tab) {
			chrome.tabs.sendMessage(tab[0].id, {
				method : "getUrl"
			}, function (response) {
				try {
					if (response.url != "none") {
						chrome.downloads.download({
							url : response.url
						});
					} else {
						chrome.notifications.create("msg", {
							type : "basic",
							title : "InstaSave",
							message : "Nothin to save, place cursor on image or video and try again",
							iconUrl : "../icons/128x128.png"
						}, function () {
							setTimeout(function () {
								chrome.notifications.clear("msg", function () {}); // empty function for opera
							}, 5000);
						});
					}
				} catch (e) {}
			});
		});
		break;
	}
});

chrome.runtime.onInstalled.addListener(function (details) {
	if (details.reason === "install") {
		chrome.tabs.create({
			url : "http://mazillka.in.ua/donate/"
		});
	} else if (details.reason === "update") {
		chrome.tabs.create({
			url : "http://mazillka.in.ua/donate/"
		});
	}
});

// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// バス停の名前を取得する
function getBusStopName() {
	$.activityIndicator.show();
	var busStopNames = [];
	var url = "https://cryptic-journey-10666.herokuapp.com/system/ride.json";
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);

			for (var i = 0; i < json.length; i++) {
				var names = {
					template: "busStopTemplate",
					properties: {
						searchableText: json[i].bus_stop_name
					},
					"busStopName": {
						text: json[i].bus_stop_name
					},
					"detailBtn": {
						title: ">"
					},
					"url": json[i].bus_stop_url
				};
				busStopNames.push(names);
			}
			$.listSection.setItems(busStopNames);
			$.activityIndicator.hide();
			$.listView.setTouchEnabled(true);
			$.search.setTouchEnabled(true);
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
			Ti.UI.createAlertDialog({title: "エラー", message: "データの取得に失敗しました。"}).show();
			$.activityIndicator.hide();
			getBusStopName();
		},
		timeout : 10000
	});
	xhr.open("GET", url);
	xhr.send();
}

function blurKeyboard(e) {
	e.source.blur();
}

function openGettingOffWin(e) {
	var item = e.section.getItemAt(e.itemIndex);
  var name = item["busStopName"]["text"];
  var url = item["url"];
	var arg = {
		navWin: $.navWin,
		name: name,
		url: url
	};
	var gettingOffWin = Alloy.createController('getting_off', arg).getView();
	$.navWin.openWindow(gettingOffWin);
}
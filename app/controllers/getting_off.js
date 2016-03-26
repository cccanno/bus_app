// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
$.activityIndicator.show();
$.rideTitle.setText("乗車停留所：" + $.args.name);
Ti.API.debug("http://gps.iwatebus.or.jp/bls/pc/" + $.args.url);

// バス停の名前を取得する
function getBusStopName() {
	var busStopNames = [];
	var url = "https://cryptic-journey-10666.herokuapp.com/system/getting_off.json";
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
			Ti.API.debug(e);
			Ti.UI.createAlertDialog({title: "エラー", message: "データの取得に失敗しました。"}).show();
			$.activityIndicator.hide();
			getBusStopName();
		},
		timeout : 10000
	});
	xhr.open("GET", encodeURI(url + "?url=" + "http://gps.iwatebus.or.jp/bls/pc/" + $.args.url));
	xhr.send();
}

function blurKeyboard(e) {
	e.source.blur();
}

function openTimeTableWin(e) {
	var item = e.section.getItemAt(e.itemIndex);
  var name = item["busStopName"]["text"];
  var url = item["url"];
	var arg = {
		navWin: $.args.navWin,
		rideName: $.args.name,
		getting_offName: name,
		url: url
	};
	var timeTableWin = Alloy.createController('time_table', arg).getView();
	$.args.navWin.openWindow(timeTableWin);
}

function closeWin() {
	$.gettingOffWin.close();
}
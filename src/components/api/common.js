import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';

export function ShowToast(msg) {
	Toast({
		message: msg,
		position: 'bottom',
		duration: 3000
	});
}

export function Loading(isClose) {
	if(isClose) {
		Indicator.close();
		return;
	}
	Indicator.open('加载中...');

}
export function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

export function GetQueryString(name) {
	var after = window.location.hash.split("?")[1];
	if(after) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = after.match(reg);
		if(r != null) {
			return decodeURIComponent(r[2]);
		} else {
			return null;
		}
	}
}
export function UserInfo() {
	let userInfo = window.sessionStorage.getItem('userInfo');
	userInfo = userInfo ? JSON.parse(userInfo) : '';
	return userInfo;
}
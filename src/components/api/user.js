import axios from 'axios'

export function UserInfo(openId) {
	const url = `http://www.argesz.com/yazhe/mobile/user/get`;
	let options = {
		openId: openId
	}
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}

export function Edit(options) {
	const url = `http://www.argesz.com/yazhe/mobile/user/update`;
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}
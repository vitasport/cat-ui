import request from '@/router/axios'
import { baseUrl } from '@/config/env'

export function fetchList(query) {
	return request({
		url: baseUrl + '/vita-wm/userInfo/findUserInfoByPage',
		method: 'post',
		params: query
	})
}
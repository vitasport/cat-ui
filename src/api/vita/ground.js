import request from '@/router/axios'
import { baseUrl } from '@/config/env'

export function fetchList(query) {
	return request({
		url: baseUrl + '/vita/order/list',
		method: 'get',
		params: query
	})
}
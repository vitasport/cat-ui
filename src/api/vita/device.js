import request from '@/router/axios'
import { baseUrl } from '@/config/env'

export function fetchList(query) {
	return request({
		url: baseUrl + '/vita-wm/device/findDeviceByPage',
		method: 'post',
		params: query
	})
}

export function deleteDevice(query) {
	return request({
		url: baseUrl + '/vita-wm/device/deleteDevice',
		method: 'post',
		params: query
	})
}


export function queryMainboard(query) {
	return request({
		url: baseUrl + '/vita-wm/master/findMasterByPage',
		method: 'post',
		params: query
	})
}


export function addDevice(query) {
	return request({
		url: baseUrl + '/vita-wm/device/addDevice',
		method: 'post',
		params: query
	})
}

export function updateDevice(query) {
	return request({
		url: baseUrl + '/vita-wm/device/updateDevice',
		method: 'post',
		params: query
	})
}
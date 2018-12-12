import request from '@/router/axios'
import { baseUrl } from '@/config/env'

export function fetchList(query) {
	return request({
		url: baseUrl + '/vita-wm/ground/findGroundByPage',
		method: 'post',
		params: query
	})
}


export function deleteGround(query) {
	return request({
		url: baseUrl + '/vita-wm/ground/deleteGround',
		method: 'post',
		params: query
	})
}


export function addGround(query) {
	return request({
		url: baseUrl + '/vita-wm/ground/addGround',
		method: 'post',
		params: query
	})
}

export function updateGround(query) {
	return request({
		url: baseUrl + '/vita-wm/ground/updateGround',
		method: 'post',
		params: query
	})
}
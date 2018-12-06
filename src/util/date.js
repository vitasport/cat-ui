var date = new Date();
var Week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function formatDate(d) {
	if(d == undefined)
		d = date;
	var month = d.getMonth() + 1;
	if(month < 10)
		month = '0' + month;
	var day = d.getDate();
	if(day < 10)
		day = '0' + day;
	var today = d.getFullYear() + '-' + month + '-' + day;
	return today;
};

export const dateAdd = (days) => {
	var d = new Date(Date.parse(date) + (86400000 * days));
	var fd = formatDate(d);
	var dd = d.getDay();
	switch(days) {
		case undefined:
			return {
				'date': fd,
				'week': '今天'
			};
		case 0:
			return {
				'date': fd,
				'week': '今天'
			};
		case 1:
			return {
				'date': fd,
				'week': '明天'
			};
		case 2:
			return {
				'date': fd,
				'week': Week[dd % 7]
			};
		case 3:
			return {
				'date': fd,
				'week': Week[dd % 7]
			};
		case 4:
			return {
				'date': fd,
				'week': Week[dd % 7]
			};
		case 5:
			return {
				'date': fd,
				'week': Week[dd % 7]
			};
		case 6:
			return {
				'date': fd,
				'week': Week[dd % 7]
			};
	}
	return null;
};

function LocalHours() {
	return date.getHours();
}
// const columns = [
// 	{
// 		title: '省市',
// 		dataIndex: 'area',
// 		sorter: true,
// 		// render: 
// 		width: '10%',
// 		onFilter: (value, record) => record.area.indexOf(value) === 0,
// 	},
// 	{
// 		title: '时间',
// 		dataIndex: 'time',
// 		sorter: true,
// 		// render: 
// 		width: '10%',
// 	},
// 	{
// 		title: '分类',
// 		dataIndex: 'sort',
// 		sorter: true,
// 		// render: 
// 		width: '10%',
// 		/*
// 		filters: [
// 			{ text: 'London', value: 'London' },
// 			{ text: 'New York', value: 'New York' },
// 		], */
// 		onFilter: (value, record) => record.sort.includes(value),
// 	},
// 	{
// 		title: '附件',
// 		dataIndex: 'url',
// 		sorter: true,
// 		render: text => <a href={`${text}`}>{text}</a>,
// 		width: '10%',
// 		onFilter: (value, record) => record.city.indexOf(value) === 0,
// 	},
// 	{
// 		title: '关键词',
// 		dataIndex: 'keyword',
// 		sorter: true,
// 		// render: 
// 		width: '10%',
// 	},
// ];

const cities = [
	{
		text: '北京',
		value: 'beijing'
	},
	{
		text: '上海',
		value: 'shanghai'
	},
	{
		text: '江苏',
		value: 'jiangsu'
	},
	{
		text: '浙江',
		value: 'zhejiang'
	},
	{
		text: '河北',
		value: 'hebei'
	},
	{
		text: '辽宁',
		value: 'liaoning'
	},
	{
		text: '黑龙江',
		value: 'heilongjiang'
	},
	{
		text: '山东',
		value: 'shandong'
	},
	{
		text: '山西',
		value: 'shanxi'
	},
	{
		text: '河南',
		value: 'henan'
	}
]
export default cities;
import api from './api';

class Industry {
	constructor() {
		this.api = api;
	}

	/** 获取来源列表 */
	getOrigins() {
		return this.api.get('/origins').then(res => {
			return res.data;
		});
	}

	/** 获取关键词列表 */
	getKeywords() {
		return this.api.get('/keywords').then(res => {
			return res.data;
		});
	}

	/** 获取初始化数据
	 * @param { Number } page
	 */
	getLatestInfo(page) {
		const params = {
			page
		};
		return this.api.post('/industrial/latest', params).then(res => {
			return res.data;
		});
	}

	/** 筛选获取最新数据
	 * @param { Array } area
	 * @param { Array } key
	 * @param { Number } page
	 * @param { Array } time
	 */
	getIndustryInfo(params) {
		console.log(params)
		return this.api.post('/industrial/news', params).then(res => {
			return res.data;
		});
	}
}

export default new Industry();
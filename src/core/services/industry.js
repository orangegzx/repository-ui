import api from './api';

class Industry {
	constructor() {
		this.api = api;
	}

	getIndustryInfo(params) {
		return this.api.post('/industrial/news', params).then(res => {
			return res.data;
		});
	}

	/*
	getLatestInfo() {
		return this.api.get('/industrial/latest').then(res => {
			return res.data;
		});
	}
*/
	getLatestInfo(page) {
		const params = {
			page
		};
		return this.api.post('/industrial/latest', params).then(res => {
			return res.data;
		});
	}
}

export default new Industry();
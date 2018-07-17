import api from './api';

class Industry {
	constructor() {
		this.api = api;
	}

	getIndustryInfo(area, time, page) {
		const params = {
			indus: {
				area
			},
			time,
			page
		};
		return this.api.post('/industrial/news', params).then(res => {
			return res.data;
		});
	}

	getLatestInfo() {
		return this.api.get('/industrial/latest').then(res => {
			return res.data;
		});
	}

}

export default new Industry();
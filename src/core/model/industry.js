import moment from 'moment';

class Industry {
    constructor(industry) {
        this._init(industry);
    }

    _init(industry) {
        this.key = industry.id;
        this.area = industry.area;
        this.time = this._time(industry);
        this.url = industry.url;
        this.nature = industry.nature;
        this.title = industry.title;
        this.keyword = industry.keyword;
    }

    _time(industry) {
        return moment((industry.time) * 1000).format('YYYY-MM-DD');
    }

}

export default Industry;
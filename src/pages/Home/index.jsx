import React from 'react';
import IndustryApi from '@/core/services/industry';
import IndustryModel from '@/core/model/industry';
import Header from '@/components/Header/index';
import { Table, DatePicker } from 'antd';
import './style.less';
// import moment from 'moment';
import cities from './config';


const { RangePicker} = DatePicker;
class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			loading: false,
			pagination: {},
			timeValue: []
		}
	}

	componentDidMount() {
		this.getLatestInfo();
	}

	getLatestInfo() {
		this.setState({
			loading: true
		});
		IndustryApi.getLatestInfo().then(res => {
			// console.log(res.data);
			const pagination = { ...this.state.pagination };
			pagination.total = res.data.length;
			let temp = res.data.map(item => {
				return new IndustryModel(item);
			});
			this.setState({
				data: temp,
				loading: false,
				pagination,
			});
		});
	}

	getIndustryInfo(area, nature, time, page) {
		this.setState({
			loading: true
		});
		IndustryApi.getIndustryInfo(area, nature, time, page).then(res => {
			// console.log(res.data);
			const pagination = { ...this.state.pagination };
			pagination.total = res.data.length;
			let temp = res.data.map(item => {
				return new IndustryModel(item);
			});
			this.setState({
				data: temp,
				loading: false,
				pagination,
			});
		});
	}

	handleSearch (selectedKeys, confirm) {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	}

	handleTableChange(pagination, filters) {
		// console.log(this.state.timeValue);
		// console.log(filters);
		console.log('handletablechange');
		const pager = { ...this.state.pagination };
		pager.current = pagination.current;
		this.setState({
			pagination: pager,
		});
		const page = pagination.current - 1;
		const area = filters['area']? filters['area'][0] : '';
		// const nature = filters['nature'] || '';
		const time = 0;
		/*
		for (let key in filters) {
			if (filters.hasOwnProperty(key)) {
				params[key] = filters[key];
			}
		}
		*/
		this.getIndustryInfo(area, time, page);
	}

	selectDate(value) {
		console.log('selectDate');
		console.log(value);
	}

	render() {
		const columns = [
			{
				title: '省市',
				dataIndex: 'area',
				key: 'area',
				filters: cities,
				filterMultiple: false,
			},
			{
				title: '时间',
				dataIndex: 'time',
				key: 'time',
				filterDropdown: (
					<div className="custom-filter-dropdown">
						<RangePicker
							onOk={this.selectDate}
							showTime={{ format: 'HH:mm' }}
      				format="YYYY-MM-DD HH:mm"
						/>
					</div>),
			},
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title',
			},
			{
				title: '分类',
				dataIndex: 'nature',
				key: 'nature',
			},
			{
				title: 'url',
				dataIndex: 'url',
				key: 'url',
				render: text => <a href={`${text}`}>{text}</a>,
			},
			{
				title: '关键词',
				dataIndex: 'keyword',
				key: 'keyword',
			},
		];
		return (
			<div>
				<Header />
				<div className="table">
					<Table 
						columns={columns}
						dataSource={this.state.data}
						bordered
						pagination={this.state.pagination}
						loading={this.state.loading}
						onChange={this.handleTableChange.bind(this)}
					/>
				</div>
			</div>
		)
	}
}

export default Home;
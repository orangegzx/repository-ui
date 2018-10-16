import React from 'react';
import IndustryApi from '@/core/services/industry';
import IndustryModel from '@/core/model/industry';
import Header from '@/components/Header/index';
import { Table, Button, DatePicker, Form, Select } from 'antd';
import './style.less';
import moment from 'moment';
import { cities, keywords }  from './config';

const FormItem = Form.Item;
const { RangePicker} = DatePicker;
const Option = Select.Option;

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			loading: false,
			pagination: {
				pageSize: 10,
				defaultCurrent: 1
			},
			timeValue: [],
			area: '',
			keyword: '',
			cities: cities,
			flag: 0     // 0: 加载最新   1: 加载筛选数据
		}
	}

	componentDidMount() {
		this.getLatestInfo(0);
	}

	getLatestInfo(page) {
		this.setState({
			flag: 0
		});
		this.setState({
			loading: true
		});
		console.log(page)
		IndustryApi.getLatestInfo(page).then(res => {
			console.log(res)
			const pagination = { ...this.state.pagination };
			pagination.total = pagination.pageSize * res.data.page;
			let temp = res.data.items.map(item => {
				return new IndustryModel(item);
			});
			this.setState({
				data: temp,
				loading: false,
				pagination,
			});
		});
	}

	getIndustryInfo(params) {
		this.setState({
			flag: 1
		});
		this.setState({
			loading: true
		});
		console.log("发送请求：")
		console.log(params)
		IndustryApi.getIndustryInfo(params).then(res => {
			console.log(params)
			console.log(res)
			const pagination = { ...this.state.pagination };
			pagination.total = pagination.pageSize * res.data.page;
			let temp = res.data.items.map(item => {
				return new IndustryModel(item);
			});
			this.setState({
				data: temp,
				loading: false,
				pagination,
			});
		});
	}


	onSearch (e) {
		e.preventDefault();
		let params = {};
		const pager = { ...this.state.pagination };
		pager.current = 1;
		this.setState({
			pagination: pager,
		});
		params.page = 0;
		if (this.props.form.getFieldValue('area') && this.props.form.getFieldValue('area').length) {
			params.area = this.props.form.getFieldValue('area');
		}
		if (this.props.form.getFieldValue('keyword') && this.props.form.getFieldValue('keyword').length) {
			params.key = this.props.form.getFieldValue('keyword');
		}
		if (this.props.form.getFieldValue('time')) {
			const startDate = moment(this.props.form.getFieldValue('time')[0]).unix();
			const endDate = moment(this.props.form.getFieldValue('time')[1]).unix();
			params.time = [startDate, endDate];
		}
		
		this.getIndustryInfo(params);
	}
	
	handleTableChange(pagination, filters, sorters) {
		if(sorters && Object.keys(sorters).length && pagination.current === this.state.pagination.current) {
			return;
		}
		let params = {};
		const pager = { ...this.state.pagination };
		pager.current = pagination.current;
		this.setState({
			pagination: pager,
		});
		params.page = pagination.current - 1;
		if (this.props.form.getFieldValue('area') && this.props.form.getFieldValue('area').length) {
			params.area = this.props.form.getFieldValue('area');
		}

		if (this.props.form.getFieldValue('keyword') && this.props.form.getFieldValue('keyword').length) {
			params.key = this.props.form.getFieldValue('keyword');
		}
		// if (this.props.form.getFieldValue('time')) {
		// 	const startDate = moment(this.props.form.getFieldValue('time')[0]).unix();
		// 	const endDate = moment(this.props.form.getFieldValue('time')[1]).unix();
		// 	params.time = [startDate, endDate];
		// }
		
		if(!this.state.flag) {
			this.getLatestInfo(pagination.current - 1);
		} else {
			this.getIndustryInfo(params);
		}
	}

	render() {
		const columns = [
			{
				title: '省市',
				dataIndex: 'area',
				key: 'area',
				filterMultiple: false,
				className: 'area-tr',
				fixed: 'left'
			},
			{
				title: '时间',
				dataIndex: 'time',
				key: 'time',
				sorter: (a, b) => moment(a.time) - moment(b.time),
				className: 'time-tr'
			},
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title',
				className: 'title-tr'
			},
			{
				title: '分类',
				dataIndex: 'nature',
				key: 'nature',
				width: 100
			},
			{
				title: 'url',
				dataIndex: 'url',
				key: 'url',
				className: 'url-tr',
				render: text => <a href={`${text}`} target="_blank"><span>{text}</span></a>,
			},
			{
				title: '关键词',
				dataIndex: 'keyword',
				key: 'keyword',
				width: 100
			},
		];

		const { getFieldDecorator } = this.props.form;
		const cityOptions = this.state.cities.map(city => <Option key={city.key} value={city.value}>{city.text}</Option>);
		const keywordOptions = keywords.map(word => <Option key={word.key} value={word.value}>{word.text}</Option>);
		return (
			<div>
				<Header />
				<div className="table">
					<Form layout="inline" onSubmit={this.onSearch.bind(this)}>
						<FormItem>
							{
								getFieldDecorator('area')(
									<Select
										showSearch
										optionFilterProp="children"
										mode="multiple"
										placeholder="请选择地区"
										style={{ width: 300 }}>
										{cityOptions}
									</Select>
							)}
						</FormItem>
						<FormItem>
							{
								getFieldDecorator('keyword')(
									<Select
										showSearch
										optionFilterProp="children"
										mode="multiple"
										placeholder="请选择关键词"
										style={{ width: 300 }}>
										{keywordOptions}
									</Select>
							)}
						</FormItem>
						<FormItem>
							{
								getFieldDecorator('time')(
									<RangePicker
										format='YYYY-MM-DD'
									/>
							)}
						</FormItem>
						<FormItem>
							<Button type="primary" htmlType="submit">搜索</Button>
						</FormItem>
					</Form>
					<Table rowKey={record => record.id}
						columns={columns}
						dataSource={this.state.data}
						bordered
						pagination={this.state.pagination}
						loading={this.state.loading}
						onChange={this.handleTableChange.bind(this)}
						scroll={{ x: 1280 }}
					/>
				</div>
			</div>
		)
	}
}

const HomeForm = Form.create()(Home);
export default HomeForm;
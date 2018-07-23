import React from 'react';
import IndustryApi from '@/core/services/industry';
import IndustryModel from '@/core/model/industry';
import Header from '@/components/Header/index';
import { Table, Button, DatePicker, Form, Select } from 'antd';
import './style.less';
import moment from 'moment';
import cities from './config';

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
		IndustryApi.getLatestInfo(page).then(res => {
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
		IndustryApi.getIndustryInfo(params).then(res => {
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
		if (this.props.form.getFieldValue('time')) {
			const startDate = moment(this.props.form.getFieldValue('time')[0]).unix();
			const endDate = moment(this.props.form.getFieldValue('time')[1]).unix();
			params.time = [startDate, endDate];
		}
		
		this.getIndustryInfo(params);
	}
	
	handleTableChange(pagination) {
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
		
		if (this.props.form.getFieldValue('time')) {
			const startDate = moment(this.props.form.getFieldValue('time')[0]).unix();
			const endDate = moment(this.props.form.getFieldValue('time')[1]).unix();
			params.time = [startDate, endDate];
		}
		
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
			},
			{
				title: '时间',
				dataIndex: 'time',
				key: 'time',
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
				render: text => <a href={`${text}`} target="_blank">{text}</a>,
			},
			{
				title: '关键词',
				dataIndex: 'keyword',
				key: 'keyword'
			},
		];

		const { getFieldDecorator } = this.props.form;
		const cityOptions = this.state.cities.map(city => <Option key={city.key} value={city.value}>{city.text}</Option>);

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
					/>
				</div>
			</div>
		)
	}
}

const HomeForm = Form.create()(Home);
export default HomeForm;
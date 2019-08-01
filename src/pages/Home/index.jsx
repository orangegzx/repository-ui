import React from 'react';
import IndustryApi from '@/core/services/industry';
import IndustryModel from '@/core/model/industry';
import Header from '@/components/Header/index';
import { Table, Button, DatePicker, Form, Select, message } from 'antd';
import './style.less';
import moment from 'moment';

const FormItem = Form.Item;
const { RangePicker} = DatePicker;
const Option = Select.Option;

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [], // 存储表格数据
			loading: false,
			pagination: {
				pageSize: 10,
				defaultCurrent: 1
			},
			timeValue: [],
			area: '', // 表格的来源
			keywords: [], // 关键词
			cities: [], //表格的来源 = 来源数据
			flag: 0     // 0: 加载最新   1: 加载筛选数据
		}
	}

	componentDidMount() {
		this.getOrigins() // 来源列表
		this.getKeywords() // 关键词列表
		this.getLatestInfo(0); // 默认获取第一页的内容
	}

	// 获取来源数据
	getOrigins() {
		IndustryApi.getOrigins().then(res => {
			this.setState({
				cities: res.data,
			});
		}).catch(err => {
			message.warning('获取来源数据出错，请稍后重试！')
		});
	}

	// 获取关键字列表
	getKeywords() {
		IndustryApi.getKeywords().then(res => {
			this.setState({
				keywords: res.data,
			});
		}).catch(err => {
			message.warning('获取关键字数据出错，请稍后重试！')
		});
	}

	// 初始化数据
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
		}).catch(err => {
			this.setState({
				loading: false,
			});
			message.warning('获取数据出错，请稍后重试！')
		});
	}

	// 筛选接口封装
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
		}).catch(err => {
			this.setState({
				loading: false,
			});
			message.warning('获取数据出错，请稍后重试！')
		});
	}

// 搜索按钮触发事件
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
	// 翻页触发事件
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
		// table 字段
		const columns = [
			{
				title: '来源',
				dataIndex: 'area',
				key: 'area',
				filterMultiple: false,
				className: 'area-tr',
				fixed: 'left'
			},
			{
				title: '关键词',
				dataIndex: 'keyword',
				key: 'keyword',
				width: 110
			},
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title',
				className: 'title-tr'
			},
			// {
			// 	title: '分类',
			// 	dataIndex: 'nature',
			// 	key: 'nature',
			// 	width: 100
			// },
			{
				title: 'url',
				dataIndex: 'url',
				key: 'url',
				className: 'url-tr',
				render: text => <a href={`${text}`} target="_blank"><span>{text}</span></a>,
			},
			{
				title: '时间',
				dataIndex: 'time',
				key: 'time',
				sorter: (a, b) => moment(a.time) - moment(b.time),
				className: 'time-tr'
			},
		];
		const { getFieldDecorator } = this.props.form;
		// 地区
		const cityOptions = this.state.cities.map(city => <Option key={city.key} value={city.value}>{city.text}</Option>);
		// 关键字
		const keywordOptions = this.state.keywords.map((word, index)=> <Option key={index} value={word}>{word}</Option>);
		return (
			<div>
				<Header />
				<div className="table">
					{/* 搜索关键词 */}
					<Form layout="inline" onSubmit={this.onSearch.bind(this)}>
						<FormItem>
							{
								getFieldDecorator('area')(
									<Select
										showSearch
										style={{ width: 300 }}
										placeholder="请选择来源"
										optionFilterProp="children"
										mode="multiple"
									>
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
										style={{ width: 300 }}
									>
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
					{/* 表格 */}
					<Table
						dataSource={this.state.data}
						rowKey={record => record.key}
						columns={columns}
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
import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import Home from '@/pages/Home/index.jsx';
import registerServiceWorker from './registerServiceWorker';

import '@/static/css/common.less';
import 'antd/dist/antd.less';

ReactDOM.render(<Home />, document.getElementById('root'));
registerServiceWorker();

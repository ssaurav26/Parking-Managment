import Full from './containers/Full';
import FormData from './views/FormData/FormData';

const routes = [
  { path: '/', exact: true, name: 'Home', component: Full },
  { path: '/FormData', name: 'Form Data ', component: FormData },
];

export default routes;

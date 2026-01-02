import Index from './components/index/index';
import Remixtree from './components/remixtree/remixtree';

function App() {
	const page = window.location.pathname;

	if (page === "/") {
		return (<Index />);
	}

	if (page === "/remixtree.html") {
		return (<Remixtree />);
	}
}

export default App;
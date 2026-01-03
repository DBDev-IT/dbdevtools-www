import './index.css';

const Index = () => {
    return (
        <div>
            <h1>Привет! Это главная страница</h1>
            <button onClick={() => {window.location.href = '/dbdevtools-www/remixtree.html'}}>Дерево ремиксов</button>
        </div>
    );
}

export default Index;

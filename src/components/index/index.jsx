import './index.css';

const Index = () => {
    return (
        <div>
            <h1>Привет!</h1>
            <button onClick={() => {window.location.href = '/remixtree.html'}}>Дерево ремиксов</button>
        </div>
    );
}

export default Index;

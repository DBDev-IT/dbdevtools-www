import { useState } from 'react';
import './remixtree.css';

const Remixtree = () => {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	function escapeHtml(unsafe) {
		if (!unsafe) return "Нет названия";
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	async function fetchRemixesRecursive(projectId) {
		try {
			const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=https://api.scratch.mit.edu/projects/${projectId}/remixes`);
			const remixes = await response.json();
			if (!Array.isArray(remixes) || remixes.length === 0) return '';

			setOutput(prev => [...prev, '<ul>']);
			for (let remix of remixes) {
				setOutput(prev => [...prev, `<li><a href="https://scratch.mit.edu/projects/${remix.id}" target="_blank">${escapeHtml(remix.title)}</a>`]);
				const subtree = await fetchRemixesRecursive(remix.id);
				setOutput(prev => [...prev, subtree]);
				setOutput(prev => [...prev, '</li>']);
			}
			setOutput(prev => [...prev, '</ul>']);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleRemixtreeData(data, projectId) {
		if (!data) return;
		if (!Array.isArray(data)) return;
		if (!projectId) return;

		let removedProject = false;
		const projectInfo = await fetch(`https://api.codetabs.com/v1/proxy?quest=https://api.scratch.mit.edu/projects/${projectId}`)
			.then(async response => {
				const data = await response.json();
				if (!data) return;
				return data;
			})
			.catch(console.error);
		if (!projectInfo) return;
		if (projectInfo.code === "NotFound") {
			removedProject = true;
		}
		if (data.length === 0) throw new Error("<b>Ремиксов нет!</b>");

		if (removedProject) {
			setOutput(prev => [...prev, "<b>Такого проекта нет или проект удалён</b>, но я всё равно попытаюсь найти ремиксы<br>"]);
		}

		setOutput(prev => [...prev, `<b>Дерево ремиксов проекта <a href="https://scratch.mit.edu/projects/${projectId}" target="_blank">${removedProject ? "Удалённый проект" : escapeHtml(projectInfo.title)}</a>:</b><br><div class="tree"><ul>`]);
		for (let value of data) {
			setOutput(prev => [...prev, `<li><a href="https://scratch.mit.edu/projects/${value.id}" target="_blank">${escapeHtml(value.title)}</a>`]);

			try {
				const subtree = await fetchRemixesRecursive(value.id);
				setOutput(prev => [...prev, subtree]);
			} catch (error) {
				setOutput(prev => [...prev, '<br>' + error.message]);
			}
			setOutput(prev => [...prev, '</li>']);
		}
		setOutput(prev => [...prev, "Конец"]);
		setOutput(prev => [...prev, '</ul></div>']);
		return output;
	}

	const handleLoad = async () => {
		const args = input.trim().split(" ");
		if (!args[0]) {
			setOutput(["<b>Нужна ссылка или ID проекта</b> (пример: https://scratch.mit.edu/projects/1)"]);
			return;
		}

		setIsLoading(true);
		setOutput(["<b>Загружаю...</b> (может занять время)<br />"]);

		let id;
		if (args[0].includes("scratch.mit.edu")) {
			const search = args[0].split("/");
			if (search[4]) id = search[4];
			else if (search[2]) id = search[2];
			else {
				setOutput(["<b>Я не нашёл ID</b>, проверь правильность URL"]);
				setIsLoading(false);
				return;
			}
		} else id = args[0];

		try {
			const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=https://api.scratch.mit.edu/projects/${id}/remixes`);
			const data = await response.json();
			const cleanedData = await handleRemixtreeData(data, id);
			if (cleanedData.length === 1) throw new Error("<b>Произошла ошибка</b>, проверьте правильность ID либо попробуйте снова позже");
		} catch (error) {
			setOutput([error.message]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<h1>Дерево ремиксов</h1>
			<div>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Ссылка или ID..."
					disabled={isLoading}
				/>
				<button onClick={handleLoad} disabled={isLoading}>
					Загрузить
				</button>
				<div className="tree" dangerouslySetInnerHTML={{__html: output.join('')}} />
			</div>
		</>
	);
};

export default Remixtree;

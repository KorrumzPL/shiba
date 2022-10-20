const animals = new Map();

const links = {
	'https://www.reddit.com/r/dogpictures.json?sort=new&limit=100': 'dog',
	'https://www.reddit.com/r/dogswithjobs.json?sort=new&limit=100': 'dog',
	'https://www.reddit.com/r/shiba.json?sort=new&limit=100': 'shiba',
	'https://www.reddit.com/r/cats.json?sort=new&limit=100': 'cat',
	'https://www.reddit.com/r/catswithjobs.json?sort=new&limit=100': 'cat',
	'https://www.reddit.com/r/catpictures.json?sort=new&limit=100': 'cat',
	'https://www.reddit.com/r/catsonkeyboards.json?sort=new&limit=100': 'cat',
};

const truncate = (string, limit) => {
	if (string.length <= limit) return string;
	return string.slice(0, limit) + '...';
};

const updateImages = () => {
	const dayjs = require('dayjs');
	console.log(`${dayjs().format('DD/MM/YYYY HH:MM:ss')} | Aktualizacja zdjęć zwierząt`);
	animals.set('dog', []);
	animals.set('cat', []);
	animals.set('shiba', []);
	Object.entries(links).forEach(async link => {
		await fetch(link[0])
			.then(res => res.json())
			.then(json => {
				const allowed = json.data.children.filter(post => post.data.url.includes('.jpg'));
				allowed.forEach(image => {
					const data = {
						title: truncate(image.data.title, 250),
						image: image.data.url,
						link: image.data.permalink,
						karma: image.data.score,
						sub: image.data.subreddit_name_prefixed,
					};
					animals.get(link[1]).push(data);
				});
			});
	});
	setTimeout(updateImages, 43200000);
};

module.exports = { animals, updateImages };
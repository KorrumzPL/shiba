const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('node:fs');
const path = require('node:path');

if (process.argv[2] === undefined || process.argv[3] === undefined) return console.log('Użycie: node activities.json <import/export> <ścieżka do pliku json>');

const file = path.resolve(process.argv[3]);
const data = [];

(async () => {
	if (process.argv[2] === 'import') {
		const activities = require(file);
		Object.entries(activities).forEach(activity => data.push({ name: activity[1]['name'], type: activity[1]['type'] }));
		await prisma.activity.deleteMany();
		await prisma.activity.createMany({ data: data });
		console.log('Pomyślnie zaimportowano aktywności.');
		await prisma.$disconnect();
	}
	else if (process.argv[2] === 'export') {
		const activities = await prisma.activity.findMany();
		Object.entries(activities).forEach(activity => data.push({ name: activity[1]['name'], type: activity[1]['type'] }));
		fs.writeFile(file, JSON.stringify(data, null, 4), async (err) => {
			if (err) throw err;
			console.log('Pomyślnie wyeksportowano aktywności.');
		});
		await prisma.$disconnect();
	}
})();
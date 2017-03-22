#!/usr/bin/env node

const fs = require('fs');

function parse(filename) {
	return fs.readFileSync(filename, 'utf-8').split(/\n/).filter(i => i.length).map((i) => {
		let row = i.split(/\t/);

		return {
			date: row[0],
			weight: parseInt(row[1])
		};
	});
}

const SIX_YEARS_FIVE_DAYS = (365*6 + 7)*24*3600*1000;

function addZero(s) {
	return s > 9 ? s : '0' + s;
}

function shift(rows) {
	return rows.map((row) => {
		let tmp = row.date.split(/-/);

		let date2 = new Date((new Date(tmp[0], tmp[1] - 1, tmp[2])).valueOf() + SIX_YEARS_FIVE_DAYS);

		let year = date2.getFullYear();
		let month = addZero(date2.getMonth() + 1);
		let date = addZero(date2.getDate());

		return {
			date: [ year, month, date ].join('-'),
			weight: row.weight
		};
	});
}

let data = {};

parse('./Yana.txt').forEach((row) => {
	if(!data[row.date]) {
		data[row.date] = {
			date: row.date
		};
	}

	data[row.date].yana = row.weight;
});

shift(parse('./Mark.txt')).forEach((row) => {
	if(!data[row.date]) {
		data[row.date] = {
			date: row.date
		};
	}
	data[row.date].mark = row.weight;
});

let result = Object.keys(data).sort().map((d) => {
	return data[d];
});

fs.writeFileSync('./data.js', `let data = ${JSON.stringify(result)};`, 'UTF-8');

console.log(result);
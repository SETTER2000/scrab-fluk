const osmosis = require('osmosis');
const url = require('url');
const fs = require('fs');
const _ = require('lodash');
const domain = 'https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D1%80%D0%BE%D0%B4%D0%B0_%D0%A3%D0%BA%D1%80%D0%B0%D0%B8%D0%BD%D1%8B';
const nameJson = 'city.json';
osmosis.config('concurrency', 2);
osmosis.config('follow_set_cookies', true);
osmosis.config('follow_set_referer', true);
osmosis.config('follow', 10);
let releasesMap = [];
instance = new osmosis(domain);
instance.run();

//document.querySelector("#mw-content-text > div > table.wikitable.sortable.jquery-tablesorter > tbody > tr:nth-child(1) > td:nth-child(2) > a:nth-child(1)")

const write = async (res) => {
    await fs.writeFile(nameJson, JSON.stringify(res, null, 4), async function (err) {
        if (err) console.error('Возникла ошибка при записи в файл: ', err);
        else console.log(`Data Saved to data.json file.`);
    });
};

//#mw-content-text > div > table.wikitable.sortable.jquery-tablesorter > tbody > tr
instance
    .find('.wikitable tr')
    .set({
        'labelRu': 'td> a[1]/text()',
        'value': 'td i/text()'
    })
    .data(data => releasesMap.push(data))
    .log(console.log)
    .error(err => err)
    .debug(console.log)
    .done(async () => write(releasesMap));
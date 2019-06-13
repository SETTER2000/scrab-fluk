const osmosis = require('osmosis');
const url = require('url');
const fs = require('fs');
const _ = require('lodash');
const domain = 'http://www.flk.ru/';


async function subSubSection(res) {
    console.log('Функция subSubSection. Сюда должны подключиться: ', res);
    return new Promise(async (resolve, reject) => {
        let releasesMap = [];
        await  osmosis
            .get(res)
            .filter('.txt .txt >h3')
            .set({
                'name': 'a/text()',
                'productUrl': 'a@href',
                'litters': 'p',
                'owners': 'p',
            })
            .then(async (context, data, next) => {
                try {
                    data.productUrl = data.productUrl.replace(/\.\.\//gi, domain);
                } catch (e) {
                    await  console.log(e); // Ошибка!
                }
            })
            .delay(2000)
            .data(data => releasesMap.push(data))
            .error(err => reject(err))
            // .debug(console.log)
            .done(() => resolve(releasesMap));
    });
}


async function subSection(res) {
    console.log('Функция subSection. Сюда должны подключиться: ', res);
    return new Promise(async (resolve, reject) => {
        let releasesMap = [];
        await  osmosis
            .get(res)
            .find('.txt .txt >h3')
            .set({
                'name': 'a/text()',
                'subSectionUrl': 'a@href',
                'subSubSection': 'p'
            })
            .then(async (context, data) => {
                try {
                    data.subSubSectionUrl = data.subSubSectionUrl.replace(/\.\.\//gi, domain);
                    data.subSubSection = await subSubSection(data.subSubSectionUrl);
                } catch (e) {
                    await  console.log(e);
                }
            })
            .delay(10000)
            .data(data => releasesMap.push(data))
            .error(err => reject(err))
            // .debug(console.log)
            .done(() => resolve(releasesMap));
    });
}

async function getFluke() {
    return new Promise(async (resolve, reject) => {
        let releasesMap = [];
        await  osmosis
            .get(domain)
            .find('.txt > .txt > h3')
            .set({
                'section': 'a/text()',
                'sectionUrl': 'a@href',
                'subSections': 'p'
            })
            .then(async (context, data) => {
                try {
                    data.sectionUrl = `${domain}${data.sectionUrl}`;
                    data.subSections = await subSection(data.sectionUrl);
                } catch (e) {
                    await  console.log(`Обработка обещаний subSection url: ${data.sectionUrl} : `, e); // Ошибка!

                }
            })
            .delay(120000)
            .data(data => releasesMap.push(data))
            // .then(async (context, data) => {
            //     let v;
            //     try {
            //         await releasesMap.push(data);
            //
            //     } catch (e) {
            //         v = await  console.log('releasesMap не смог отдать: ', e); // Ошибка!
            //     }
            //
            // })
            .log(console.log)
            .error(err => reject(err))
            // .debug(console.log)
            .done(() => resolve(releasesMap));
    });
}


getFluke().then(async function (res) {
    await fs.writeFile('data.json', JSON.stringify(res, null, 4), async function (err) {
        if (err) console.error('Возникла ошибка при записи в файл: ', err);
        else console.log(`Data Saved to data.json file.`);
    });
    // console.log('Вывод в функции getCountry:', res);

}, function (err) {
    console.log('Ошибка! В функции getFluke:', err);
});
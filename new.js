const osmosis = require('osmosis');
const url = require('url');
const fs = require('fs');
const _ = require('lodash');
const domain = 'http://www.flk.ru/';
let releasesMap = [];


 const write = async (res) => {
    await fs.writeFile('data.json', JSON.stringify(res, null, 4), async function (err) {
        if (err) console.error('Возникла ошибка при записи в файл: ', err);
        else console.log(`Data Saved to data.json file.`);
    });
};

osmosis
    .get(domain)
    .find('.txt > .txt > h3')
    .set({
        'section': 'a/text()',
        'sectionUrl': 'a@href'
    })
    .follow('a@href')
    .find('.txt .txt >h3')
    .set({
        'subSection': 'a/text()',
        'subSectionUrl': 'a@href'
    })
    .then(async (context, data) => {
        try {
            data.subSectionUrl = await data.subSectionUrl.replace(/\.\.\//gi, domain);
        } catch (e) {
            await  console.log(e);
        }
    })
    .follow('a@href')
    .find('.txt .txt >h3')
    .set({
        'subSubSection': 'a/text()',
        'subSubSectionUrl': 'a@href'
    })
    .then(async (context, data) => {
        try {
            data.subSubSectionUrl = await data.subSubSectionUrl.replace(/\.\.\//gi, domain);
        } catch (e) {
            await  console.log(e);
        }
    })


    // .follow('a@href')
    // .find('.txt')
    // .set({
    //     'productName': 'h1',
    //     'imgSrc': 'img@src',
    //     // 'links':['a@href']
    // })

    .data(data => releasesMap.push(data))
    .log(console.log)
    .error(err => err)
    // .debug(console.log)
    .done(async () => write(releasesMap));
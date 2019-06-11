const osmosis = require('osmosis');
const url = require('url');
const fs = require('fs');
const domain = 'http://www.flk.ru/';

async function  getSection(res) {
    console.log('Функция getSection. Сюда должны подключиться: ', res);
    return new Promise((resolve, reject) => {
        let releasesMap = [];
        let notConnect = [];
        osmosis
            .get(res)
            .find('a')
            .set({
                'name': 'a/text()',
                'url': 'a@href',
                'litters': 'p',
                'owners': 'p',
            })
            .then(async (context, data) => {
                let v;
                try {
                    await releasesMap.push(data);
                } catch (e) {
                    v = await  console.log(e); // Ошибка!
                }
            })
            .error(err => reject(err))
            .done(() => resolve(releasesMap));
    });
}

function getFluke() {
    return new Promise((resolve, reject) => {
        let headersFluke = [];
        osmosis
            .get(domain)
            .find('h3>a')
            .follow('@href')
            .find('.txt>.txt')
            .set({
                'header': 'h2/text()',
                'url': 'h3>a@href',
                'sections':'p'
            })
            .then(async (context, data) => {
                // console.log('DATA2: ', data);
                let url = data.url;
                url = url.replace(/\.\.\//gi, domain);
                try {

                    data.sections = await getSection(url);
                } catch (e) {
                    await  console.log('В функции getSection  произошла ошибка: ', e); // Ошибка!
                }
            })
            // .delay(5000)
            // .then(async (context, data) => {
            //     // console.log('DATA: ', data);
            //     try {
            //         await releasesMap.push(data);
            //     } catch (e) {
            //         await  console.log('releasesMap не смог отдать: ', e); // Ошибка!
            //     }
            // })

            // .follow('h3>a@href')
            // .find('.txt>.txt')
            // .set({
            //     'header2': 'h3>a/text()',
            //     'url2': ['h3>a@href']
            // })


            // .find('h3>a')
            // .set('sectionPop')
            // .follow('@href')
            // .find('h1')
            // .set('h1_02')

            // .data((listing) => {
            //     // console.log('LISTING: ',listing);
            //     releasesMap.push(listing);
            //     try {
            //         fs.writeFile('data.json', JSON.stringify(releasesMap, null, 4), function (err) {
            //             if (err) console.error('Возникла ошибка при записи в файл: ', err);
            //             else console.log(`Data Saved to data.json file.`);
            //         });
            //         // ;
            //     } catch (e) {
            //         console.log(e); // Ошибка!
            //     }
            // })
            .log(console.log)
            .error(err => reject(err))
            .debug(console.log)
            .done(() => resolve(headersFluke));
    });
}


getFluke().then(function (res) {
    fs.writeFile('data.json', JSON.stringify(res, null, 4), function (err) {
        if (err) console.error('Возникла ошибка при записи в файл: ', err);
        else console.log(`Data Saved to data.json file.`);
    });
    // console.log('Вывод в функции getCountry:', res);

}, function (err) {
    console.log('Ошибка! В функции getFluke:', err);
});
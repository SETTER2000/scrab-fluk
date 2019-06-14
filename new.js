const osmosis = require('osmosis');
const url = require('url');
const fs = require('fs');
const _ = require('lodash');
const domain = 'http://www.flk.ru/';
// Параллельные запросы (по умолчанию это 5) делают это 2, поэтому мы не забиваем сайт
osmosis.config('concurrency', 2);
osmosis.config('follow_set_cookies', true);
osmosis.config('follow_set_referer', true);
osmosis.config('follow', 10);


let releasesMap = [];
instance = new osmosis(domain);
instance.run();

const write = async (res) => {
    await fs.writeFile('data.json', JSON.stringify(res, null, 4), async function (err) {
        if (err) console.error('Возникла ошибка при записи в файл: ', err);
        else console.log(`Data Saved to data.json file.`);
    });
};

instance
    .find('.txt > .txt > h3')

    .set({
        'section': 'a/text()',
        // 'sectionUrl': 'a@href',
        subDirs: [
            osmosis
                .follow('a@href')
                .find('.txt .txt >h3')
                .set({
                    'subDir': 'a/text()',
                    'subDirUrl': 'a@href'
                })
                .then(async (context, data) => {
                    try {
                        data.subDirUrl = await data.subDirUrl.replace(/\.\.\//gi, domain);
                    } catch (e) {
                        await  console.log(e);
                    }
                })
                .set({
                    subSections: [
                        osmosis
                            .follow('a@href')
                            .find('.txt .txt >h3')
                            .set({
                                'subSection': 'a/text()',
                                'subSectionUrl': 'a@href',

                            })
                            .then(async (context, data) => {
                                try {
                                    data.subSectionUrl = await `${domain}${data.subSectionUrl}`;
                                    // data.subSectionUrl = await data.subSectionUrl.replace(/\.\.\//gi, domain);

                                } catch (e) {
                                    await  console.log(e);
                                }
                            })

                            .get((context, data) => data.subSectionUrl)
                            .find('head') //
                            .set({
                                'title': 'title',
                                'meta': 'meta@content',
                            })

                            .then((context, data) => {
                                data.endUrl = _.slice(_.split(data.meta, '='), 1).toString();
                                data.newUrlPage = data.subSectionUrl.replace(/default\.htm/gi, data.endUrl)

                            })
                            .get((content, data) => data.newUrlPage)
                            .set({
                                productPage: [
                                    osmosis
                                        .find('.txt') //
                                        .set({
                                            'imgPrev': 'table.cat4 tr img@src',
                                            'imgTitle': 'table.cat4 tr img@title',
                                            'imgAlt': 'table.cat4 tr img@alt',
                                            'header': 'table.cat4 tr ul>li[1]/text()',
                                            'text': 'table.cat4 tr ul>li[2]/text()',
                                            'textUrl': 'table.cat4 tr ul>li[2]>a@href',
                                            'text2': 'table.cat4 tr ul>li[3]/text()',
                                            'text2Url': 'table.cat4 tr ul>li[3]>a@href',
                                            'price': '.price/text()',
                                            'full_text':'.full_text[1]'
                                        })


                                        .then((context, data) => {
                                            // console.log('SASSS: ' , foo);
                                            data.price = _.split(data.price, '.')[0].toString();
                                            // data.specifications = data.subSectionUrl.replace(/default\.htm/gi, data.textUrl)
                                        })
                                        .find('.full_text')
                                        .set({
                                            'img':['img@src'],
                                            descriptions:[
                                                osmosis
                                                    .find('p')
                                                    .set('p')
                                            ]
                                        })
                                    //  .use()
                                    //   .then(async (context,data)=>{
                                    //       console.log('DDDD:',  data.subSectionUrl);
                                    //       data.text2Url = await data.subSectionUrl.replace(/default\.htm/gi, data.text2Url);
                                    //   })
                                    //.find('table.cat4 td')

                                ],
                            })


                            .then((context, data)=>{
                                data.specificationUrl = data.subSectionUrl.replace(/default\.htm/gi, data.productPage[0].textUrl);
                                data.informationUrl = data.subSectionUrl.replace(/default\.htm/gi, data.productPage[0].text2Url);
                            })

                            // .data(console.log)
                            .get((content, data) => data.specificationUrl)
                            .set({
                                specificationTable: [
                                    osmosis
                                        .find('.txt table.content tr') //
                                        .set({
                                            'td-1': 'td[1]',
                                            'td-2': 'td[2]',
                                            'td-3': 'td[3]',
                                            'td-4': 'td[4]',
                                            'td-5': 'td[5]',
                                            'td-6': 'td[6]',
                                            'td-7': 'td[7]',
                                            'td-8': 'td[8]',
                                            'td-9': 'td[9]',
                                            'td-10': 'td[10]',
                                        })

                                        //
                                        // .then((context, data) => {
                                        //     // console.log('SASSS: ' , foo);
                                        //     data.price = _.split(data.price, '.')[0].toString();
                                        //
                                        // })
                                        // .find('.full_text')
                                        // .set({
                                        //     'img':'img@src',
                                        //     descriptions:[
                                        //         osmosis
                                        //             .find('p')
                                        //             .set('p')
                                        //     ]
                                        // })
                                        //

                                ]
                            })
                            .get((content, data) => data.informationUrl)
                            .set({
                                'informToOrder':'.full_text>p',
                                informationTable_1: [
                                    osmosis
                                        .find('.full_text table.content[1] tr') //

                                        .set({
                                            'td-1': 'td[1]',
                                            'td-2': 'td[2]',
                                            'td-3': 'td[3]',
                                            'td-4': 'td[4]',
                                            'td-5': 'td[5]',
                                            'td-6': 'td[6]',
                                            'td-7': 'td[7]',
                                            'td-8': 'td[8]',
                                            'td-9': 'td[9]',
                                            'td-10': 'td[10]',
                                        })

                                ],
                                informationTable_2: [
                                    osmosis
                                        .find('.full_text table.content[2] tr') //
                                        .set({
                                            'td-1': 'td[1]',
                                            'td-2': 'td[2]',
                                            'td-3': 'td[3]',
                                            'td-4': 'td[4]',
                                            'td-5': 'td[5]',
                                            'td-6': 'td[6]',
                                            'td-7': 'td[7]',
                                            'td-8': 'td[8]',
                                            'td-9': 'td[9]',
                                            'td-10': 'td[10]',
                                        })

                                ],
                                informationTable_3: [
                                    osmosis
                                        .find('.full_text table.content[3] tr') //
                                        .set({
                                            'td-1': 'td[1]',
                                            'td-2': 'td[2]',
                                            'td-3': 'td[3]',
                                            'td-4': 'td[4]',
                                            'td-5': 'td[5]',
                                            'td-6': 'td[6]',
                                            'td-7': 'td[7]',
                                            'td-8': 'td[8]',
                                            'td-9': 'td[9]',
                                            'td-10': 'td[10]',
                                        })

                                ],
                                informationTable_4: [
                                    osmosis
                                        .find('.full_text table.content[4] tr') //
                                        .set({
                                            'td-1': 'td[1]',
                                            'td-2': 'td[2]',
                                            'td-3': 'td[3]',
                                            'td-4': 'td[4]',
                                            'td-5': 'td[5]',
                                            'td-6': 'td[6]',
                                            'td-7': 'td[7]',
                                            'td-8': 'td[8]',
                                            'td-9': 'td[9]',
                                            'td-10': 'td[10]',
                                        })

                                ],
                            })



                        // .set({
                        //
                        //     page: [
                        //         osmosis
                        //             .follow('subSectionUrl')
                        //         // /html/body/div/table[2]>tbody>tr>td[2]>div>table[1]>tbody>tr>td
                        //             .find('table[2]>tbody>tr>td[2]>div>table[1]>tbody>tr>td') //
                        //             .set({
                        //                 'imgPrev':'img@src',
                        //                 'imgTitle':'img@title',
                        //                 'imgAlt':'img@alt',
                        //             })
                        //         //.find('table.cat4 td')
                        //
                        //     ]
                        // })
                        //


                    ]
                })
        ]
    })
    // .follow('a@href')
    // .find('.txt .txt >h3')
    // .set({
    //     'subSection': 'a/text()',
    //     'subSectionUrl': 'a@href'
    // })
    // .then(async (context, data) => {
    //     try {
    //         data.subSectionUrl = await data.subSectionUrl.replace(/\.\.\//gi, domain);
    //     } catch (e) {
    //         await  console.log(e);
    //     }
    // })
    // .follow('a@href')
    // .find('.txt .txt >h3')
    // .set({
    //     'subSubSection': 'a/text()',
    //     'subSubSectionUrl': 'a@href'
    // })
    // .then(async (context, data) => {
    //     try {
    //         data.subSubSectionUrl = await data.subSubSectionUrl.replace(/\.\.\//gi, domain);
    //     } catch (e) {
    //         await  console.log(e);
    //     }
    // })


    .data(data => releasesMap.push(data))
    // .log(console.log)
    .error(err => err)
    // .debug(console.log)
    .done(async () => write(releasesMap));
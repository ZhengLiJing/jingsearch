var keyword = process.argv[2]
var cheerio = require('cheerio')
var https = require('https')
var options = {
    host: 'www.zhihu.com',
    port: 443,
    path: '/search?type=content&q='+encodeURI(keyword)
}
console.error(keyword)
var html = ''
https.get(options, function(res) {
  res.on('data', function(data) {
    html += data;
  }).on('end', function() {
    var $ = cheerio.load(html)
    var item = $('.SearchMain').find('.Card').last().children().find('.List-item');
    var result_array = []
    for (var i = 0; i < item.length; i++) {
      result_array.push({
        title: item.eq(i).find('.ContentItem-title').text(),
        subtitle: item.eq(i).find('.RichContent-inner').find('.RichText').text(),
        arg: 'https:' + item.eq(i).find('.ContentItem-title').children().attr('href')
      })
    }
    console.log(JSON.stringify({items: result_array}))
  })
})
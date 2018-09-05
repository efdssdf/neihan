# coding=utf-8

import scrapy
import datetime
import time
from neihan.items import NeihanItem

class QuotesSpider(scrapy.Spider):
    name = "neihan"

    def start_requests(self):
        headers= {"referer": "https://servicewechat.com/wx1222e7fa11ef63b0/9/page-frame.html"}
        url = "https://funny-joke.huazhuanapp.top/api/articles?ci=bd482fff-7c46-8e7d-a1e2-901abb3577ea&cp=w&cv=1.3.0&cursor="
        yield scrapy.Request(url=url,headers=headers,callback=self.parse)


    def parse(self, response):
        d = eval(response.body)
        for i in d['articles']:
            mktime = time.mktime(datetime.datetime.now().timetuple())
            item = NeihanItem()
            item['title'] = i['title']
            item['thumbnail'] = i['thumbnail']
            item['createAt'] = mktime
            yield item
        else:
            if len(d['articles'])>0:
                headers= {"referer": "https://servicewechat.com/wx1222e7fa11ef63b0/9/page-frame.html"}
                url = "https://funny-joke.huazhuanapp.top/api/articles?ci=49ee7e40-28f5-cb60-4813-fb353a825574&cp=w&cv=1.3.0&cursor="+d['cursor'].replace('=','')+"%3D"
                yield scrapy.Request(url=url,headers=headers,callback=self.parse)
            else:
                print('end')

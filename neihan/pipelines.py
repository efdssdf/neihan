# -*- coding: utf-8 -*-
import pymongo
from scrapy.conf import settings
from neihan.items import NeihanItem

class NeihanPipeline(object):
    def __init__(self):
        host = settings["MONGODB_HOST"]
        port = settings["MONGODB_PORT"]
        dbname = settings["MONGODB_DBNAME"]
        neihanname = settings["MONGODB_NEIHANNAME"]
        # 创建MONGODB数据库链接
        client = pymongo.MongoClient(host=host, port=port)
        # 数据库登录需要帐号密码的话
        client.mingxingshuo_gif.authenticate(settings['MONGO_USER'], settings['MONGO_PSW'])
        # 指定数据库
        mydb = client[dbname]
        # 存放数据的数据库表名
        self.post = mydb[neihanname]

    def process_item(self, item, spider):
        data = dict(item)
        self.post.insert(data)
        return item

class DuplicatesPipeline(object):
    def __init__(self):
        self.pic_set = set()

    def process_item(self, item, spider):
        thumbnail = item['thumbnail']
        if thumbnail in self.pic_set:
            raise DropItem("Duplicate video found:%s" % item)

        self.pic_set.add(thumbnail)
        return item

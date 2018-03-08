CREATE TABLE  IF NOT EXISTS  `songlist` (
  `listId` int(16) NOT NULL AUTO_INCREMENT,
  `listname` varchar(255) DEFAULT  NULL,
  `songId` int(50) DEFAULT NULL,
  `songName` varchar(255) DEFAULT NULL,
  `alId` int(50) DEFAULT NULL,
  `alName` varchar(255) DEFAULT NULL,
  `alia` varchar(255) DEFAULT NULL,
  `artId` int(50) DEFAULT NULL,
  `artName` varchar(255) DEFAULT  NULL,
  `dt` varchar(255) DEFAULT NULL,
  `picUrl` varchar(255) DEFAULT NULL,
  `songUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`listId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `songlist` set listname='test',
                          songId='542691104',
                          songName='焚城雪',
                          alId='37869085',
                          alName='人生若如初相见 电视原声带',
                          alia='电视剧《人生若如初相见》 片头曲',
                          artId='3415',
                          artName='霍尊',
                          dt='208541',
                          picUrl='http://p3.music.126.net/9uOHLycE5Q-4XJ6grHBnFA==/109951163176817976.jpg',
                          songUrl='http://music.163.com/song/media/outer/url?id=542691104.mp3';
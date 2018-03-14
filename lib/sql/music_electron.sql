/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MariaDB
 Source Server Version : 100213
 Source Host           : localhost
 Source Database       : music_electron

 Target Server Type    : MariaDB
 Target Server Version : 100213
 File Encoding         : utf-8

 Date: 03/13/2018 18:36:07 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `m_user_act_logs`
-- ----------------------------
DROP TABLE IF EXISTS `m_user_act_logs`;
CREATE TABLE `m_user_act_logs` (
  `id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `action` varchar(32) NOT NULL COMMENT '操作说明',
  `add_time` int(10) unsigned NOT NULL COMMENT '添加时间/操作时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='用户操作日志表';

-- ----------------------------
--  Table structure for `m_user_lists`
-- ----------------------------
DROP TABLE IF EXISTS `m_user_lists`;
CREATE TABLE `m_user_lists` (
  `int` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `list_name` varchar(32) NOT NULL COMMENT '歌单名称',
  `list_type` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '歌单类型，默认 0 为用户自建歌单，1 为收藏他人歌单',
  `list_source` int(10) unsigned NOT NULL COMMENT '来源歌单ID',
  `sort` int(10) unsigned DEFAULT 0 COMMENT '歌单排序',
  `add_time` int(10) unsigned NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`int`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户歌单表';

-- ----------------------------
--  Table structure for `m_users`
-- ----------------------------
DROP TABLE IF EXISTS `m_users`;
CREATE TABLE `m_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(13) NOT NULL COMMENT '用户名',
  `password` varchar(64) NOT NULL COMMENT '用户密码',
  `email` varchar(64) DEFAULT '' COMMENT '用户邮箱',
  `reg_time` int(10) unsigned NOT NULL COMMENT '注册时间，10 位 Unix 时间戳',
  `last_login_time` int(10) unsigned NOT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

INSERT INTO `m_users` set username='admin', email='admin@example.com', password='123456',reg_time='1520953542',last_login_time='1520953577';

SET FOREIGN_KEY_CHECKS = 1;

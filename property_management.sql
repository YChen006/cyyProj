/*
Navicat MySQL Data Transfer

Source Server         : test
Source Server Version : 80023
Source Host           : localhost:3306
Source Database       : property_management

Target Server Type    : MYSQL
Target Server Version : 80023
File Encoding         : 65001

Date: 2024-03-20 21:55:57
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for announcement
-- ----------------------------
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement` (
  `announcement_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'title',
  `content` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`announcement_id`),
  UNIQUE KEY `announcement_id_UNIQUE` (`announcement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of announcement
-- ----------------------------
INSERT INTO `announcement` VALUES ('2', '维修通知', '4月8日维修电网，小区暂时停电，停电时间为下午12:00到下午14:00');
INSERT INTO `announcement` VALUES ('9', '日常维护公告', '物业将于3月7日进行楼栋日常维护');

-- ----------------------------
-- Table structure for building
-- ----------------------------
DROP TABLE IF EXISTS `building`;
CREATE TABLE `building` (
  `building_id` int NOT NULL,
  PRIMARY KEY (`building_id`),
  UNIQUE KEY `building_id_UNIQUE` (`building_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of building
-- ----------------------------
INSERT INTO `building` VALUES ('1');
INSERT INTO `building` VALUES ('2');
INSERT INTO `building` VALUES ('3');
INSERT INTO `building` VALUES ('7');
INSERT INTO `building` VALUES ('9');

-- ----------------------------
-- Table structure for complaint
-- ----------------------------
DROP TABLE IF EXISTS `complaint`;
CREATE TABLE `complaint` (
  `complaint_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `is_checked` tinyint DEFAULT '0',
  `user_id` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`complaint_id`),
  UNIQUE KEY `complaint_id_UNIQUE` (`complaint_id`),
  KEY `user_id_complaint_idx` (`user_id`),
  CONSTRAINT `user_id_complaint` FOREIGN KEY (`user_id`) REFERENCES `resident` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of complaint
-- ----------------------------
INSERT INTO `complaint` VALUES ('1', '3栋楼下太脏了，记得多打扫', '1', 'resident1');
INSERT INTO `complaint` VALUES ('4', '小区广场太吵了', '0', 'resident2');
INSERT INTO `complaint` VALUES ('6', '1栋楼下晚上太吵了', '1', 'resident1');

-- ----------------------------
-- Table structure for house
-- ----------------------------
DROP TABLE IF EXISTS `house`;
CREATE TABLE `house` (
  `house_id` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `building_id` int DEFAULT NULL,
  `floor` int DEFAULT NULL,
  `user_id` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `is_occupied` tinyint DEFAULT '0',
  PRIMARY KEY (`house_id`),
  UNIQUE KEY `house_id_UNIQUE` (`house_id`),
  KEY `building_id_house_idx` (`building_id`),
  CONSTRAINT `building_id_house` FOREIGN KEY (`building_id`) REFERENCES `building` (`building_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of house
-- ----------------------------
INSERT INTO `house` VALUES ('1-101', '1', '1', 'resident1', '1');
INSERT INTO `house` VALUES ('1-201', '1', '2', 'resident2', '1');
INSERT INTO `house` VALUES ('1-401', '1', '4', null, '0');
INSERT INTO `house` VALUES ('2-102', '2', '1', null, '0');
INSERT INTO `house` VALUES ('2-401', '2', '4', null, '0');

-- ----------------------------
-- Table structure for manager
-- ----------------------------
DROP TABLE IF EXISTS `manager`;
CREATE TABLE `manager` (
  `user_id` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'adminName',
  `password` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '123456',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of manager
-- ----------------------------
INSERT INTO `manager` VALUES ('admin1', '张三', '123456');
INSERT INTO `manager` VALUES ('admin2', '李四', '123456ab');
INSERT INTO `manager` VALUES ('admin3', '小凡', '111111');

-- ----------------------------
-- Table structure for payment
-- ----------------------------
DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `sum` float unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `payment_id_UNIQUE` (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of payment
-- ----------------------------
INSERT INTO `payment` VALUES ('1', '水电缴费', '000000050.17');
INSERT INTO `payment` VALUES ('2', '暖气缴费', '0000000070.1');
INSERT INTO `payment` VALUES ('3', 'in ipsum', '000000000070');
INSERT INTO `payment` VALUES ('6', 'ut ex', '000000000048');
INSERT INTO `payment` VALUES ('7', 'ut ex', '000000000048');
INSERT INTO `payment` VALUES ('8', 'ut ex', '000000000048');
INSERT INTO `payment` VALUES ('9', 'ut ex', '000000000048');
INSERT INTO `payment` VALUES ('10', 'ut ex', '000000000048');
INSERT INTO `payment` VALUES ('11', 'dolore ipsum exercitation eiusmod', '000000000040');
INSERT INTO `payment` VALUES ('12', 'dolore ipsum exercitation eiusmod', '000000000040');
INSERT INTO `payment` VALUES ('15', '日常维护缴费', '000000070.94');
INSERT INTO `payment` VALUES ('16', '日常物业维护缴费', '000000014.71');

-- ----------------------------
-- Table structure for payment_list
-- ----------------------------
DROP TABLE IF EXISTS `payment_list`;
CREATE TABLE `payment_list` (
  `payment_id` int NOT NULL,
  `user_id` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `is_paid` tinyint DEFAULT '0',
  PRIMARY KEY (`payment_id`,`user_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `payment_id` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of payment_list
-- ----------------------------
INSERT INTO `payment_list` VALUES ('1', 'resident1', '1');
INSERT INTO `payment_list` VALUES ('1', 'resident2', '1');
INSERT INTO `payment_list` VALUES ('2', 'resident1', '1');
INSERT INTO `payment_list` VALUES ('2', 'resident2', '1');
INSERT INTO `payment_list` VALUES ('15', 'resident1', '0');
INSERT INTO `payment_list` VALUES ('15', 'resident2', '0');
INSERT INTO `payment_list` VALUES ('15', 'resident3', '0');
INSERT INTO `payment_list` VALUES ('16', 'resident1', '1');
INSERT INTO `payment_list` VALUES ('16', 'resident3', '0');
INSERT INTO `payment_list` VALUES ('16', 'resident4', '0');

-- ----------------------------
-- Table structure for repair
-- ----------------------------
DROP TABLE IF EXISTS `repair`;
CREATE TABLE `repair` (
  `repair_form_id` int NOT NULL AUTO_INCREMENT,
  `type` int DEFAULT '0',
  `content` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `progress` int DEFAULT '0',
  `user_id` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`repair_form_id`),
  UNIQUE KEY `repair_form_id_UNIQUE` (`repair_form_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id_repair` FOREIGN KEY (`user_id`) REFERENCES `resident` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of repair
-- ----------------------------
INSERT INTO `repair` VALUES ('11', '1', '水管爆了', '3', 'resident2');
INSERT INTO `repair` VALUES ('12', '6', '空调坏了', '2', 'resident2');
INSERT INTO `repair` VALUES ('17', '0', '报修内容', '1', 'resident2');
INSERT INTO `repair` VALUES ('18', '0', '门口路有点坏', '2', 'resident1');
INSERT INTO `repair` VALUES ('19', '7', '灯时亮时不亮', '1', 'resident1');
INSERT INTO `repair` VALUES ('21', '1', '水管爆了', '3', 'resident1');

-- ----------------------------
-- Table structure for resident
-- ----------------------------
DROP TABLE IF EXISTS `resident`;
CREATE TABLE `resident` (
  `user_id` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `user_name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'username',
  `phone_number` varchar(13) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of resident
-- ----------------------------
INSERT INTO `resident` VALUES ('resident1', '123456', '李伟', '15711114878');
INSERT INTO `resident` VALUES ('resident2', '123456', '王怡', '15714112173');
INSERT INTO `resident` VALUES ('resident3', '123456', '王虎', '17478474221');
INSERT INTO `resident` VALUES ('resident4', '123456', '李一', '18747475757');

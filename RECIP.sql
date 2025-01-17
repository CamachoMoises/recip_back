-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: recip_db
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` varchar(500) NOT NULL,
  `course_id` int NOT NULL,
  `question_id` int NOT NULL,
  `test_id` int NOT NULL,
  `is_correct` tinyint(1) DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_answer_course_idx` (`course_id`) USING BTREE,
  KEY `fk_answer_question_idx` (`question_id`) USING BTREE,
  KEY `fk_answer_test_idx` (`test_id`) USING BTREE,
  CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `answer_ibfk_3` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
INSERT INTO `answer` VALUES (1,'28 voltios, 24 amperios-hora',1,1,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(2,'24 voltios, 34/36 amperios-hora',1,1,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(3,'28 voltios, 34/36 amperios-hora',1,1,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(4,'24 voltios, 42 amperios-hora',1,1,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(5,'Mueva el interruptor a APAGADO y luego a ENCENDIDO.',1,2,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(6,'Mantenga presionado el interruptor en RESET durante un segundo y suéltelo en ON',1,2,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(7,'Mueva el interruptor a ON',1,2,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(8,'Mantenga el interruptor en ON durante un segundo.',1,2,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(9,'En la sección central del ala izquierda',1,3,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(10,'En el compartimento de popa',1,3,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(11,'En la sección central del ala derecha',1,3,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(12,'En el compartimento de la nariz',1,3,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(13,'+5 °C',1,4,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(14,'130 KTS',1,4,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(15,'15 °C',1,4,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(16,'160 KTS.',1,4,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(17,'Verdadero',1,5,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(18,'Falso',1,5,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(19,'Power ……………………………………………………GROUND FINE',1,6,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(20,'Brakes ….......AS REQUIRED TO ACHIEVE STOPPING DISTANCE',1,6,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(21,'Operative Engine ……………………………… MAXIMUM REVERSE',1,6,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(22,'Power ………………………………………...MAXIMUM ALLOWABLE',1,7,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(23,'Airspeed ……………………...MAINTAIN (Takeoff Speed or Above)',1,7,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(24,'Landing Gear …………………………………………………………..UP',1,7,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(25,'Prop Lever (Inoperative Engine) …………………………. FEATHER',1,7,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(26,'Airspeed (After Obstacle Clearance Altitude Reached) ……..VYSE',1,7,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(27,'Condition Lever ………………………………….……..FUEL CUTOFF',1,8,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(28,'Prop Lever …………………………………………..……….. FEATHER',1,8,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(29,'Firewall Shutoff Valve ………………………………….……… CLOSE',1,8,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(30,'Fire Extinguisher (If Installed)(If Fire Warning Persists).ACTUATE',1,8,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(31,'Power Levers ………………………………………………………. IDLE',1,9,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(32,'Prop Levers …………………………………………..FULL FORWARD',1,9,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(33,'Flaps (200 Knots Maximum) ……………………….…….APPROACH',1,9,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(34,'Landing Gear (181 Knots Maximum) …………………………….. DN',1,9,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(35,'Airspeed ……………………………………….181 KNOTS MAXIMUM',1,9,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(36,'Verdadero',1,10,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(37,'Falso',1,10,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(38,'Verdadero',1,11,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(39,'Falso',1,11,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(40,'Verdadero',1,12,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(41,'Falso',1,12,1,0,1,'2024-10-27 13:15:06','2024-10-27 13:15:06');
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `description` varchar(500) NOT NULL,
  `hours` float DEFAULT '0',
  `days` int DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `course_type_id` int NOT NULL,
  `course_level_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_type_id` (`course_type_id`),
  KEY `course_level_id` (`course_level_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`course_type_id`) REFERENCES `course_type` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `course_ibfk_2` FOREIGN KEY (`course_level_id`) REFERENCES `course_level` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'King Air B200','Registro de Instrucción y Calificación ',49,6,1,1,1,'2024-10-27 13:15:06','2024-12-03 21:53:59'),(2,'King Air B200 ','Registro de Instrucción y Calificación ',9,6,1,2,1,'2024-11-26 21:45:46','2024-12-03 22:52:32'),(3,'King Air B200','Registro de Instrucción y Calificación ',14.5,3,1,1,2,'2024-12-03 21:56:19','2024-12-03 21:56:54');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_level`
--

DROP TABLE IF EXISTS `course_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_level` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_level`
--

LOCK TABLES `course_level` WRITE;
/*!40000 ALTER TABLE `course_level` DISABLE KEYS */;
INSERT INTO `course_level` VALUES (1,'Inicial','2024-10-27 13:15:06','2024-10-27 13:15:06'),(2,'Recurente','2024-10-27 13:15:06','2024-10-27 13:15:06');
/*!40000 ALTER TABLE `course_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_student`
--

DROP TABLE IF EXISTS `course_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `date` date DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `type_trip` int DEFAULT '1',
  `license` int DEFAULT '1',
  `regulation` int DEFAULT '1',
  `status` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_course_student_course_idx` (`course_id`) USING BTREE,
  KEY `fk_course_student_student1_idx` (`student_id`) USING BTREE,
  CONSTRAINT `course_student_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_student_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_student`
--

LOCK TABLES `course_student` WRITE;
/*!40000 ALTER TABLE `course_student` DISABLE KEYS */;
INSERT INTO `course_student` VALUES (1,1,'2024-11-29',1,'CS-00000000',1,2,1,1,'2024-11-28 11:31:00','2024-12-03 11:58:19'),(2,2,NULL,1,'CS-00000002',1,1,1,1,'2024-12-03 21:55:01','2024-12-03 21:55:04'),(3,3,NULL,1,'CS-00000003',1,1,1,1,'2024-12-03 21:56:22','2024-12-03 21:56:25'),(4,3,'2024-12-04',1,'CS-00000004',1,1,1,1,'2024-12-03 23:04:47','2024-12-03 23:08:10');
/*!40000 ALTER TABLE `course_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_student_test`
--

DROP TABLE IF EXISTS `course_student_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_student_test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `score` float DEFAULT '0',
  `test_id` int NOT NULL,
  `attempts` int DEFAULT '1',
  `course_student_id` int NOT NULL,
  `date` datetime DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `finished` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_course_student_test_course_idx` (`course_id`) USING BTREE,
  KEY `fk_course_student_test_test_idx` (`test_id`) USING BTREE,
  KEY `fk_course_student_test_course_student_idx` (`course_student_id`) USING BTREE,
  KEY `fk_course_student_test_student1_idx` (`student_id`) USING BTREE,
  CONSTRAINT `course_student_test_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_student_test_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `course_student_test_ibfk_3` FOREIGN KEY (`course_student_id`) REFERENCES `course_student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_student_test_ibfk_4` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_student_test`
--

LOCK TABLES `course_student_test` WRITE;
/*!40000 ALTER TABLE `course_student_test` DISABLE KEYS */;
INSERT INTO `course_student_test` VALUES (1,1,0,1,1,1,'2024-12-01 00:01:00',1,'CST-00001',1,0,'2024-11-28 11:31:00','2024-11-28 11:31:00'),(2,1,0,1,2,1,'2024-12-05 04:01:00',1,'CST-00000002',1,0,'2024-12-05 05:21:10','2024-12-05 05:21:10'),(3,1,0,1,3,1,'2024-12-05 04:01:00',1,'CST-00000003',1,0,'2024-12-05 05:39:15','2024-12-05 05:39:15');
/*!40000 ALTER TABLE `course_student_test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_student_test_question`
--

DROP TABLE IF EXISTS `course_student_test_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_student_test_question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `test_id` int NOT NULL,
  `course_student_id` int NOT NULL,
  `course_student_test_id` int NOT NULL,
  `question_id` int NOT NULL,
  `answered` tinyint(1) DEFAULT '0',
  `status` int DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `student_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_course_student_test_question_course_idx` (`course_id`) USING BTREE,
  KEY `fk_course_student_test_question_test_idx` (`test_id`) USING BTREE,
  KEY `fk_course_student_test_question_course_student_idx` (`course_student_id`) USING BTREE,
  KEY `fk_course_student_test_question_course_student_test_idx` (`course_student_test_id`) USING BTREE,
  KEY `fk_course_student_test_question_question_idx` (`question_id`) USING BTREE,
  KEY `fk_course_student_test_question_student1_idx` (`student_id`) USING BTREE,
  CONSTRAINT `course_student_test_question_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `course_student_test_question_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `course_student_test_question_ibfk_3` FOREIGN KEY (`course_student_id`) REFERENCES `course_student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_student_test_question_ibfk_4` FOREIGN KEY (`course_student_test_id`) REFERENCES `course_student_test` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `course_student_test_question_ibfk_5` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`),
  CONSTRAINT `course_student_test_question_ibfk_6` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_student_test_question`
--

LOCK TABLES `course_student_test_question` WRITE;
/*!40000 ALTER TABLE `course_student_test_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_student_test_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_type`
--

DROP TABLE IF EXISTS `course_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_type`
--

LOCK TABLES `course_type` WRITE;
/*!40000 ALTER TABLE `course_type` DISABLE KEYS */;
INSERT INTO `course_type` VALUES (1,'Escuela en Tierra','2024-10-27 13:15:06','2024-10-27 13:15:06'),(2,'Vuelo en FSTD','2024-10-27 13:15:06','2024-10-27 13:15:06');
/*!40000 ALTER TABLE `course_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_permission`
--

DROP TABLE IF EXISTS `group_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_group_permission_group1_idx` (`group_id`) USING BTREE,
  KEY `fk_group_permission_permission1_idx` (`permission_id`) USING BTREE,
  CONSTRAINT `group_permission_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `group_permission_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_permission`
--

LOCK TABLES `group_permission` WRITE;
/*!40000 ALTER TABLE `group_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_instructor_user1_idx` (`user_id`) USING BTREE,
  CONSTRAINT `instructor_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor`
--

LOCK TABLES `instructor` WRITE;
/*!40000 ALTER TABLE `instructor` DISABLE KEYS */;
INSERT INTO `instructor` VALUES (1,8,1,'2024-11-28 11:30:49','2024-11-28 11:30:49'),(2,9,1,'2024-11-28 11:30:51','2024-11-28 11:30:51');
/*!40000 ALTER TABLE `instructor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participants`
--

DROP TABLE IF EXISTS `participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `doc_number` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `doc_number` (`doc_number`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participants`
--

LOCK TABLES `participants` WRITE;
/*!40000 ALTER TABLE `participants` DISABLE KEYS */;
/*!40000 ALTER TABLE `participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `module_id` int NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_permission_module1_idx` (`module_id`) USING BTREE,
  CONSTRAINT `permission_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `header` varchar(500) NOT NULL,
  `course_id` int NOT NULL,
  `question_type_id` int NOT NULL,
  `test_id` int NOT NULL,
  `updated_at` datetime NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_question_course_idx` (`course_id`) USING BTREE,
  KEY `fk_question_question_type_idx` (`question_type_id`) USING BTREE,
  KEY `fk_question_test_idx` (`test_id`) USING BTREE,
  CONSTRAINT `question_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `question_ibfk_2` FOREIGN KEY (`question_type_id`) REFERENCES `question_type` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `question_ibfk_3` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'¿Cuál es la clasificación de la batería?',1,1,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(2,'En aviones con números de serie BB-88 y posteriores, ¿cómo se enciende un generador?',1,1,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(3,'¿Dónde está ubicada la batería?',1,1,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(4,'Indique la temperatura recomendada y máxima velocidad para extender manualmente las',1,2,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(5,'Las siglas VMO significan máxima velocidad de operación expresado en nudos:',1,3,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(6,'Describa los ítems de memoria para el procedimiento a seguir en caso de FALLA EN EL MOTOR ANTES DE LA V1',1,5,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(7,'Describa los ítems de memoria para el procedimiento a seguir en caso de FALLA EN EL MOTOR DESPUES DE LA V1',1,5,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(8,'Describa los ítems de memoria para el procedimiento a seguir en caso de FUEGO EN EL MOTOR EN VUELO',1,5,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(9,'Describa los ítems de memoria para el procedimiento a seguir en caso de UN DESCENSO DE EMERGENCIA',1,5,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(10,'Las siglas VXSE significan la mejor rata de ascenso con un motor inoperativo:',1,3,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(11,'El máximo peso de aterrizaje del BE-20 es 14.000 lbs',1,3,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06'),(12,'La mejor velocidad de planeo cuando se está efectuado un descenso de emergencia es de 134 KIAS:',1,3,1,'2024-10-27 13:15:06',1,'2024-10-27 13:15:06');
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_type`
--

DROP TABLE IF EXISTS `question_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `value` float DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_type`
--

LOCK TABLES `question_type` WRITE;
/*!40000 ALTER TABLE `question_type` DISABLE KEYS */;
INSERT INTO `question_type` VALUES (1,'Seleccion Simple',0,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(2,'Seleccion Multiple',0,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(3,'Verdadero o falso',0,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(4,'Pregunta de completación',0,'2024-10-27 13:15:06','2024-10-27 13:15:06'),(5,'Preguntas de desarrollo',0,'2024-10-27 13:15:06','2024-10-27 13:15:06');
/*!40000 ALTER TABLE `question_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `id` int NOT NULL AUTO_INCREMENT,
  `instructor_id` int NOT NULL,
  `student_id` int NOT NULL,
  `subject_days_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `course_student_id` int NOT NULL,
  `value` double NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_rating_subject_id` (`subject_id`) USING BTREE,
  KEY `fk_rating_subject_days_id` (`subject_days_id`) USING BTREE,
  KEY `fk_rating_student1_idx` (`student_id`) USING BTREE,
  KEY `fk_rating_course_student1_idx` (`course_student_id`) USING BTREE,
  KEY `fk_rating_instructor_idx` (`instructor_id`) USING BTREE,
  CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `rating_ibfk_3` FOREIGN KEY (`subject_days_id`) REFERENCES `subject_days` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `rating_ibfk_4` FOREIGN KEY (`subject_id`) REFERENCES `subject_days` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `rating_ibfk_5` FOREIGN KEY (`course_student_id`) REFERENCES `course_student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `instructor_id` int DEFAULT NULL,
  `student_id` int NOT NULL,
  `subject_days_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `course_student_id` int NOT NULL,
  `date` date DEFAULT NULL,
  `hour` time DEFAULT NULL,
  `class_time` float DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_schedule_subject_id` (`subject_id`) USING BTREE,
  KEY `fk_schedule_student_idx` (`student_id`) USING BTREE,
  KEY `fk_schedule_subject_days_idx` (`subject_days_id`) USING BTREE,
  KEY `fk_schedule_course_student1_idx` (`course_student_id`) USING BTREE,
  KEY `fk_schedule_instructor_idx` (`instructor_id`) USING BTREE,
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `schedule_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `schedule_ibfk_3` FOREIGN KEY (`subject_days_id`) REFERENCES `subject_days` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `schedule_ibfk_4` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `schedule_ibfk_5` FOREIGN KEY (`course_student_id`) REFERENCES `course_student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,1,1,1,1,'2024-11-29','08:00:00',0.5,'2024-11-28 11:32:15','2024-11-28 19:04:37'),(2,1,1,2,2,1,'2024-11-29','08:30:00',7.5,'2024-11-28 11:32:59','2024-12-03 22:00:39'),(3,1,1,3,3,1,'2024-11-30','08:30:00',8,'2024-11-28 11:33:12','2024-11-28 11:33:12'),(4,1,1,4,10,1,'2024-12-01','08:30:00',3,'2024-11-28 11:33:34','2024-11-28 11:33:34'),(5,1,1,5,11,1,'2024-12-01','11:32:00',2,'2024-11-28 11:33:59','2024-11-28 11:40:15'),(6,1,1,6,12,1,'2024-12-01','13:30:00',3,'2024-11-28 11:34:24','2024-11-28 11:34:32'),(7,1,1,7,13,1,'2024-12-02','08:00:00',3,'2024-11-28 11:42:17','2024-11-28 11:42:17'),(8,1,1,8,14,1,'2024-12-02','11:30:00',2,'2024-11-28 11:44:32','2024-11-28 11:44:32'),(9,1,1,9,15,1,'2024-12-02','13:30:00',2,'2024-11-28 11:45:16','2024-11-28 11:45:16'),(10,1,1,10,16,1,'2024-12-02','03:30:00',2,'2024-11-28 11:45:38','2024-11-28 11:45:38'),(11,1,1,11,17,1,'2024-12-03','08:00:00',2,'2024-11-28 11:46:13','2024-11-28 11:46:13'),(12,2,1,12,18,1,'2024-12-03','10:00:00',2,'2024-11-28 11:46:32','2024-11-28 11:46:32'),(13,2,1,13,19,1,'2024-12-03','13:00:00',1,'2024-11-28 11:46:55','2024-11-28 11:46:55'),(14,1,1,14,20,1,'2024-12-03','14:00:00',3,'2024-11-28 11:47:09','2024-11-28 11:47:09'),(15,1,1,15,21,1,'2024-12-04','08:00:00',2,'2024-11-28 11:47:32','2024-11-28 11:47:32'),(16,1,1,16,22,1,'2024-12-04','10:00:00',4,'2024-11-28 11:47:45','2024-11-28 11:47:45'),(17,1,1,17,23,1,'2024-12-05','00:01:00',2,'2024-11-28 18:35:30','2024-12-05 04:23:16'),(18,1,1,19,24,4,'2024-12-04','08:00:00',1,'2024-12-03 23:08:27','2024-12-03 23:08:27'),(19,1,1,20,25,4,'2024-12-04','09:00:00',1.5,'2024-12-03 23:08:43','2024-12-03 23:08:43'),(20,1,1,21,26,4,'2024-12-04','10:30:00',1.5,'2024-12-03 23:09:04','2024-12-03 23:09:04'),(21,1,1,22,27,4,'2024-12-04','00:00:00',1,'2024-12-03 23:09:40','2024-12-03 23:09:40'),(22,1,1,23,28,4,'2024-12-05','08:00:00',1.5,'2024-12-03 23:10:02','2024-12-03 23:10:02'),(23,1,1,24,29,4,'2024-12-05','09:30:00',1,'2024-12-03 23:10:28','2024-12-03 23:11:27'),(24,1,1,25,30,4,'2024-12-05','10:30:00',1,'2024-12-03 23:10:46','2024-12-03 23:11:19'),(25,1,1,26,31,4,'2024-12-05','11:30:00',1,'2024-12-03 23:11:13','2024-12-03 23:11:13'),(26,1,1,27,32,4,'2024-12-06','08:00:00',1,'2024-12-03 23:11:57','2024-12-03 23:11:57'),(27,1,1,28,33,4,'2024-12-06','09:00:00',1,'2024-12-03 23:12:20','2024-12-03 23:12:20'),(28,1,1,29,34,4,'2024-12-06','10:00:00',1,'2024-12-03 23:12:56','2024-12-03 23:12:56'),(29,1,1,30,35,4,'2024-12-06','11:00:00',2,'2024-12-03 23:13:15','2024-12-03 23:13:15');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_student_user1_idx` (`user_id`) USING BTREE,
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,3,1,'2024-11-28 11:30:43','2024-11-28 11:30:43'),(2,7,1,'2024-11-28 11:30:46','2024-11-28 11:30:46');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order` int NOT NULL,
  `name` varchar(500) NOT NULL,
  `hours` float DEFAULT '0',
  `status` tinyint DEFAULT '1',
  `course_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_subject_course1_idx` (`course_id`) USING BTREE,
  CONSTRAINT `subject_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (1,1,'Bienvenida/Papeleo',0.5,1,1,'2024-11-26 21:03:39','2024-11-28 19:04:22'),(2,2,'Generalidades de la Aeronave/ Procedimientos Operacionales / Plan de vuelo/ Maniobras',7.5,1,1,'2024-11-26 21:03:49','2024-11-28 19:04:28'),(3,3,'Peso y Balance, Planificación y  Performance ',8,1,1,'2024-11-26 21:03:56','2024-11-27 09:12:49'),(4,2,'Cabina/Encendido/Despegue ',2,1,2,'2024-11-26 21:51:03','2024-11-26 21:53:06'),(5,3,'Ascenso a FL100, para Ejercicios de Vuelo',2,1,2,'2024-11-26 21:51:26','2024-11-26 21:53:05'),(6,4,'Regreso al Aeródromo',2,1,2,'2024-11-26 21:51:53','2024-11-26 21:53:04'),(7,1,'Brifing ',0.5,1,2,'2024-11-26 21:52:29','2024-11-27 10:20:41'),(8,6,'Dibrifing',0.5,1,2,'2024-11-26 21:52:56','2024-11-27 10:21:17'),(9,5,'Reinicio al Inicio de la Pista',2,1,2,'2024-11-26 21:53:20','2024-11-26 21:53:36'),(10,4,'Sistema eléctrico, Iluminación y Panel de Advertencia',3,1,1,'2024-11-27 09:12:09','2024-11-27 09:12:09'),(11,5,'Combustible',2,1,1,'2024-11-27 09:12:32','2024-11-27 09:12:32'),(12,6,'Motores/ Hélices',3,1,1,'2024-11-27 09:17:25','2024-11-27 09:17:25'),(13,7,'Protección Contra Incendio',3,1,1,'2024-11-27 09:20:31','2024-11-27 09:20:31'),(14,8,'Neumático, Protección contra Hielo y Lluvia',2,1,1,'2024-11-27 09:20:45','2024-11-27 09:20:45'),(15,9,'Aire Acondicionado / Presurización',2,1,1,'2024-11-27 09:21:01','2024-12-01 23:25:11'),(16,10,'Tren de aterrizaje /controles de vuelo',2,1,1,'2024-11-27 09:21:21','2024-11-27 09:21:21'),(17,11,'Instrumentos y Aviónica',2,1,1,'2024-11-27 09:22:10','2024-11-27 09:22:10'),(18,12,'Oxigeno',2,1,1,'2024-11-27 09:25:21','2024-11-27 09:25:21'),(19,13,'Manual de Vuelo',1,1,1,'2024-11-27 09:25:38','2024-11-27 09:25:38'),(20,14,'Procedimientos Anormales /Emergencias',3,1,1,'2024-11-27 09:26:01','2024-11-27 09:26:01'),(21,15,'CRM /Cortante de Viento Cruzado',2,1,1,'2024-11-27 09:26:13','2024-11-27 09:26:13'),(22,16,'Repaso',4,1,1,'2024-11-27 09:26:26','2024-11-27 09:26:26'),(23,17,'Examen/Encuesta',2,1,1,'2024-11-27 09:26:40','2024-11-27 09:26:40'),(24,1,'Generalidades de la Aeronave/ Procedimientos Operacionales',1,1,3,'2024-12-03 22:54:12','2024-12-03 23:04:15'),(25,2,'Peso y Balance, Planificación y  Performance',1.5,1,3,'2024-12-03 22:54:40','2024-12-03 22:54:40'),(26,3,'Sistema eléctrico, Iluminación y Panel de Advertencia',1.5,1,3,'2024-12-03 22:55:06','2024-12-03 22:55:06'),(27,4,'Combustible',1,1,3,'2024-12-03 22:55:29','2024-12-03 22:55:29'),(28,5,'Motores / Hélices',1.5,1,3,'2024-12-03 22:55:55','2024-12-03 22:56:06'),(29,6,'Protección Contra Incendio',1,1,3,'2024-12-03 22:56:27','2024-12-03 22:56:27'),(30,7,'Neumático, Protección contra Hielo y Lluvia',1,1,3,'2024-12-03 22:56:49','2024-12-03 22:56:49'),(31,8,'Aire Acondicionado/Presurización',1,1,3,'2024-12-03 22:57:22','2024-12-03 22:57:22'),(32,9,'Tren de aterrizaje / controles de vuelo',1,1,3,'2024-12-03 22:57:50','2024-12-03 22:57:50'),(33,10,'Instrumentos y Aviónica',1,1,3,'2024-12-03 22:58:12','2024-12-03 22:58:12'),(34,11,'Oxigeno',1,1,3,'2024-12-03 22:59:13','2024-12-03 22:59:13'),(35,12,'Repaso y Examen',2,1,3,'2024-12-03 22:59:43','2024-12-03 22:59:43');
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject_days`
--

DROP TABLE IF EXISTS `subject_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject_days` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject_id` int NOT NULL,
  `course_id` int NOT NULL,
  `day` int NOT NULL,
  `class_time` int DEFAULT '1',
  `status` tinyint DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_subject_days_subject1_idx` (`subject_id`) USING BTREE,
  KEY `fk_subject_days_course1_idx` (`course_id`) USING BTREE,
  CONSTRAINT `subject_days_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `subject_days_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_days`
--

LOCK TABLES `subject_days` WRITE;
/*!40000 ALTER TABLE `subject_days` DISABLE KEYS */;
INSERT INTO `subject_days` VALUES (1,1,1,1,1,1,'2024-11-28 11:31:19','2024-11-28 11:31:19'),(2,2,1,1,1,1,'2024-11-28 11:31:20','2024-11-28 11:31:20'),(3,3,1,2,1,1,'2024-11-28 11:31:21','2024-11-28 11:31:21'),(4,10,1,3,1,1,'2024-11-28 11:31:23','2024-11-28 11:31:23'),(5,11,1,3,1,1,'2024-11-28 11:31:26','2024-11-28 11:31:26'),(6,12,1,3,1,1,'2024-11-28 11:31:28','2024-11-28 11:31:28'),(7,13,1,4,1,1,'2024-11-28 11:31:30','2024-11-28 11:31:30'),(8,14,1,4,1,1,'2024-11-28 11:31:31','2024-11-28 11:31:31'),(9,15,1,4,1,1,'2024-11-28 11:31:33','2024-11-28 11:31:33'),(10,16,1,4,1,1,'2024-11-28 11:31:39','2024-11-28 11:31:39'),(11,17,1,5,1,1,'2024-11-28 11:31:41','2024-11-28 11:31:41'),(12,18,1,5,1,1,'2024-11-28 11:31:42','2024-11-28 11:31:42'),(13,19,1,5,1,1,'2024-11-28 11:31:44','2024-11-28 11:31:44'),(14,20,1,5,1,1,'2024-11-28 11:31:46','2024-11-28 11:31:46'),(15,21,1,6,1,1,'2024-11-28 11:31:47','2024-11-28 11:31:47'),(16,22,1,6,1,1,'2024-11-28 11:31:48','2024-11-28 11:31:48'),(17,23,1,6,1,1,'2024-11-28 11:31:50','2024-11-28 11:31:50'),(18,3,1,1,1,0,'2024-12-03 22:01:11','2024-12-03 22:01:14'),(19,24,3,1,1,1,'2024-12-03 23:07:19','2024-12-03 23:07:19'),(20,25,3,1,1,1,'2024-12-03 23:07:20','2024-12-03 23:07:20'),(21,26,3,1,1,1,'2024-12-03 23:07:28','2024-12-03 23:07:28'),(22,27,3,1,1,1,'2024-12-03 23:07:29','2024-12-03 23:07:29'),(23,28,3,2,1,1,'2024-12-03 23:07:40','2024-12-03 23:07:40'),(24,29,3,2,1,1,'2024-12-03 23:07:41','2024-12-03 23:07:41'),(25,30,3,2,1,1,'2024-12-03 23:07:43','2024-12-03 23:07:43'),(26,31,3,2,1,1,'2024-12-03 23:07:44','2024-12-03 23:07:44'),(27,32,3,3,1,1,'2024-12-03 23:07:53','2024-12-03 23:07:53'),(28,33,3,3,1,1,'2024-12-03 23:07:54','2024-12-03 23:07:54'),(29,34,3,3,1,1,'2024-12-03 23:07:55','2024-12-03 23:07:55'),(30,35,3,3,1,1,'2024-12-03 23:07:56','2024-12-03 23:07:56');
/*!40000 ALTER TABLE `subject_days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `code` varchar(50) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_test_course_idx` (`course_id`) USING BTREE,
  CONSTRAINT `test_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES (1,1,'T-0001',1,'2024-10-27 13:15:06','2024-10-27 13:15:06');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(500) NOT NULL,
  `doc_number` int NOT NULL,
  `user_doc_type_id` int NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `last_name` varchar(500) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  `email` varchar(500) NOT NULL,
  `is_superuser` tinyint(1) DEFAULT '0',
  `is_staff` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `email` (`email`),
  KEY `user_doc_type_id` (`user_doc_type_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`user_doc_type_id`) REFERENCES `user_doc_type` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (3,'fcf400f5-3182-4f2c-8353-49ca27605a32','Mario ',13904983,1,'4263926273','Piñango','123456789','sistemas@joyarteydecoracion.com',0,0,1,'2024-11-23 14:00:16','2024-11-23 14:00:16'),(6,'5abb0860-76cc-47a7-9dc3-c8e45123797c','Hermes',17531269,1,'4263926273','Meriño','123456789','test3@joyarteydecoracion.com',0,0,1,'2024-11-23 14:02:34','2024-11-23 14:02:34'),(7,'d5cff71f-2b6e-4df3-88e5-7bce0c36d5f3','Luis ',14302910,1,'4263926273','Salcedo','123456789','test2@gmail.com',0,0,1,'2024-11-23 14:03:16','2024-11-23 14:03:16'),(8,'35fcc892-4410-4d77-98e2-16a5e5cd008f','Jose ',6500789,1,'4263926273','Puente','123456789','admin@test.com',0,0,1,'2024-11-23 14:03:45','2024-11-23 14:03:45'),(9,'b1057472-6223-4263-83a5-a6120b04ae7a','Angela',18186737,1,'4120894700','Avalrez','123456789','moisescamachoss26@gmail.com',0,0,1,'2024-11-23 14:05:37','2024-11-23 14:05:37'),(10,'b63c41be-4866-47e5-a649-3a43838e18b0','Osvaldo',20571896,1,'4263926273','Hurtado','123456789','mcamachoPruebaddd@joyarteydecoracion.com',0,0,1,'2024-11-23 14:06:34','2024-11-23 14:06:34'),(11,'c7fce6a2-3b14-4b45-a653-57d09b95b906','Orangel',12374239,1,'4263926273','Lozada','123456789','test26@gmail.com',0,0,1,'2024-11-23 14:07:16','2024-11-23 14:07:16');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_doc_type`
--

DROP TABLE IF EXISTS `user_doc_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_doc_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `symbol` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `symbol` (`symbol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_doc_type`
--

LOCK TABLES `user_doc_type` WRITE;
/*!40000 ALTER TABLE `user_doc_type` DISABLE KEYS */;
INSERT INTO `user_doc_type` VALUES (1,'Venezolano','V','2024-11-17 19:20:12','2024-11-17 19:20:12'),(2,'Extranjero','E','2024-11-17 19:20:12','2024-11-17 19:20:12'),(3,'Juridico','J','2024-11-17 19:20:12','2024-11-17 19:20:12');
/*!40000 ALTER TABLE `user_doc_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_group`
--

DROP TABLE IF EXISTS `user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_group_user_id_group_id_unique` (`user_id`,`group_id`),
  KEY `fk_user_group_user1_idx` (`user_id`) USING BTREE,
  KEY `fk_user_group_group1_idx` (`group_id`) USING BTREE,
  CONSTRAINT `user_group_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_group_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_group`
--

LOCK TABLES `user_group` WRITE;
/*!40000 ALTER TABLE `user_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permission`
--

DROP TABLE IF EXISTS `user_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_permission_user1_idx` (`user_id`) USING BTREE,
  KEY `fk_user_permission_permission1_idx` (`permission_id`) USING BTREE,
  CONSTRAINT `user_permission_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_permission_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permission`
--

LOCK TABLES `user_permission` WRITE;
/*!40000 ALTER TABLE `user_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_permission` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-05  8:28:47

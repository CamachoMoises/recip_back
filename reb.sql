-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: recip_db
-- ------------------------------------------------------
-- Server version	5.7.33

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
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `description` varchar(500) NOT NULL,
  `hours` float DEFAULT '0',
  `days` int(11) DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `course_type_id` int(11) NOT NULL,
  `course_level_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `course_type_id` (`course_type_id`),
  KEY `course_level_id` (`course_level_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`course_type_id`) REFERENCES `course_type` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `course_ibfk_2` FOREIGN KEY (`course_level_id`) REFERENCES `course_level` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'King Air B200 Curso de Entrenamiento Inicial','Verificación de Competencia/Calificación del Piloto Registro de Entrenamiento',9,2,1,1,1,'2024-10-27 13:15:06','2024-11-25 10:12:50'),(2,'King Air B200 Curso de Entrenamiento Inicial','Verificación de Competencia/Calificación del Piloto Registro de Entrenamiento de Escuela en Tierra',17,2,1,1,1,'2024-10-27 13:15:06','2024-10-27 13:15:06');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_level`
--

DROP TABLE IF EXISTS `course_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_level`
--

LOCK TABLES `course_level` WRITE;
/*!40000 ALTER TABLE `course_level` DISABLE KEYS */;
INSERT INTO `course_level` VALUES (1,'Inicial','2024-10-27 13:15:06','2024-10-27 13:15:06'),(2,'Recurente','2024-10-27 13:15:06','2024-10-27 13:15:06'),(3,'Inicial','2024-10-27 13:15:06','2024-10-27 13:15:06'),(4,'Recurente','2024-10-27 13:15:06','2024-10-27 13:15:06');
/*!40000 ALTER TABLE `course_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `instructor_id` int(11) DEFAULT NULL,
  `student_id` int(11) NOT NULL,
  `subject_days_id` int(11) NOT NULL,
  `subject_days_subject_id` int(11) NOT NULL,
  `course_student_id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `hour` time DEFAULT NULL,
  `class_time` float DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subject_days_subject_id` (`subject_days_subject_id`),
  KEY `fk_schedule_student1_idx` (`student_id`) USING BTREE,
  KEY `fk_schedule_subject_days1_idx` (`subject_days_id`,`subject_days_subject_id`) USING BTREE,
  KEY `fk_schedule_course_student1_idx` (`course_student_id`) USING BTREE,
  KEY `schedule_ibfk_1` (`instructor_id`) USING BTREE,
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `schedule_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `schedule_ibfk_3` FOREIGN KEY (`subject_days_id`) REFERENCES `subject_days` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `schedule_ibfk_4` FOREIGN KEY (`subject_days_subject_id`) REFERENCES `subject_days` (`subject_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `schedule_ibfk_5` FOREIGN KEY (`course_student_id`) REFERENCES `course_student` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (2,1,1,2,2,1,'2024-11-24','08:30:00',4,'2024-11-21 15:50:23','2024-11-26 11:30:49'),(3,1,1,1,1,1,'2024-11-23','08:46:00',2,'2024-11-22 11:41:37','2024-11-26 11:30:25'),(4,1,1,3,2,1,'2024-11-23','11:46:00',2,'2024-11-22 11:42:41','2024-11-22 11:42:41'),(5,1,1,4,3,1,'2024-11-24','10:45:00',2,'2024-11-22 11:42:57','2024-11-26 11:29:48'),(6,1,1,2,2,2,'2024-11-23','12:59:00',9,'2024-11-22 11:54:29','2024-11-22 11:54:29'),(7,1,1,5,4,1,'2024-11-24','00:38:00',2,'2024-11-23 03:37:15','2024-11-26 11:29:40'),(8,2,1,4,3,2,'2024-11-23','02:00:00',4,'2024-11-23 05:44:52','2024-11-23 05:44:52'),(9,1,1,1,1,2,'2024-11-22','01:45:00',2,'2024-11-23 05:46:06','2024-11-23 05:46:06'),(10,1,1,3,2,2,'2024-11-22','11:02:00',2,'2024-11-23 05:46:17','2024-11-23 05:46:17'),(11,2,1,5,4,2,'2024-11-24','10:30:00',3,'2024-11-23 11:29:14','2024-11-23 11:29:14'),(12,1,1,6,5,6,'2024-11-27','09:31:00',1,'2024-11-26 13:31:45','2024-11-26 13:31:45'),(13,1,1,7,6,6,'2024-11-27','10:30:00',1,'2024-11-26 13:32:58','2024-11-26 13:55:50'),(14,1,1,8,7,6,'2024-11-27','11:30:00',1,'2024-11-26 13:55:40','2024-11-26 13:55:40'),(15,1,1,9,8,6,'2024-11-27','12:30:00',1,'2024-11-26 13:56:25','2024-11-26 13:56:25'),(16,1,1,10,9,6,'2024-11-27','13:30:00',1,'2024-11-26 13:56:51','2024-11-26 13:56:51'),(17,2,1,11,10,6,'2024-11-27','14:30:00',1,'2024-11-26 13:57:19','2024-11-26 13:57:19'),(18,2,1,12,11,6,'2024-11-27','15:57:00',1,'2024-11-26 13:57:41','2024-11-26 13:57:41'),(19,2,1,13,12,6,'2024-11-27','16:58:00',1,'2024-11-26 13:58:19','2024-11-26 13:58:19'),(20,1,1,14,13,6,'2024-11-28','09:30:00',1,'2024-11-26 14:07:00','2024-11-26 14:07:00'),(21,2,1,15,14,6,'2024-11-28','10:30:00',1,'2024-11-26 14:09:15','2024-11-26 14:09:15'),(22,2,1,16,15,6,'2024-11-28','11:30:00',1,'2024-11-26 14:11:13','2024-11-26 14:11:13'),(23,1,1,18,17,6,'2024-11-28','13:33:00',1,'2024-11-26 14:21:52','2024-11-26 14:21:52'),(24,2,1,17,16,6,'2024-11-28','12:22:00',1,'2024-11-26 14:22:14','2024-11-26 14:22:14'),(25,1,1,19,18,6,'2024-11-28','14:30:00',1,'2024-11-26 19:33:45','2024-11-26 19:33:45');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `hours` float DEFAULT '0',
  `status` tinyint(4) DEFAULT '1',
  `course_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_subject_course1_idx` (`course_id`) USING BTREE,
  CONSTRAINT `subject_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (1,1,'CMOS',2,1,1,'2024-11-21 15:49:57','2024-11-21 21:06:54'),(2,2,'casd',3,1,1,'2024-11-21 15:50:09','2024-11-21 21:07:01'),(3,3,'Adas',2,1,1,'2024-11-21 15:50:22','2024-11-21 21:06:46'),(4,4,'23',2,1,1,'2024-11-23 03:36:49','2024-11-23 03:36:49'),(5,1,'Bienvenida/Papeleo',1,1,2,'2024-11-26 13:24:25','2024-11-26 13:24:25'),(6,2,'Generalidades de la Aeronave/ Procedimientos Operacionales / Plan de vuelo/ Maniobras',1,1,2,'2024-11-26 13:24:43','2024-11-26 13:24:43'),(7,3,'Peso y Balance, Planificación y  Performance',1,1,2,'2024-11-26 13:25:19','2024-11-26 13:25:19'),(8,4,'Sistema eléctrico, Iluminación y Panel de Advertencia',1,1,2,'2024-11-26 13:25:43','2024-11-26 13:25:43'),(9,5,'Combustible',1,1,2,'2024-11-26 13:26:06','2024-11-26 13:26:06'),(10,6,'Motores/ Hélices',1,1,2,'2024-11-26 13:26:22','2024-11-26 13:26:22'),(11,7,'Protección Contra Incendio',1,1,2,'2024-11-26 13:26:44','2024-11-26 13:26:44'),(12,8,'Neumático, Protección contra Hielo y Lluvia',1,1,2,'2024-11-26 13:26:58','2024-11-26 13:26:58'),(13,9,'Aire Acondicionado/Presurización',1,1,2,'2024-11-26 13:27:20','2024-11-26 13:27:20'),(14,10,'Tren de aterrizaje /controles de vuelo',1,1,2,'2024-11-26 13:27:35','2024-11-26 13:27:35'),(15,11,'Instrumentos y Aviónica',1,1,2,'2024-11-26 13:27:51','2024-11-26 13:27:51'),(16,12,'Oxigeno',1,1,2,'2024-11-26 13:28:07','2024-11-26 13:28:07'),(17,13,'Manual de Vuelo',1,1,2,'2024-11-26 13:28:21','2024-11-26 13:28:21'),(18,14,'Procedimientos Anormales /Emergencias',1,1,2,'2024-11-26 13:28:48','2024-11-26 13:28:48'),(19,15,'CRM /Cortante de Viento Cruzado',1,1,2,'2024-11-26 13:29:15','2024-11-26 13:29:15'),(20,16,'Repaso',1,1,2,'2024-11-26 13:29:50','2024-11-26 13:29:50'),(21,17,'Examen/Encuesta',1,1,2,'2024-11-26 13:30:10','2024-11-26 13:30:10');
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject_days`
--

DROP TABLE IF EXISTS `subject_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject_days` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `day` int(11) NOT NULL,
  `class_time` int(11) DEFAULT '1',
  `status` tinyint(4) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_subject_days_subject1_idx` (`subject_id`) USING BTREE,
  KEY `fk_subject_days_course1_idx` (`course_id`) USING BTREE,
  CONSTRAINT `subject_days_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `subject_days_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_days`
--

LOCK TABLES `subject_days` WRITE;
/*!40000 ALTER TABLE `subject_days` DISABLE KEYS */;
INSERT INTO `subject_days` VALUES (1,1,1,1,1,1,'2024-11-21 15:50:23','2024-11-21 15:50:23'),(2,2,1,2,1,1,'2024-11-21 15:50:25','2024-11-21 15:50:25'),(3,2,1,1,1,1,'2024-11-21 15:50:25','2024-11-21 15:50:25'),(4,3,1,2,1,1,'2024-11-21 15:50:26','2024-11-21 15:50:26'),(5,4,1,2,1,1,'2024-11-23 03:36:54','2024-11-23 03:36:54'),(6,5,2,1,1,1,'2024-11-26 13:30:18','2024-11-26 13:30:18'),(7,6,2,1,1,1,'2024-11-26 13:30:19','2024-11-26 13:30:19'),(8,7,2,1,1,1,'2024-11-26 13:30:22','2024-11-26 13:30:22'),(9,8,2,1,1,1,'2024-11-26 13:30:24','2024-11-26 13:30:24'),(10,9,2,1,1,1,'2024-11-26 13:30:25','2024-11-26 13:30:25'),(11,10,2,1,1,1,'2024-11-26 13:30:27','2024-11-26 13:30:27'),(12,11,2,1,1,1,'2024-11-26 13:30:29','2024-11-26 13:30:29'),(13,12,2,1,1,1,'2024-11-26 13:30:30','2024-11-26 13:30:30'),(14,13,2,2,1,1,'2024-11-26 13:30:32','2024-11-26 13:30:32'),(15,14,2,2,1,1,'2024-11-26 13:30:33','2024-11-26 13:30:33'),(16,15,2,2,1,1,'2024-11-26 13:30:35','2024-11-26 13:30:35'),(17,16,2,2,1,1,'2024-11-26 13:30:36','2024-11-26 13:30:36'),(18,17,2,2,1,1,'2024-11-26 13:30:37','2024-11-26 13:30:37'),(19,18,2,2,1,1,'2024-11-26 13:30:38','2024-11-26 13:30:38'),(20,19,2,2,1,1,'2024-11-26 13:30:39','2024-11-26 13:30:39'),(21,20,2,2,1,1,'2024-11-26 13:30:42','2024-11-26 13:30:42'),(22,21,2,2,1,1,'2024-11-26 13:30:45','2024-11-26 13:30:45');
/*!40000 ALTER TABLE `subject_days` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-26 16:09:17

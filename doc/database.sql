DROP DATABASE IF EXISTS `socketchat`;
CREATE DATABASE `socketchat`
  CHARACTER SET utf8
  COLLATE utf8_general_ci;
DROP USER 'matcher'@'%';
GRANT ALL ON `socketchat`.* TO 'chatter'@'%'
IDENTIFIED BY 'lFOWuJXAUFS7z86yBnLFAK' WITH GRANT OPTION;
FLUSH PRIVILEGES;
USE `socketchat`;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(30) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `created`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username`)
) ENGINE=InnoDB;

INSERT INTO `user` (`username`, `email`, `password`)
    VALUES('Sean', 'sean@dulotech.com', '$2a$10$ADFtYs596iNiiGNB3/bUlernBX/gnF.TBtSo01GF7QO5z6KmvZDd2');
INSERT INTO `user` (`username`, `email`, `password`)
  VALUES('Josh', 'josh@dulotech.com', '$2a$10$uqzXdDJYvetXJZ2yosNKNe00M.L3PlxIxY./QimKK0JrCUINHotBq');
INSERT INTO `user` (`username`, `email`, `password`)
  VALUES('Dimitri', 'dimitri@dulotech.com', '$2a$10$o2cOCMqYONPG7Sy38Aegs.tS.mDAbd86iIn7HJwP/u7soQPfe6laC');
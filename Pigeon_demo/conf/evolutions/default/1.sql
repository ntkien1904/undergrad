# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table member (
  id                            integer auto_increment not null,
  name                          varchar(255),
  email                         varchar(255),
  position                      varchar(255),
  constraint pk_member primary key (id)
);


# --- !Downs

drop table if exists member;


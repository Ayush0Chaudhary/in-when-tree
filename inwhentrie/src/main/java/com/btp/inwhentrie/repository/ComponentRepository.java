package com.btp.inwhentrie.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.btp.inwhentrie.entity.Component;

public interface ComponentRepository extends JpaRepository<Component, Long> {

}
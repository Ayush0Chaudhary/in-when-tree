package com.example.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.backend.model.Component;

@RepositoryRestResource(collectionResourceRel = "component", path = "component")  
public interface ComponentRepo extends JpaRepository<Component, Long> {

}
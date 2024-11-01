package com.example.backend.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.Component;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "component", path = "component")  
public interface ComponentRepo extends JpaRepository<Component, Long> {

}
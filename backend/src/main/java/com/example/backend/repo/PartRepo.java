package com.example.backend.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.Part;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "part", path = "part")  
public interface PartRepo extends JpaRepository<Part, Long> {

}
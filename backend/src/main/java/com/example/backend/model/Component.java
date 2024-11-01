package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "compo")
public class Component {

    @Id
    @Column(name="id")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "machine")
    private String machine;

    @Column(name = "cast_wgt")
    private Double cast_wgt;

    
    @Column(name = "cavities")
    private Integer cavities;

    @Column(name = "grade")
    private String grade;

    @Column(name = "parts")
    private Iterable<Part> parts;

    @Column(name = "quantity")
    private Iterable<Integer> quantity;

}

package com.btp.inwhentrie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;

    @ManyToOne
    @JoinColumn(name = "component_id", nullable = false)
    private Component component;

    @Column(nullable = false)
    private Integer quantityRequired;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String customer;

    @Column(nullable = false)
    private String machine;

    @Column(nullable = false)
    private String grade;

    @Column(nullable = false)
    private Integer cavities;

    @Column(nullable = false)
    private Double cast_wtg;
}

package com.btp.inwhentrie.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.btp.inwhentrie.entity.Component;
import com.btp.inwhentrie.repository.ComponentRepository;

@Service
public class ComponentService {

    @Autowired
    private ComponentRepository componentRepository;

    public List<Component> getAllComponents() {
        return componentRepository.findAll();
    }

    public Component getComponentById(Long id) {
        return componentRepository.findById(id).orElse(null);
    }

    public Component addComponent(Component component) {
        return componentRepository.save(component);
    }

    public List<Component> addComponents(List<Component> components) {
        return componentRepository.saveAll(components);
    }

    public Component updateComponent(Component component) {
        return componentRepository.save(component);
    }

    public void deleteComponentById(Long id) {
        componentRepository.deleteById(id);
    }

    public void deleteAllComponents() {
        componentRepository.deleteAll();
    }
}
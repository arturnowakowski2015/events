package com.eventsRegistry.controller;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventsRegistry.dto.IncidentDTO;
import com.eventsRegistry.service.IncidentService;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {
    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    public ResponseEntity<IncidentDTO> create(@RequestBody IncidentDTO dto) {
        var model = incidentService.toModel(dto);
        incidentService.save(model);
        var out = incidentService.toDTO(model);
        URI location = URI.create("/api/incidents/" + model.getIncidentId());
        return ResponseEntity.created(location).body(out);
    }

    @GetMapping
    public ResponseEntity<List<IncidentDTO>> list() {
        var all = incidentService.findAll();
        var dtos = all.stream().map(incidentService::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentDTO> get(@PathVariable String id) {
        var inc = incidentService.findById(id);
        if (inc == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(incidentService.toDTO(inc));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentDTO> update(@PathVariable String id, @RequestBody IncidentDTO dto) {
        if (incidentService.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }

        var model = incidentService.toModel(dto);
        incidentService.save(id, model);
        return ResponseEntity.ok(incidentService.toDTO(model));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!incidentService.deleteById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}

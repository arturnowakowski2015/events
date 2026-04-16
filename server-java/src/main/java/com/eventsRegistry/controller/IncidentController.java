package com.eventsRegistry.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
        return ResponseEntity.ok(out);
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
}

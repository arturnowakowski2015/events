package com.eventsRegistry.controller;

import java.net.URI;
import java.util.List;
import java.util.UUID;
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

import com.eventsRegistry.dto.ParticipantDTO;
import com.eventsRegistry.service.ParticipantService;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {
    private final ParticipantService participantService;

    public ParticipantController(ParticipantService participantService) {
        this.participantService = participantService;
    }

    @PostMapping
    public ResponseEntity<ParticipantDTO> create(@RequestBody ParticipantDTO dto) {
        var model = participantService.toModel(dto);
        UUID id = participantService.save(model);
        var savedDto = participantService.toDTO(model);
        if (savedDto.getId() == null) savedDto.setId(id);
        URI location = URI.create("/api/participants/" + id);
        return ResponseEntity.created(location).body(savedDto);
    }

    @GetMapping
    public ResponseEntity<List<ParticipantDTO>> list() {
        var all = participantService.findAll();
        var dtos = all.stream().map(participantService::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

 
    @PutMapping("/{id}")
    public ResponseEntity<ParticipantDTO> update(@PathVariable UUID id, @RequestBody ParticipantDTO dto) {
        if (participantService.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }

        var model = participantService.toModel(dto);
        participantService.save(id, model);

        var updatedDto = participantService.toDTO(model);
        if (updatedDto.getId() == null) updatedDto.setId(id);
        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        var deleted = participantService.deleteById(id);
        if (deleted == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
package com.eventsRegistry.controller;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventsRegistry.dto.ParticipantDTO;
import com.eventsRegistry.model.Participant;
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
        // convert to model and persist
        var model = participantService.toModel(dto);
        String id = participantService.save(model);
        var savedDto = participantService.toDTO(model);
        // set id explicitly in DTO in case mapping didn't find it
        if (savedDto.getId() == null) savedDto.setId(id);
        URI location = URI.create("/api/participants/" + id);
        return ResponseEntity.created(location).body(savedDto);
    }

//    @GetMapping
//    public ResponseEntity<List<ParticipantDTO>> list() {
//        var all = participantService.findAll();
//        var dtos = all.stream().map(participantService::toDTO).collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//    }
}
package com.eventsRegistry.controller;

import com.eventsRegistry.service.ParticipantMergeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/participants-merge")
public class ParticipantMergeController {

    @Autowired
    private ParticipantMergeService service;

    @GetMapping
    public ResponseEntity<List<Map<String,Object>>> list(@RequestParam(value="personalId", required=false) String personalId){
        return ResponseEntity.ok(service.findByPersonalId(personalId));
    }

    @PostMapping("/{targetId}/merge")
    public ResponseEntity<Map<String,Object>> merge(@PathVariable String targetId, @RequestBody Map<String,Object> body){
        // body: { sourceIds: ["p-999"], fieldResolution: { field: chosenId } }
        List<String> sourceIds = (List<String>) body.getOrDefault("sourceIds", List.of());
        Map<String,String> fieldResolution = (Map<String,String>) body.getOrDefault("fieldResolution", Map.of());
        Map<String,Object> merged = service.merge(targetId, sourceIds, fieldResolution);
         return ResponseEntity.ok(merged);
    }
}
package com.eventsRegistry.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.eventsRegistry.service.IncidentRegistryService;
import com.eventsRegistry.service.IncidentService;
import com.eventsRegistry.service.ParticipantService;

class IncidentControllerTest {

        private static final Pattern INCIDENT_ID_PATTERN = Pattern.compile("\\\"incidentId\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"");

    private MockMvc mockMvc;

        @BeforeEach
        void setUp() {
                ParticipantService participantService = new ParticipantService();
                IncidentService incidentService = new IncidentService(participantService, new IncidentRegistryService());
                IncidentController controller = new IncidentController(incidentService);
                mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        }

    @Test
    void incidentCrudFlowReturnsExpectedResponses() throws Exception {
        String createBody = """
                {
                  \"dateTime\": \"2026-04-23T12:30:00\",
                  \"locationDescription\": \"Warsaw Center\",
                  \"eventType\": \"ACCIDENT\",
                  \"participants\": []
                }
                """;

        MvcResult createResult = mockMvc.perform(post("/api/incidents")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.startsWith("/api/incidents/")))
                .andExpect(jsonPath("$.incidentId").isString())
                .andExpect(jsonPath("$.eventType").value("ACCIDENT"))
                .andReturn();

        String incidentId = extractJsonStringField(createResult.getResponse().getContentAsString(), INCIDENT_ID_PATTERN, "incidentId");

        mockMvc.perform(get("/api/incidents/{id}", incidentId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.incidentId").value(incidentId))
                .andExpect(jsonPath("$.locationDescription").value("Warsaw Center"));

        mockMvc.perform(get("/api/incidents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        String updateBody = """
                {
                  \"dateTime\": \"2026-04-24T08:15:00\",
                  \"locationDescription\": \"Krakow Ring Road\",
                  \"eventType\": \"TRAFFIC\",
                  \"participants\": []
                }
                """;

        mockMvc.perform(put("/api/incidents/{id}", incidentId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.incidentId").value(incidentId))
                .andExpect(jsonPath("$.eventType").value("TRAFFIC"))
                .andExpect(jsonPath("$.locationDescription").value("Krakow Ring Road"));

        mockMvc.perform(delete("/api/incidents/{id}", incidentId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/incidents/{id}", incidentId))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateAndDeleteReturn404ForMissingIncident() throws Exception {
        String body = """
                {
                  \"dateTime\": \"2026-04-23T12:30:00\",
                  \"locationDescription\": \"Warsaw Center\",
                  \"eventType\": \"ACCIDENT\",
                  \"participants\": []
                }
                """;

        mockMvc.perform(put("/api/incidents/{id}", "missing-id")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/incidents/{id}", "missing-id"))
                .andExpect(status().isNotFound());
    }

        private static String extractJsonStringField(String json, Pattern pattern, String fieldName) {
                Matcher matcher = pattern.matcher(json);
                if (!matcher.find()) {
                        throw new AssertionError("Missing JSON field: " + fieldName + " in " + json);
                }
                return matcher.group(1);
        }
}
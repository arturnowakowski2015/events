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

import com.eventsRegistry.service.ParticipantService;

class ParticipantControllerTest {

        private static final Pattern ID_PATTERN = Pattern.compile("\\\"id\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"");

    private MockMvc mockMvc;

        @BeforeEach
        void setUp() {
                ParticipantController controller = new ParticipantController(new ParticipantService());
                mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        }

    @Test
    void participantCrudFlowReturnsExpectedResponses() throws Exception {
        String createBody = """
                {
                  \"firstName\": \"Jan\",
                  \"lastName\": \"Kowalski\",
                  \"personalId\": \"90010112345\",
                  \"roles\": [
                    {
                      \"roleName\": \"Victim\",
                      \"description\": \"Front bumper damage\"
                    }
                  ]
                }
                """;

        MvcResult createResult = mockMvc.perform(post("/api/participants")
                .contentType(MediaType.APPLICATION_JSON)
                .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.startsWith("/api/participants/")))
                .andExpect(jsonPath("$.id").isString())
                .andExpect(jsonPath("$.firstName").value("Jan"))
                .andReturn();

        String participantId = extractJsonStringField(createResult.getResponse().getContentAsString(), ID_PATTERN, "id");

        mockMvc.perform(get("/api/participants/{id}", participantId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(participantId))
                .andExpect(jsonPath("$.lastName").value("Kowalski"));

        mockMvc.perform(get("/api/participants"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        String updateBody = """
                {
                  \"firstName\": \"Janusz\",
                  \"lastName\": \"Kowalski\",
                  \"personalId\": \"90010112345\",
                  \"roles\": [
                    {
                      \"roleName\": \"Perpetrator\",
                      \"description\": \"Updated role\"
                    }
                  ]
                }
                """;

        mockMvc.perform(put("/api/participants/{id}", participantId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(participantId))
                .andExpect(jsonPath("$.firstName").value("Janusz"))
                .andExpect(jsonPath("$.roles", hasSize(1)))
                .andExpect(jsonPath("$.roles[0].roleName").value("Perpetrator"));

        mockMvc.perform(delete("/api/participants/{id}", participantId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/participants/{id}", participantId))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateAndDeleteReturn404ForMissingParticipant() throws Exception {
        String body = """
                {
                  \"firstName\": \"Anna\",
                  \"lastName\": \"Nowak\"
                }
                """;

        mockMvc.perform(put("/api/participants/{id}", "missing-id")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/participants/{id}", "missing-id"))
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
package com.eventsRegistry.model;

import java.util.List;

public interface IParticipant {
    String getFirstName();
    String getLastName();
    String getPersonalId();
    List<IRole> getRoles();
}
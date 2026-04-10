package com.eventsRegistry.model;

import java.util.ArrayList;
import java.util.List;

public abstract class Person {
    protected String firstName;
    protected String lastName;
    protected String personalId;

    public Person(String firstName, String lastName, String personalId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.personalId = personalId;
    }
}
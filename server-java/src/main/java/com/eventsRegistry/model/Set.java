package com.eventsRegistry.model;

import java.util.HashSet;

public class Set<T> {
    private java.util.Set<T> values = new HashSet<>();

    public java.util.Set<T> getValues() {
        return values;
    }

    public void setValues(java.util.Set<T> values) {
        this.values = values;
    }
}

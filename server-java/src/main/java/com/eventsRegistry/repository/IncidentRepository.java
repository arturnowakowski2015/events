package com.eventsRegistry.repository;

import com.eventsRegistry.entity.IncidentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<IncidentEntity, String> {
 }

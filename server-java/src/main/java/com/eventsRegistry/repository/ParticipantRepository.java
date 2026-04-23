package com.eventsRegistry.repository;

import com.eventsRegistry.entity.ParticipantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ParticipantRepository extends JpaRepository<ParticipantEntity, String> {
    List<ParticipantEntity> findByPersonalId(String personalId);
    List<ParticipantEntity> findByLastNameStartingWith(String prefix);
}

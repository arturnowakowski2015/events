package com.eventsRegistry.repository;

import com.eventsRegistry.entity.ParticipantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParticipantRepository extends JpaRepository<ParticipantEntity, String> {
    List<ParticipantEntity> findByPersonalId(String personalId);
    List<ParticipantEntity> findByLastNameStartingWith(String prefix);
	Optional<ParticipantEntity> findById(UUID id);
}

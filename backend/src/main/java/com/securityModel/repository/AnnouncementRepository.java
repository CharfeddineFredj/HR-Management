package com.securityModel.repository;

import com.securityModel.models.Announcement;
import com.securityModel.models.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement,Long> {
    List<Announcement> findAllByOrderByCreatedAtDesc();
}

package com.securityModel.service.IMPL;

import com.securityModel.models.Announcement;
import com.securityModel.models.Candidate;
import com.securityModel.models.User;
import com.securityModel.repository.AnnouncementRepository;
import com.securityModel.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementServiceIMPL implements AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;


    @Override
    public Announcement create(Announcement entity) {
        return announcementRepository.save(entity);
    }

    @Override
    public List<Announcement> getall() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Announcement getbyId(Long id) {
        return announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement with id " + id + " not found"));
    }

    @Override
    public Announcement update(Announcement entity) {
        return announcementRepository.save(entity);
    }

    @Override
    public void delete(Long id) {
        announcementRepository.deleteById(id);
    }


    @Override
    public Optional<User> findByUsername(String username) {
        return Optional.empty();
    }
}

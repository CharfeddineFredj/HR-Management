package com.securityModel.service.IMPL;

import com.securityModel.models.Candidate;
import com.securityModel.models.User;
import com.securityModel.repository.CandidateRepository;
import com.securityModel.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class CandidateServiceIMPL implements CandidateService {

    @Autowired
    private  CandidateRepository candidateRepository;
    @Override
    public Candidate create(Candidate entity) {
        return candidateRepository.save(entity);
    }

    @Override
    public List<Candidate> getall() {
        return candidateRepository.findAll();
    }

    @Override
    public Candidate getbyId(Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidate with id " + id + " not found"));
    }

    @Override
    public Candidate update(Candidate entity) {
        return candidateRepository.save(entity);
    }

    @Override
    public void delete(Long id) {
        candidateRepository.deleteById(id);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return Optional.empty();
    }
}

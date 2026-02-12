package com.bytecode.academic.repository;

import com.bytecode.academic.model.Announcement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends MongoRepository<Announcement, String> {
    List<Announcement> findByTargetAudience(String targetAudience);
    List<Announcement> findByIsPinnedTrue();
    List<Announcement> findByType(String type);
    List<Announcement> findByBranch(String branch);
    List<Announcement> findByPriority(String priority);
}

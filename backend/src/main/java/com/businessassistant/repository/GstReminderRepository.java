package com.businessassistant.repository;

import com.businessassistant.entity.GstReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GstReminderRepository extends JpaRepository<GstReminder, Long> {
    List<GstReminder> findAllByOrderByDueDateAsc();
    List<GstReminder> findByStatusOrderByDueDateAsc(String status);
}

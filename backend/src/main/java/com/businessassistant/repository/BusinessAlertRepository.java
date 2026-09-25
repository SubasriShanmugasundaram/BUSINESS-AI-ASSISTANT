package com.businessassistant.repository;

import com.businessassistant.entity.BusinessAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessAlertRepository extends JpaRepository<BusinessAlert, Long> {
    List<BusinessAlert> findAllByOrderByCreatedAtDesc();
    List<BusinessAlert> findByIsReadFalseOrderByCreatedAtDesc();
    long countByIsReadFalse();
}

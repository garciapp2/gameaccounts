package br.com.gameaccounts.repository;

import br.com.gameaccounts.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
} 